package application

import "newproject-backend/core/pkg/domain/model"

type UserRepository interface {
	CreateUser(user *model.User) error
	GetByEmail(email string) (*model.User, error)
	GetByID(id uint) (*model.User, error)
	CreateLoginLog(log *model.LoginLog) error
	ListLoginLogs() ([]model.LoginLog, error)
}

type StoryRepository interface {
	CreateStory(story *model.Story) error
	ListPublic() ([]model.Story, error)
	ListByUser(userID uint) ([]model.Story, error)
}
