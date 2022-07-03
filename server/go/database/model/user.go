package model

// User 用户表
type User struct {
	ID       uint64 `gorm:"primary_key;auto_increment"`
	Account  string `gorm:"type:varchar(20);not null;unique"`
	Password string `gorm:"type:char(32);not null"`
}
