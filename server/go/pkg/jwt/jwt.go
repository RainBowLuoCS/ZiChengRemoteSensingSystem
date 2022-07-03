package jwt

import (
	"github.com/dgrijalva/jwt-go"

	"time"
)

const SecretKey = "08as79d8ah6=sdg-r" //私钥

// CreateToken 生成 token
func CreateToken(account string) (string, error) {
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"account": account,
		"exp":     time.Now().Add(time.Hour * 24 * 365).Unix(),
	})
	token, err := at.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}
	return token, nil
}

// ParseToken 解析 token
func ParseToken(token string) (string, error) {
	claim, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		return "", err
	}
	return claim.Claims.(jwt.MapClaims)["account"].(string), nil
}
