package common

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"remoteSensing/pkg/errcode"
)

type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func Respond(c *gin.Context, errorInfo *errcode.ErrorInfo, data interface{}) {
	// 应客户端要求，全都返回 200
	c.JSON(http.StatusOK, Response{
		Code: errorInfo.Code,
		Msg:  errorInfo.Msg,
		Data: data,
	})
}
