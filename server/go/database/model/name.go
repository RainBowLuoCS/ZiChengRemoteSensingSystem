package model

type Name struct {
	ID        uint64 `gorm:"primary_key;auto_increment"`
	ProjectID uint64
	Name      string `gorm:"type:varchar(1024);not null"`
	Count     int    `gorm:"type:int;not null"`
}
