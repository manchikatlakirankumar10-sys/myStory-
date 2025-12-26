package model

import (
	"gorm.io/gorm"
)

type LoginLog struct {
	gorm.Model
	UserID    uint
	Email     string
	IPAddress string
}
