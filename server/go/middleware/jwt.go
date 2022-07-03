package middleware

import (
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/jwt"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			common.Respond(c, errcode.UnauthorizedTokenNull, gin.H{})
			c.Abort() // 阻止调用后续函数
			return
		}

		account, err := jwt.ParseToken(token)
		if err != nil {
			common.Respond(c, errcode.UnauthorizedTokenError, gin.H{})
			c.Abort()
			return
		}

		c.Set("account", account)
		c.Next()
	}
}
