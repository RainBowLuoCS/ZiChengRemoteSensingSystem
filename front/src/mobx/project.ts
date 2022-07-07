// todo: 考虑用设计模式重构
import { makeAutoObservable } from 'mobx'
import { Project } from '../types/project/Project'
import { Img, Group } from '../types/project/ImgAndGroup'
import { ObjectType } from '../types/objectDetection/ObjectType'
import { PostDetectReqData } from '../types/objectDetection/ObjectDetection'
import { generateUUID } from '../utils/uuid'
import { postDetectReq } from '../network/changeDetection/postDetectReq'
import { postDetectReq as postObjDetectReq } from '../network/objectDetection/postObjDetectReq'
import { postSortReq } from '../network/terrainClassification/postSortReq'
import { postExtractReq } from '../network/objectExtract/postExtractReq'
import { postAnalyseReq } from '../network/analyse/postAnalyseReq'
import { getUpdatedImgs } from '../network/project/getUpdatedImgs'
import { getRecentProjects } from '../network/project/getRecentProjects'

// 项目相关信息
class ProjectState {
  // 项目id
  id = 0
  // 项目名称
  name = ''
  // 未分组的图片信息
  imgs: Img[] = []
  // 分组图片信息
  imgGroups: Group[] = []
  // 被选中的图，在页面上呈现
  chosenImgs: Img[] = []
  // 当前是否展示视图
  showPerspective = false
  // 是否显示放大的图片
  showDetail = false

  /* 变化检测 */
  // 待分析图片组，用于渲染页面
  waitingGroupId: number = 0
  // 初始化
  waitingGroups = [
    {
      id: this.waitingGroupId,
      oldImg: {
        uuid: '',
        name: '',
        url: ''
      },
      newImg: {
        uuid: '',
        name: '',
        url: ''
      }
    }
  ]
  // 展示轴测 or 平面
  displayType: 0 | 1 = 0

  // 目前展示的组
  currentShownGroup: Group = {
    groupID: 0,
    groupName: '',
    groupType: 2,
    info: {} as any,
    pictures: [
      {
        uuid: '',
        name: '',
        url: '',
        isShown: true
      },
      {
        uuid: '',
        name: '',
        url: '',
        isShown: true
      },
      {
        uuid: '',
        name: '',
        url: '',
        isShown: true
      }
    ],
    isShown: true
  }
  // 用于平面视角
  currentShownGroups: Group[] = []
  // 展成图片数组
  currentShownImgs: Img[] = []
  // 当前检测图合集，即currentShownGroups里每个组的第一张图
  generatedImgs: Img[] = []
  // 选择用于遮罩的图片
  coverImg: Img = {
    url: '',
    name: '',
    uuid: '',
    isShown: true
  }
  // 图片名称数组，用于多选框
  imgNameArr: string[] = []
  // 单图片待分析图片组(和变化检测区分)
  singleWaitingGroups: Img[] = []
  // 是否显示结果分析
  showResultAnalysis = false

  constructor() {
    makeAutoObservable(this)
  }

  // id改变，初始化store
  init(id: number) {
    if (id !== this.id) {
      this.id = id
      this.imgs = []
      this.imgGroups = []
      this.chosenImgs = []
      this.waitingGroupId = 0
      this.waitingGroups = [
        {
          id: this.waitingGroupId,
          oldImg: {
            uuid: '',
            name: '',
            url: ''
          },
          newImg: {
            uuid: '',
            name: '',
            url: ''
          }
        }
      ]
      this.showPerspective = false
      this.showDetail = false
      this.displayType = 0
      this.currentShownGroup = {
        groupID: 0,
        groupName: '',
        groupType: 2,
        info: {} as any,
        pictures: [
          {
            uuid: '',
            name: '',
            url: '',
            isShown: true
          },
          {
            uuid: '',
            name: '',
            url: '',
            isShown: true
          },
          {
            uuid: '',
            name: '',
            url: '',
            isShown: true
          }
        ],
        isShown: true
      }
      this.generatedImgs = []
      this.coverImg = {
        url: '',
        name: '',
        uuid: '',
        isShown: true
      }
      this.currentShownGroups = []
      this.currentShownImgs = []
      this.imgNameArr = []
      this.singleWaitingGroups = []
      this.showResultAnalysis = false
    }
  }
  // 设置项目名称
  async setProjectName(name: string) {
    if (name !== '') this.name = name
    else if (this.name !== '') return
    else {
      const res = await getRecentProjects()
      const projects = res.data.projects
      if (projects) {
        const t = projects.find((item) => (item.id = this.id)) as Project
        this.name = t.name
      }
    }
  }
  // 在上传图片后更新
  updateImgs(val: Img[]) {
    this.imgs = val
    this.showAllImgs()
  }
  // 设置所有图片的相关属性
  showAllImgs() {
    this.chosenImgs.forEach((item) => {
      item.isShown = true
      item.groupID = 0
      item.groupShown = false
    })
  }
  // 在检测完成后更新
  updateImgGroup(val: Group[]) {
    this.imgGroups = val
    // 设置所有组状态为不可见
    this.hideAllGroups()
  }
  // 设置选中的图片，即waitingGroups的第一组，用于在左侧显示
  updateChosenImgs(val: Img[]) {
    this.chosenImgs = val
  }
  // 插入空waitingImgs
  addWaitingImgs() {
    this.waitingGroups.push({
      id: ++this.waitingGroupId,
      oldImg: {
        uuid: '',
        name: '',
        url: ''
      },
      newImg: {
        uuid: '',
        name: '',
        url: ''
      }
    })
  }
  // 修改waitingImgs
  updateWaitingImgs(id: number, type: 0 | 1, val: string) {
    const pair = this.waitingGroups.find((item) => item.id === id)
    if (pair) {
      // 在img中找
      let img = this.imgs.find((item) => item.name === val)
      // 在groups中找
      if (!img) {
        for (const group of this.imgGroups) {
          img = group.pictures.find((item) => item.name === val)
          if (img) break
        }
      }
      if (img) {
        if (type === 0) {
          pair.oldImg = img
        } else {
          pair.newImg = img
        }
      }
    }
  }
  // 删除waitingImgs
  deleteWaitingImgs(id: number) {
    if (this.waitingGroups.length > 1) {
      this.waitingGroups = this.waitingGroups.filter((item) => item.id !== id)
    }
  }
  // 修改目前展示的组
  updateCurShownGroup(groupID: number) {
    const t = this.imgGroups.find((item) => item.groupID === groupID) as Group

    t.pictures.forEach((item) => {
      item.isShown = true
    })

    this.currentShownGroup = {
      groupID: groupID,
      groupType: t.groupType,
      groupName: t.groupName,
      info: t.info,
      pictures: t.pictures as {
        uuid: string
        name: string
        url: string
        isShown: boolean
      }[],
      isShown: true
    }
  }
  // 用于平面视角
  updateCurShownGroups(type: 1 | 2 | 3 | 4 | 5) {
    this.currentShownGroups = []
    // 从 this.imgGroups 产生
    this.imgGroups.forEach((item) => {
      if (item.groupType === type) {
        item.isShown = false
        item.pictures.forEach((item) => (item.isShown = true))
        this.currentShownGroups.push(item)
      }
    })
    this.setGeneratedImgs()
    this.coverImg = this.currentShownGroup.pictures[0]
  }
  // 将currentShownGroups展平成图片数组
  updateCurShownImgs() {
    this.currentShownImgs = []
    this.currentShownGroups.forEach((item) => {
      item.pictures.forEach((_item) => {
        _item.groupID = item.groupID
        _item.groupShown = item.isShown
        this.currentShownImgs.push(_item)
      })
    })
  }
  // 设置检测图合集
  setGeneratedImgs() {
    this.generatedImgs = []
    // 从 this.currentShownGroups 产生
    this.currentShownGroups.forEach((item) =>
      this.generatedImgs.push(item.pictures[0])
    )
  }
  // 设置遮罩图
  setCoverImg(val: Img) {
    this.coverImg = val
  }
  setCoverImgByName(name: string) {
    const t = this.generatedImgs.find((item) => item.name === name) as Img
    this.coverImg = t
  }
  // 控制组的隐藏与显示
  setGroupDisplayStatus(groupID: number, val?: boolean) {
    const t = this.imgGroups.find((item) => item.groupID === groupID) as Group
    if (val !== undefined) {
      t.isShown = val
    } else {
      t.isShown = !t.isShown
    }
    // 修改 this.currentShownImgs
    this.currentShownImgs.forEach((item) => {
      if (item.groupID === groupID) {
        if (val !== undefined) {
          item.groupShown = val
        } else {
          item.groupShown = !item.groupShown
        }
      }
    })
  }
  // 将所有组都隐藏
  hideAllGroups() {
    this.imgGroups.forEach((item) => {
      item.isShown = false
    })
  }
  // 控制图层的隐藏与显示
  setLayerDisplayStatus(groupID: number, uuid: string) {
    const group = this.imgGroups.find(
      (item) => item.groupID === groupID
    ) as Group
    const img = group.pictures.find((item) => item.uuid === uuid) as Img

    img.isShown = !img.isShown as boolean
  }
  // 修改展示状态
  setShowPerspective(val: boolean) {
    this.showPerspective = val
  }
  // 展示图片细节
  setShowDetail(val: boolean) {
    this.showDetail = val
  }
  // 修改展示的type
  setDisplayType(val: 0 | 1) {
    this.displayType = val
  }
  // 更新imgNameArr
  updateImgNameArr(arr: string[]) {
    this.imgNameArr = arr
    this.updateSingleWaitingGroups()
  }
  // 更新singleWaitingGroups
  updateSingleWaitingGroups() {
    this.singleWaitingGroups = []
    if (this.imgNameArr.length > 0) {
      this.imgNameArr.forEach((name) => {
        const t = this.imgs.find((item) => item.name === name) as Img
        this.singleWaitingGroups.push(t)
      })
    }
  }
  // 开始变化检测
  async changeDetect(targetName: string) {
    // 构造请求数据
    const reqData = []
    for (let i = 0; i < this.waitingGroups.length; i++) {
      const item = this.waitingGroups[i]
      const t = {
        projectID: this.id,
        oldUUID: item.oldImg.uuid,
        newUUID: item.newImg.uuid,
        targetUUID: generateUUID(),
        targetName
      }
      if (t.oldUUID !== '' && t.newUUID !== '') {
        reqData.push(t)
      }
    }

    // 并行发送请求
    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      promiseArr.push(postDetectReq(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(this.id.toString()).then((res) => {
        const data = res.data
        this.updateImgs(data.pictures)
        this.updateImgGroup(data.groups)

        const t = data.groups.find((item) => item.groupType === 5) as Group
        this.updateCurShownGroup(t.groupID)
        this.updateCurShownGroups(5)
        this.updateCurShownImgs()
        this.hideAllGroups()
        this.setGroupDisplayStatus(t.groupID)
      })
    })
  }
  // 开始地物分类
  async terrainClassification(targetName: string) {
    // 构造请求数据
    const reqData = []
    for (let i = 0; i < this.singleWaitingGroups.length; i++) {
      const item = this.singleWaitingGroups[i]
      const t = {
        projectID: this.id,
        originUUID: item.uuid,
        targetUUID: generateUUID(),
        targetName
      }
      if (t.originUUID !== '') {
        reqData.push(t)
      }
    }

    // 并行发送请求
    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      promiseArr.push(postSortReq(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(this.id.toString()).then((res) => {
        const data = res.data
        this.updateImgs(data.pictures)
        this.updateImgGroup(data.groups)

        const t = data.groups.find((item) => item.groupType === 3) as Group
        this.updateCurShownGroup(t.groupID)
        this.updateCurShownGroups(3)
        this.updateCurShownImgs()
        this.hideAllGroups()
        this.setGroupDisplayStatus(t.groupID)
      })
    })
  }
  // 开始目标提取
  async objectExtract(targetName: string) {
    // 构造请求数据
    const reqData = []
    for (let i = 0; i < this.singleWaitingGroups.length; i++) {
      const item = this.singleWaitingGroups[i]
      const t = {
        projectID: this.id,
        originUUID: item.uuid,
        targetUUID: generateUUID(),
        targetName
      }
      if (t.originUUID !== '') {
        reqData.push(t)
      }
    }

    // 并行发送请求
    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      promiseArr.push(postExtractReq(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(this.id.toString()).then((res) => {
        const data = res.data
        this.updateImgs(data.pictures)
        this.updateImgGroup(data.groups)
        const t = data.groups.find((item) => item.groupType === 2) as Group
        this.updateCurShownGroup(t.groupID)
        this.updateCurShownGroups(2)
        this.updateCurShownImgs()
        this.hideAllGroups()
        this.setGroupDisplayStatus(t.groupID)
      })
    })
  }
  // 开始目标检测
  async objectDetect(targetName: string, type: ObjectType) {
    // 构造请求数据
    const reqData = []
    for (let i = 0; i < this.singleWaitingGroups.length; i++) {
      const item = this.singleWaitingGroups[i]
      const t = {
        projectID: this.id,
        type,
        originUUID: item.uuid,
        targetUUID: generateUUID(),
        targetName
      } as PostDetectReqData

      if (t.originUUID !== '') {
        reqData.push(t)
      }
    }

    // 并行发送请求
    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      promiseArr.push(postObjDetectReq(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(this.id.toString()).then((res) => {
        const data = res.data
        this.updateImgs(data.pictures)
        this.updateImgGroup(data.groups)
        const t = data.groups.find((item) => item.groupType === 4) as Group
        this.updateCurShownGroup(t.groupID)
        this.updateCurShownGroups(4)
        this.updateCurShownImgs()
        this.hideAllGroups()
        this.setGroupDisplayStatus(t.groupID)
      })
    })
  }
  // 开始综合分析
  async analyse(targetName: string) {
    // 构造请求数据
    const reqData = []
    for (let i = 0; i < this.singleWaitingGroups.length; i++) {
      const item = this.singleWaitingGroups[i]
      const t = {
        projectID: this.id,
        originUUID: item.uuid
        // targetName
      }
      if (t.originUUID !== '') {
        reqData.push(t)
      }
    }

    // 并行发送请求
    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      console.log(item)
      promiseArr.push(postAnalyseReq(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(this.id.toString()).then((res) => {
        const data = res.data
        this.updateImgs(data.pictures)
        this.updateImgGroup(data.groups)

        const t = data.groups.find((item) => item.groupType === 1) as Group
        this.updateCurShownGroup(t.groupID)
        this.updateCurShownGroups(1)
        this.updateCurShownImgs()
        this.hideAllGroups()
        this.setGroupDisplayStatus(t.groupID)
      })
    })
  }
  // 设置showResultAnalysis
  setShowResultAnalysis(val?: boolean) {
    if (val === undefined) {
      this.showResultAnalysis = !this.showResultAnalysis
    } else {
      this.showResultAnalysis = val
    }
  }
}

export const ProjectStore = new ProjectState()
