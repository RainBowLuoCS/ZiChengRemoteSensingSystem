package sql

import (
	"remoteSensing/database/model"
	"remoteSensing/global"
)

func AddUser(account, password string) error {
	user := model.User{
		Account:  account,
		Password: password,
	}

	err := global.GLOBAL_DB.Create(&user).Error

	return err
}

func GetEncryptedPassword(account string) (string, error) {
	user := new(model.User)
	err := global.GLOBAL_DB.Model(user).
		Select("password").
		Where("account = ?", account).
		Scan(user).Error

	return user.Password, err
}

func GetUserByUsername(account string) (model.User, error) {
	user := new(model.User)
	err := global.GLOBAL_DB.Where("account = ?", account).First(user).Error

	return *user, err
}
