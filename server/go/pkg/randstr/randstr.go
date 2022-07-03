package randstr

import (
	"math/rand"
	"time"
)

const (
	letterBytes = "0123456789abcdefghijklmnopqrstuvwxyz"
)

// CreateRandomString 创建随机字符串
func CreateRandomString(length int) string {
	rand.Seed(time.Now().UnixNano()) // 纳秒时间戳
	pdfID := make([]byte, length)
	for i := range pdfID {
		pdfID[i] = letterBytes[rand.Intn(36)] //随机下标取值
	}
	return string(pdfID)
}
