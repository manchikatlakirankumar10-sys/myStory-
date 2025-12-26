package auth

import (
	"errors"
	"newproject-backend/core/pkg/application"
	"newproject-backend/core/pkg/domain/model"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo application.UserRepository
}

func NewAuthService(repo application.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Signup(email, password string) error {
	if _, err := s.repo.GetByEmail(email); err == nil {
		return errors.New("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	user := &model.User{
		Email:    email,
		Password: string(hashedPassword),
	}

	return s.repo.CreateUser(user)
}

func (s *AuthService) Login(email, password string) (string, string, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return "", "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte("SECRET_KEY"))
	if err != nil {
		return "", "", err
	}

	// Record Login
	s.repo.CreateLoginLog(&model.LoginLog{
		UserID: user.ID,
		Email:  user.Email,
	})

	return tokenString, user.Role, nil
}

func (s *AuthService) ListLoginLogs() ([]model.LoginLog, error) {
	return s.repo.ListLoginLogs()
}
