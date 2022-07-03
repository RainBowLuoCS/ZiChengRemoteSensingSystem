package process

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"os"
	"remoteSensing/api/response/common"
	"remoteSensing/config"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/img"
	"remoteSensing/pkg/oss"
	"remoteSensing/pkg/resource"
	"remoteSensing/predict"
)

const ODType = 4

type ODRequest struct {
	ProjectID  uint64 `json:"projectID"`
	Type       string `json:"type"`
	OriginUUID string `json:"originUUID"`
	TargetUUID string `json:"targetUUID"`
	TargetName string `json:"targetName"`
}

type ODData struct {
	URL  string `json:"url"`
	Name string `json:"name"`
	Info ODInfo `json:"info"`
}

type ODInfo struct {
	Type string  `json:"type"`
	W    int     `json:"w"`
	H    int     `json:"h"`
	Boxs [][]int `json:"boxs"`
}

func ProcessPicOD(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	request := new(ODRequest)
	err := c.ShouldBindJSON(&request)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.AccountProjectError, gin.H{})
		return
	}

	originUUID := request.OriginUUID
	originName := originUUID + ".png"
	ok, err := resource.IsExist(config.LocalPicPath + originName)
	if !ok || err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	t := request.Type
	bboxs, err := predict.GetODLabelMapInfo(originName, t)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	projectID := request.ProjectID
	targetUUID := request.TargetUUID
	targetName := request.TargetName

	fileName := fmt.Sprintf("project/%d/%d/%s.png", u.ID, projectID, targetUUID)
	url := fmt.Sprintf("%s%s", config.ProjectPath, fileName)

	groupInfo, isExist, err := sql.PicGroupTypeIsExist(originUUID, ODType, projectID)

	var odInfo ODInfo
	json.Unmarshal(groupInfo.Info, &odInfo)

	if err == nil || isExist {
		data := ODData{
			URL:  url,
			Name: targetName,
			Info: odInfo,
		}
		common.Respond(c, errcode.Success, data)
		return
	}

	originPath := fmt.Sprintf("%s%s.png", config.LocalPicPath, originUUID)
	targetPath := fmt.Sprintf("%s%s.png", config.LocalPicPath, targetUUID)
	w, h := img.ODOutPic(bboxs, originPath, targetPath)

	odInfo = ODInfo{
		Type: t,
		W:    w,
		H:    h,
		Boxs: bboxs,
	}
	infoJson, _ := json.Marshal(odInfo)

	flag := false
	var overallGroupID uint64 = 0

	err = global.GLOBAL_DB.Transaction(func(tx *gorm.DB) error {
		// 创建 group
		groupID, txErr := sql.AddGroup(tx, projectID, "目标检测分组", ODType, infoJson)
		fmt.Println(projectID)
		if txErr != nil {
			return txErr
		}

		txErr = sql.UpdatePictureGroupIDandType(tx, originUUID, groupID, 2)
		if txErr != nil {
			return txErr
		}

		_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, groupID, 1)
		if txErr != nil {
			return txErr
		}

		overallGroupInfo, overallIsExist, _ := sql.PicOverallGroupIsExist(originUUID, projectID)
		if overallIsExist {
			var overallInfo OverallInfo
			json.Unmarshal(overallGroupInfo.Info, &overallInfo)

			if overallInfo.Mark[2] == 0 {
				flag = true
				overallGroupID = overallGroupInfo.ID
			}
		}

		// 实时更新
		//overallGroupInfo, overallIsExist, _ := sql.PicGroupTypeIsExist(originUUID, OverallType, projectID)
		//if overallIsExist {
		//	var overallInfo OverallInfo
		//	json.Unmarshal(overallGroupInfo.Info, &overallInfo)
		//
		//	overallInfo.Mark[2] = 1
		//	index := overallInfo.Mark[0] + overallInfo.Mark[1]
		//	overallInfo.Infos = append(overallInfo.Infos[:index], append([]datatypes.JSON{infoJson}, overallInfo.Infos[index:]...)...)
		//
		//	overallInfoJson, _ := json.Marshal(overallInfo)
		//
		//	txErr := sql.UpdateGroupInfo(tx, projectID, overallGroupInfo.ID, overallInfoJson)
		//	if txErr != nil {
		//		return txErr
		//	}
		//
		//	_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, overallGroupInfo.ID, 3)
		//}

		return nil
	})
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	file, err := os.Open(targetPath)
	defer file.Close()
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	err = oss.UploadFile(file, fileName)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	data1 := OverallExistData{GroupID: overallGroupID}
	if flag {
		common.Respond(c, errcode.OverallGroupExist, data1)
		return
	}

	data := ODData{
		URL:  url,
		Name: targetName,
		Info: odInfo,
	}
	common.Respond(c, errcode.Success, data)
}
