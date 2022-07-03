package project

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
	"strconv"
)

func HardDeletePro(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	pID := c.Param("id")
	projectID, _ := strconv.Atoi(pID)
	err = sql.HardDelete(uint64(projectID), u.ID)
	if err != nil {
		common.Respond(c, errcode.AccountProjectError, gin.H{})
		return
	}

	common.Respond(c, errcode.Success, gin.H{})
}
