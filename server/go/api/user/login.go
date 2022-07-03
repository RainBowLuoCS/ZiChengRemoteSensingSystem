package user

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/jwt"
	"remoteSensing/pkg/util"
)

type LoginRequest struct {
	Account  string `json:"account" bind:"required"`
	Password string `json:"password" bind:"required"`
}

type LoginData struct {
	Token string `json:"token"`
}

func Login(c *gin.Context) {
	request := new(LoginRequest)
	err := c.ShouldBindJSON(&request)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	account := request.Account
	encryptedPassword, err := sql.GetEncryptedPassword(account)
	if err != nil {
		common.Respond(c, errcode.AccountNotFound, gin.H{})
		return
	}
	password := request.Password
	enPassword, err := util.Encrypt(password)
	if err != nil {
		common.Respond(c, errcode.PasswordNull, gin.H{})
		return
	}
	if encryptedPassword != enPassword {
		common.Respond(c, errcode.PasswordError, gin.H{})
		return
	}

	token, err := jwt.CreateToken(account)
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	data := new(LoginData)
	data.Token = token
	common.Respond(c, errcode.Success, *data)
}
