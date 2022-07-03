package project

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
)

type UpdatePicNameRequest struct {
	ProjectID uint64 `json:"projectID"`
	UUID      string `json:"uuid"`
	Name      string `json:"name"`
}

func UpdatePicName(c *gin.Context) {
	request := new(UpdatePicNameRequest)
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

	uuid := request.UUID
	newName := request.Name
	flag, err := sql.UpdatePictureName(global.GLOBAL_DB, uuid, newName, projectID)
	if flag {
		common.Respond(c, errcode.Rename, gin.H{})
		return
	}
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	common.Respond(c, errcode.Success, gin.H{})
}
