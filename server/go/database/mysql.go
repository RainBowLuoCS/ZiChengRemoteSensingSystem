package database

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	config2 "remoteSensing/config"
	"remoteSensing/database/model"
)

// InitDB 数据库连接
func InitDB() (*gorm.DB, error) {
	var db *gorm.DB

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=true",
		config2.Username, config2.Password, config2.Host, config2.Port, config2.Database, config2.Charset)

	config := mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         256,   // 字符串字段的默认大小
		DisableDatetimePrecision:  true,  // 禁用日期时间精度，MySQL 5.6 之前不支持
		DontSupportRenameIndex:    true,  // 重命名索引时删除和创建，MySQL 5.7 之前不支持重命名索引，MariaDB
		DontSupportRenameColumn:   true,  // `change` 重命名列，MySQL 8 之前不支持重命名列，MariaDB
		SkipInitializeWithVersion: false, // 根据当前 MySQL 版本自动配置
	}

	db, err := gorm.Open(mysql.New(config), &gorm.Config{})

	// 自动创建及更新数据库表
	err = db.AutoMigrate(&model.User{}, &model.Project{}, &model.Group{}, &model.Picture{}, &model.Name{})
	if err != nil {
		return db, err
	}

	return db, err
}
