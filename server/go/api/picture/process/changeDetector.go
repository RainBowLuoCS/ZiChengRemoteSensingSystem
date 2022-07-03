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

const CDType = 5

type CDRequest struct {
	ProjectID  uint64 `json:"projectID"`
	OldUUID    string `json:"oldUUID"`
	NewUUID    string `json:"newUUID"`
	TargetUUID string `json:"targetUUID"`
	TargetName string `json:"targetName"`
}

type CDData struct {
	URL  string `json:"url"`
	Name string `json:"name"`
	Info CDInfo `json:"info"`
}

type CDInfo struct {
	Colors []float64 `json:"colors"`
	Num    int       `json:"num"`
}

func ProcessPicCD(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	request := new(CDRequest)
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

	oldUUID := request.OldUUID
	newUUID := request.NewUUID
	oldName := oldUUID + ".png"
	newName := newUUID + ".png"
	ok1, err1 := resource.IsExist(config.LocalPicPath + oldName)
	ok2, err2 := resource.IsExist(config.LocalPicPath + newName)
	if !ok1 || !ok2 || err1 != nil || err2 != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	info, err := predict.GetCDLabelMapInfo(oldName + "," + newName)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	projectID := request.ProjectID
	targetUUID := request.TargetUUID
	targetName := request.TargetName

	fileName := fmt.Sprintf("project/%d/%d/%s.png", u.ID, projectID, targetUUID)
	url := fmt.Sprintf("%s%s", config.ProjectPath, fileName)

	var cdInfo CDInfo

	//groupInfo, isExist, err := sql.CDPicGroupTypeIsExist([]string{oldUUID, newUUID}, GSType)
	//fmt.Println(groupInfo)
	//if err == nil && isExist {
	//	json.Unmarshal(groupInfo.Info, &cdInfo)
	//
	//	data := CDData{
	//		URL:  url,
	//		Name: targetName,
	//		Info: cdInfo,
	//	}
	//	common.Respond(c, errcode.Success, data)
	//	return
	//}

	path := fmt.Sprintf("%s%s.png", config.LocalPicPath, targetUUID)
	colors := img.OutPic(info, path)
	num := img.GetHouseNum(info)

	cdInfo = CDInfo{
		Colors: colors,
		Num:    num,
	}
	infoJson, _ := json.Marshal(cdInfo)

	err = global.GLOBAL_DB.Transaction(func(tx *gorm.DB) error {
		// 创建 group
		groupID, txErr := sql.AddGroup(tx, projectID, "变化检测分组", CDType, infoJson)
		fmt.Println(projectID)
		if txErr != nil {
			return txErr
		}

		txErr1 := sql.UpdatePictureGroupIDandType(tx, oldUUID, groupID, 2)
		if txErr1 != nil {
			return txErr1
		}
		txErr2 := sql.UpdatePictureGroupIDandType(tx, newUUID, groupID, 3)
		if txErr2 != nil {
			return txErr2
		}

		_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, groupID, 1)
		if txErr != nil {
			return txErr
		}

		// 实时更新
		//overallGroupInfo1, overallIsExist1, _ := sql.PicGroupTypeIsExist(newUUID, OverallType, projectID)
		//if overallIsExist1 {
		//	var overallInfo OverallInfo
		//	json.Unmarshal(overallGroupInfo1.Info, &overallInfo)
		//
		//	if overallInfo.Mark[3] == 0 {
		//		overallInfo.Infos = append(overallInfo.Infos[:len(overallInfo.Infos)-1], infoJson)
		//	}
		//
		//	overallInfo.Mark[3]++
		//	overallInfo.Infos = append([]datatypes.JSON{infoJson}, overallInfo.Infos...)
		//
		//	overallInfoJson, _ := json.Marshal(overallInfo)
		//
		//	txErr := sql.UpdateGroupInfo(tx, projectID, overallGroupInfo1.ID, overallInfoJson)
		//	if txErr != nil {
		//		return txErr
		//	}
		//
		//	_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, overallGroupInfo1.ID, 1)
		//}
		//overallGroupInfo2, overallIsExist2, _ := sql.PicGroupTypeIsExist(originUUID, OverallType, projectID)
		//if overallIsExist2 {
		//	var overallInfo OverallInfo
		//	json.Unmarshal(overallGroupInfo2.Info, &overallInfo)
		//
		//	overallInfo.Mark[0] = 1
		//	overallInfo.Infos = append([]datatypes.JSON{infoJson}, overallInfo.Infos...)
		//
		//	overallInfoJson, _ := json.Marshal(overallInfo)
		//
		//	txErr := sql.UpdateGroupInfo(tx, projectID, overallGroupInfo2.ID, overallInfoJson)
		//	if txErr != nil {
		//		return txErr
		//	}
		//
		//	_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, overallGroupInfo2.ID, 1)
		//}

		return nil
	})
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	file, err := os.Open(path)
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

	data := CDData{
		URL:  url,
		Name: targetName,
		Info: cdInfo,
	}
	common.Respond(c, errcode.Success, data)
}
