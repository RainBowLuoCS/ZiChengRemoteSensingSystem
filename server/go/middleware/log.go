package middleware

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"strings"
)

// Logger 记录连接信息的日志中间件
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取 request body，不记录 form-data 的 body
		var body []byte
		if strings.Contains(c.Request.Header.Get("Content-Type"), "form-data") {
			body = []byte("该请求中包含文件")
		} else {
			var err error
			body, err = c.GetRawData()
			if err != nil {
				body = []byte("获取body时发生错误")
			}
			// 将原 body 塞回去，否则 body 将为空，ShouldBindJSON 绑定时会报错
			c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
		}

		c.Next()

		fmt.Println("body:" + string(body))
	}
}
