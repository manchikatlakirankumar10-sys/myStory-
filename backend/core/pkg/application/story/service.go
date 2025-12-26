package story

import (
	"newproject-backend/core/pkg/application"
	"newproject-backend/core/pkg/domain/model"
)

type StoryService struct {
	repo application.StoryRepository
}

func NewStoryService(repo application.StoryRepository) *StoryService {
	return &StoryService{repo: repo}
}

func (s *StoryService) CreateStory(title, content string, isPublic bool, userID uint) error {
	story := &model.Story{
		Title:    title,
		Content:  content,
		IsPublic: isPublic,
		UserID:   userID,
	}
	return s.repo.CreateStory(story)
}

func (s *StoryService) ListPublicStories() ([]model.Story, error) {
	return s.repo.ListPublic()
}

func (s *StoryService) ListMyStories(userID uint) ([]model.Story, error) {
	return s.repo.ListByUser(userID)
}
