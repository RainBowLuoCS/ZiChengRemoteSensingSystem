package project

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
)

type DeletePicRequest struct {
	ProjectID uint64   `json:"projectID"`
	Pictures  []string `json:"pictures"`
}

func DeletePics(c *gin.Context) {
	request := new(DeletePicRequest)
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

	uuids := request.Pictures
	err = sql.DeletePicture(global.GLOBAL_DB, uuids)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
	}

	//paths := make([]string, len(uuids))
	//for i := 0; i < len(uuids); i++ {
	//	paths[i] = fmt.Sprintf("project/%d/%d/%s.png", u.ID, projectID, uuids[i])
	//	resource.DeleteFile(config.LocalPicPath + uuids[i] + ".png")
	//}
	//
	//err = oss.DeletePics(paths)
	//if err != nil {
	//	common.Respond(c, errcode.DeleteFileError, gin.H{})
	//	return
	//}

	common.Respond(c, errcode.Success, gin.H{})
}
