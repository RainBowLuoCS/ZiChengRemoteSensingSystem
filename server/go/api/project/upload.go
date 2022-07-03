package project

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"math"
	"mime/multipart"
	"remoteSensing/api/response/common"
	"remoteSensing/config"
	"remoteSensing/database/sql"
	"remoteSensing/global"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/oss"
	"strconv"
)

func UploadPicture(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	pID := c.PostForm("projectID")
	projectID, _ := strconv.Atoi(pID)
	isExist, err := sql.IsExist(uint64(projectID), u.ID)
	if !isExist || err != nil {
		common.Respond(c, errcode.AccountProjectError, gin.H{})
		return
	}

	num := c.PostForm("imgNum")
	imgNum, _ := strconv.Atoi(num)

	headers := make([]*multipart.FileHeader, imgNum)
	uuids := make([]string, imgNum)
	names := make([]string, imgNum)
	for i := 0; i < imgNum; i++ {
		imgKey := fmt.Sprintf("img%d", i+1)
		uuidKey := fmt.Sprintf("uuid%d", i+1)
		nameKey := fmt.Sprintf("name%d", i+1)

		header, err := c.FormFile(imgKey)
		if err != nil {
			common.Respond(c, errcode.UploadFileError, gin.H{})
			return
		}
		uuid := c.PostForm(uuidKey)
		name := c.PostForm(nameKey)

		headers[i] = header
		uuids[i] = uuid
		names[i] = name
	}

	f := false
	for i := 0; i < imgNum; i++ {
		localPath := fmt.Sprintf("%s%s.png", config.LocalPicPath, uuids[i])
		err := c.SaveUploadedFile(headers[i], localPath)
		if err != nil {
			common.Respond(c, errcode.ServerError, gin.H{})
			return
		}

		file, err := headers[i].Open()
		if err != nil {
			common.Respond(c, errcode.ServerError, gin.H{})
			return
		}

		fileName := fmt.Sprintf("project/%d/%d/%s.png", u.ID, projectID, uuids[i])
		err = oss.UploadFile(file, fileName)
		if err != nil {
			common.Respond(c, errcode.ServerError, gin.H{})
			return
		}

		flag, err := sql.AddPicture(global.GLOBAL_DB, uuids[i], names[i], uint64(projectID), math.MaxUint64, 0)
		if flag {
			f = true
		}
		if err != nil {
			common.Respond(c, errcode.ServerError, gin.H{})
			return
		}

		file.Close()
	}

	if f {
		common.Respond(c, errcode.Rename, gin.H{})
		return
	}
	common.Respond(c, errcode.Success, gin.H{})
}
