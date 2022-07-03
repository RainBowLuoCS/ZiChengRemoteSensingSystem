package user

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/util"
)

type RegisterRequest struct {
	Account  string `json:"account" bind:"required"`
	Password string `json:"password" bind:"required"`
}

func Register(c *gin.Context) {
	request := new(RegisterRequest)
	err := c.ShouldBindJSON(&request)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	encryptedPassword, err := util.Encrypt(request.Password)
	if err != nil {
		common.Respond(c, errcode.PasswordNull, gin.H{})
		return
	}

	err = sql.AddUser(request.Account, encryptedPassword)
	if err != nil {
		common.Respond(c, errcode.AccountExist, gin.H{})
		return
	}

	common.Respond(c, errcode.Success, gin.H{})
}
