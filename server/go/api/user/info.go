package user

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/config"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
)

type InfoData struct {
	Name      string `json:"name"`
	AvatarURL string `json:"avatarURL"`
}

func GetUserInfo(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	avatarURL := fmt.Sprintf("%s%d.png", config.AvatarPath, u.ID)
	data := InfoData{
		Name:      u.Account,
		AvatarURL: avatarURL,
	}
	common.Respond(c, errcode.Success, data)
}
