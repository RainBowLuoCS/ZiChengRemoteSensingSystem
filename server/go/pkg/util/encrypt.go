package util

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"io"
	"os"
	"strings"
)

// Encrypt 密码加密算法
func Encrypt(data string) (string, error) {
	if data == "" {
		return "", errors.New("密码为空")
	}

	h := md5.New()

	// 加yan操作
	dataBytes := []byte(data)
	if dataBytes[0] > 3 {
		dataBytes[0] -= 2
	} else {
		dataBytes[0]++
	}

	h.Write(dataBytes)
	return hex.EncodeToString(h.Sum(nil)), nil
}

// MD5 获取文件 md5 值
func MD5(filepath string) (string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return "", err
	}
	defer file.Close()
	md5h := md5.New()
	_, err = io.Copy(md5h, file)
	if err != nil {
		return "", err
	}

	return strings.ToUpper(hex.EncodeToString(md5h.Sum(nil))), nil
}
