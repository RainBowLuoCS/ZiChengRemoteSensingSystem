package project

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
)

type CreateProjectRequest struct {
	Name string `json:"name"`
}

type CreateProjectData struct {
	ProjectID uint64 `json:"projectID"`
}

func CreateProject(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	request := new(CreateProjectRequest)
	err := c.ShouldBindJSON(&request)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	name := request.Name

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.AccountProjectError, gin.H{})
		return
	}

	projectID, err := sql.AddProject(u.ID, name)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	data := CreateProjectData{ProjectID: projectID}
	common.Respond(c, errcode.Success, data)
}
