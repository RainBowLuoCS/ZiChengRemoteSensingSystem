import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SvgIcon from '../SvgIcon'
import List from '@mui/material/List'
import Group from './components/Group'
import Item from './components/Item'
import Loading from './components/Loading'
import MyPieChart from './components/PieChart'
import ChartList from './components/ChartList'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useParams } from '../../hooks/useParams'
import { toolBarStyles } from './styles'
import { ProjectStore } from '../../mobx/project'
import { HeightStore } from '../../mobx/height'
import { uploadFile } from '../../network/project/uploadFile'
import { getUpdatedImgs } from '../../network/project/getUpdatedImgs'
import { generateUUID } from '../../utils/uuid'
import { objectDetectionColors } from '../../consts/color'

function _ToolBar() {
  const id = useParams('id') as string
  const body = document.body
  const [isUploading, setIsUploading] = useState(false)
  const { pathname } = useLocation()

  const type =
    pathname === '/analysis'
      ? 1
      : pathname === '/change-detection'
      ? 5
      : pathname === '/terrain-classification'
      ? 3
      : pathname === '/object-extract'
      ? 2
      : 4

  useEffect(() => {
    ProjectStore.init(parseInt(id))

    getUpdatedImgs(id).then((res) => {
      const data = res.data
      // console.log(data)
      ProjectStore.updateImgs(data.pictures)
      ProjectStore.updateImgGroup(data.groups)
      ProjectStore.updateCurShownGroups(type)
      ProjectStore.updateCurShownImgs()
      preload()
    })
  }, [])

  useEffect(() => {
    window.onresize = () => {
      HeightStore.updateHeight(body.offsetHeight)
    }
  }, [])

  // 图片预加载
  function preload() {
    const preloadImages: HTMLImageElement[] = []
    for (let i = 0; i < ProjectStore.imgs.length; i++) {
      const img = new Image()
      // 将img从数组中移除，减少内存占用
      img.onload = function () {
        const index = preloadImages.indexOf(this as HTMLImageElement)
        if (index !== 1) {
          preloadImages.splice(index, 1)
        }
      }
      img.src = ProjectStore.imgs[i].url
      preloadImages.push(img)
    }
  }

  function clickToUploadFile(fileList: FileList) {
    // 并行发送请求
    setIsUploading(true)
    const reqData = []

    for (const key in fileList) {
      const formData = new FormData()
      // 项目id
      formData.append('projectID', id)
      // 上传图片数量
      formData.append('imgNum', '1')
      // 图片
      formData.append('img1', fileList[key])
      // uuid
      formData.append('uuid1', generateUUID())
      // 图片名
      formData.append('name1', fileList[key].name)

      reqData.push(formData)

      if (parseInt(key) === fileList.length - 1) {
        break
      }
    }

    const promiseArr = []
    for (let i = 0; i < reqData.length; i++) {
      const item = reqData[i]
      promiseArr.push(uploadFile(item))
    }

    return Promise.all(promiseArr).then((res) => {
      getUpdatedImgs(id).then((res) => {
        const data = res.data
        ProjectStore.updateImgs(data.pictures)
        setIsUploading(false)
      })
    })

    // 只发送一个请求
    // const formData = new FormData()

    // // 项目id
    // formData.append('projectID', id)
    // // 上传图片数量
    // formData.append('imgNum', `${fileList.length}`)

    // for (const key in fileList) {
    //   // 图片
    //   formData.append(`img${parseInt(key) + 1}`, fileList[key])
    //   // uuid
    //   formData.append(`uuid${parseInt(key) + 1}`, generateUUID())
    //   // 图片名
    //   formData.append(`name${parseInt(key) + 1}`, fileList[key].name)

    //   if (parseInt(key) === fileList.length - 1) {
    //     break
    //   }
    // }

    // setIsUploading(true)

    // uploadFile(formData).then((res) => {
    //   getUpdatedImgs(id).then((res) => {
    //     const data = res.data
    //     ProjectStore.updateImgs(data.pictures)
    //     setIsUploading(false)
    //   })
    // })
  }

  return (
    <Box
      sx={toolBarStyles.wrapper}
      style={{ height: HeightStore.bodyHeight - 65 + 'px' }}
    >
      {!ProjectStore.showResultAnalysis ? (
        <Box>
          <Box>
            <Box sx={toolBarStyles.top}>
              <Typography fontSize="16px">图层</Typography>
              <input
                accept="image/*"
                id="contained-button-file"
                style={{ display: 'none' }}
                multiple
                type="file"
                onChange={(e) => {
                  clickToUploadFile(e.target.files as FileList)
                }}
              />
              <label
                htmlFor="contained-button-file"
                style={{
                  width: '60%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  variant="contained"
                  component="span"
                  style={{
                    backgroundColor: '#313131',
                    color: '#FCFBF4',
                    boxShadow: 'none',
                    fontWeight: '300',
                    fontSize: '16px'
                  }}
                >
                  <SvgIcon name="import" />
                  导入图片
                </Button>
              </label>
            </Box>
            <Box sx={toolBarStyles.listWrapper}>
              <List sx={toolBarStyles.list}>
                {ProjectStore.imgGroups &&
                  ProjectStore.imgGroups.map((item) => (
                    <Group group={item} key={item.groupID} />
                  ))}
              </List>
              <List sx={toolBarStyles.list}>
                {ProjectStore.imgs &&
                  ProjectStore.imgs.map((item) => (
                    <Item item={item} key={item.uuid} />
                  ))}
              </List>
            </Box>
          </Box>
          {isUploading && (
            <Box sx={toolBarStyles.mask}>
              <Loading />
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Box>
            <Typography
              fontSize="17px"
              color="primary.light"
              mb="15px"
              ml="15px"
              mt="15px"
            >
              结果分析
            </Typography>
            <hr />
          </Box>
          {type === 5 && (
            <Box
              sx={{
                color: 'primary.light',
                fontSize: '15px',
                margin: '15px 0 30px 15px'
              }}
            >
              图块数量：{ProjectStore.currentShownGroup.info.num} 个
            </Box>
          )}
          {type === 4 && (
            <Box
              sx={{
                color: 'primary.light',
                fontSize: '15px',
                margin: '20px 0 30px 15px'
              }}
            >
              目标数量：{ProjectStore.currentShownGroup.info.boxs.length} 个
            </Box>
          )}
          {type === 3 && (
            <Box
              sx={{
                color: 'primary.light',
                fontSize: '15px',
                margin: '20px 0 10px 0px'
              }}
            >
              <Typography
                fontSize="15px"
                color="primary.light"
                mb="10px"
                ml="15px"
                mt="10px"
              >
                图块数量统计（单位：个）
              </Typography>
              <Box
                sx={{
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '14px'
                }}
              >
                <MyPieChart detectType={type} displayType={2} />
                <ChartList detectType={type} displayType={2} />
              </Box>
            </Box>
          )}
          {type !== 4 && (
            <Box
              sx={{
                color: 'primary.light',
                fontSize: '15px',
                margin: '20px 0 10px 0px'
              }}
            >
              <Typography
                fontSize="15px"
                color="primary.light"
                mb="10px"
                ml="15px"
                mt="10px"
              >
                图块面积占比统计
              </Typography>
              <Box
                sx={{
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '14px'
                }}
              >
                <MyPieChart detectType={type} displayType={1} />
                <ChartList detectType={type} displayType={1} />
              </Box>
            </Box>
          )}
          {type === 4 && (
            <Box
              sx={{
                width: '100px',
                marginLeft: '15px'
              }}
            >
              {objectDetectionColors.map((item) => (
                <Box
                  sx={{
                    width: '120px',
                    height: '30px',
                    lineHeight: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'primary.light'
                  }}
                  key={item.id}
                >
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      marginRight: '12px'
                    }}
                  ></Box>
                  {item.name}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

const ToolBar = observer(_ToolBar)

export default ToolBar
