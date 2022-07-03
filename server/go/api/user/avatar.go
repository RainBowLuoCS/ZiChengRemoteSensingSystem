package user

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/config"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/oss"
)

type AvatarData struct {
	AvatarURL string `json:"avatarURL"`
}

func UploadAvatar(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	header, err := c.FormFile("avatar")
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	file, err := header.Open()
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	defer file.Close()
	fileName := fmt.Sprintf("avatar/%d.png", u.ID)
	err = oss.UploadFile(file, fileName)
	if err != nil {
		fmt.Println(err)
		common.Respond(c, errcode.UploadAvatarError, gin.H{})
		return
	}

	avatarURL := fmt.Sprintf("%s%d.png", config.AvatarPath, u.ID)
	data := AvatarData{AvatarURL: avatarURL}

	common.Respond(c, errcode.Success, data)
}
