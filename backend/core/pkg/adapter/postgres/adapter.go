package postgres

import (
	"fmt"
	"log"
	"newproject-backend/core/pkg/domain/model"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Adapter struct {
	DB *gorm.DB
}

func NewAdapter() *Adapter {
	// Default to localhost
	dsn := "host=localhost user=postgres password=postgres dbname=story_db port=5432 sslmode=disable"

	// Check if we have individual env vars (e.g. from Render)
	if os.Getenv("DB_HOST") != "" {
		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)
	} else if os.Getenv("DATABASE_URL") != "" {
		dsn = os.Getenv("DATABASE_URL")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: false, // Disable prepared statements for Supabase transaction pooler compatibility
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto Migrate
	err = db.AutoMigrate(&model.User{}, &model.Story{}, &model.LoginLog{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	return &Adapter{DB: db}
}

// User Repository Implementation
func (a *Adapter) CreateUser(user *model.User) error {
	return a.DB.Create(user).Error
}

func (a *Adapter) GetByEmail(email string) (*model.User, error) {
	var user model.User
	err := a.DB.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (a *Adapter) GetByID(id uint) (*model.User, error) {
	var user model.User
	err := a.DB.First(&user, id).Error
	return &user, err
}

func (a *Adapter) CreateLoginLog(log *model.LoginLog) error {
	return a.DB.Create(log).Error
}

func (a *Adapter) ListLoginLogs() ([]model.LoginLog, error) {
	var logs []model.LoginLog
	err := a.DB.Order("created_at desc").Limit(50).Find(&logs).Error
	return logs, err
}

// Story Repository Implementation
func (a *Adapter) CreateStory(story *model.Story) error {
	return a.DB.Create(story).Error
}

func (a *Adapter) ListPublic() ([]model.Story, error) {
	var stories []model.Story
	// Only return public stories
	err := a.DB.Where("is_public = ?", true).Preload("User").Find(&stories).Error
	return stories, err
}

func (a *Adapter) ListByUser(userID uint) ([]model.Story, error) {
	var stories []model.Story
	err := a.DB.Where("user_id = ?", userID).Find(&stories).Error
	return stories, err
}
