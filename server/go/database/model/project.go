package model

import "time"

type Project struct {
	ID        uint64 `gorm:"primary_key;auto_increment"`
	UserID    uint64
	Name      string    `gorm:"type:varchar(50);not null;default:'未命名'"`
	IsDeleted bool      `gorm:"type:bool;not null;default:false"`
	LastVisit time.Time `gorm:"type:datetime;not null;default:'1000-01-01 00:00:00'"`
}
