package project

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
)

type DeleteGroupRequest struct {
	ProjectID uint64 `json:"projectID"`
	GroupID   uint64 `json:"groupID"`
}

func DeleteGroup(c *gin.Context) {
	request := new(DeleteGroupRequest)
	err := c.ShouldBindJSON(&request)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	acc, _ := c.Get("account")
	account := acc.(string)

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	projectID := request.ProjectID
	isExist, err := sql.IsExist(projectID, u.ID)
	if !isExist || err != nil {
		common.Respond(c, errcode.AccountProjectError, gin.H{})
		return
	}

	groupID := request.GroupID
	err = global.GLOBAL_DB.Transaction(func(tx *gorm.DB) error {
		//uuids, txErr := sql.GetPicturesByGroupID(tx, groupID)
		//if txErr != nil {
		//	return txErr
		//}
		//
		//txErr = sql.DeletePicture(tx, []string{uuids[0]})
		//if txErr != nil {
		//	return txErr
		//}
		//
		//for i := 1; i < len(uuids); i++ {
		//	txErr = sql.UpdateDeleteGroupID(tx, uuids[i])
		//	if txErr != nil {
		//		return txErr
		//	}
		//}

		txErr := sql.DeleteGroupPicture(tx, groupID)
		if txErr != nil {
			return txErr
		}

		txErr = sql.DeleteGroup(tx, groupID)
		if txErr != nil {
			return txErr
		}

		return nil
	})
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	common.Respond(c, errcode.Success, gin.H{})
}
