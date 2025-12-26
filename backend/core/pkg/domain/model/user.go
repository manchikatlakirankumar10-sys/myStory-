package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex"`
	Password string
	Role     string `gorm:"default:'user'"`
}
