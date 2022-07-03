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

const GSType = 3

type GSRequest struct {
	ProjectID  uint64 `json:"projectID"`
	OriginUUID string `json:"originUUID"`
	TargetUUID string `json:"targetUUID"`
	TargetName string `json:"targetName"`
}

type GSData struct {
	URL  string `json:"url"`
	Name string `json:"name"`
	Info GSInfo `json:"info"`
}

type GSInfo struct {
	Colors []float64 `json:"colors"`
	Nums   []int     `json:"nums"`
}

func ProcessPicGS(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	request := new(GSRequest)
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

	info, err := predict.GetGSLabelMapInfo(originName)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	projectID := request.ProjectID
	targetUUID := request.TargetUUID
	targetName := request.TargetName

	fileName := fmt.Sprintf("project/%d/%d/%s.png", u.ID, projectID, targetUUID)
	url := fmt.Sprintf("%s%s", config.ProjectPath, fileName)

	groupInfo, isExist, err := sql.PicGroupTypeIsExist(originUUID, GSType, projectID)

	var gsInfo GSInfo
	json.Unmarshal(groupInfo.Info, &gsInfo)

	if err == nil || isExist {
		data := GSData{
			URL:  url,
			Name: targetName,
			Info: gsInfo,
		}
		common.Respond(c, errcode.Success, data)
		return
	}

	path := fmt.Sprintf("%s%s.png", config.LocalPicPath, targetUUID)
	colors := img.OutPic(info, path)
	if colors == nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}
	nums := img.GetColorNums(info)

	gsInfo = GSInfo{
		Colors: colors,
		Nums:   nums,
	}
	infoJson, _ := json.Marshal(gsInfo)

	flag := false
	var overallGroupID uint64 = 0

	err = global.GLOBAL_DB.Transaction(func(tx *gorm.DB) error {
		// 创建 group
		groupID, txErr := sql.AddGroup(tx, projectID, "地物分类分组", GSType, infoJson)
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

			if overallInfo.Mark[0] == 0 {
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
		//	overallInfo.Mark[0] = 1
		//	overallInfo.Infos = append([]datatypes.JSON{infoJson}, overallInfo.Infos...)
		//
		//	overallInfoJson, _ := json.Marshal(overallInfo)
		//
		//	txErr := sql.UpdateGroupInfo(tx, projectID, overallGroupInfo.ID, overallInfoJson)
		//	if txErr != nil {
		//		return txErr
		//	}
		//
		//	_, txErr = sql.AddPicture(tx, targetUUID, targetName, projectID, overallGroupInfo.ID, 1)
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

	data1 := OverallExistData{GroupID: overallGroupID}
	if flag {
		common.Respond(c, errcode.OverallGroupExist, data1)
		return
	}

	data := GSData{
		URL:  url,
		Name: targetName,
		Info: gsInfo,
	}
	common.Respond(c, errcode.Success, data)
}
