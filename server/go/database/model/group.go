package model

import (
	"gorm.io/datatypes"
	"time"
)

type Group struct {
	ID        uint64 `gorm:"primary_key;auto_increment"`
	ProjectID uint64
	Name      string         `gorm:"type:varchar(50);not null;default:'未命名'"`
	CreatedAt time.Time      `gorm:"type:datetime;not null;default:'1000-01-01 00:00:00'"`
	Type      int8           `gorm:"type:tinyint;not null;default:0"`
	Info      datatypes.JSON `gorm:"type:json"`
}
