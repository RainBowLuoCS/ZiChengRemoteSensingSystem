package model

type Picture struct {
	ID        uint64 `gorm:"primary_key;auto_increment"`
	UUID      string `gorm:"type:char(32);not null"`
	ProjectID uint64
	GroupID   uint64
	Name      string `gorm:"type:varchar(1024);not null;default:'未命名'"`
	Type      int8   `gorm:"type:tinyint;not null;default:0"`
}
