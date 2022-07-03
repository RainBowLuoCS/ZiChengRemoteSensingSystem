package project

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
)

type UpdateGroupNameRequest struct {
	ProjectID uint64 `json:"projectID"`
	GroupID   uint64 `json:"groupID"`
	Name      string `json:"name"`
}

func UpdateGroupName(c *gin.Context) {
	request := new(UpdateGroupNameRequest)
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
	newName := request.Name
	err = sql.UpdateGroupName(global.GLOBAL_DB, projectID, groupID, newName)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	common.Respond(c, errcode.Success, gin.H{})
}
