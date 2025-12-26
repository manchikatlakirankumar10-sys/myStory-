package model

import "gorm.io/gorm"

type Story struct {
	gorm.Model
	Title    string
	Content  string
	IsPublic bool `gorm:"default:false"`
	UserID   uint
	User     User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
