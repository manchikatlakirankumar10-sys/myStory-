package handlers

import (
	"fmt"
	"net/http"
	"newproject-backend/core/pkg/application/auth"
	"newproject-backend/core/pkg/application/story"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/golang-jwt/jwt/v5"
)

type HttpHandler struct {
	authService  *auth.AuthService
	storyService *story.StoryService
}

func NewHttpHandler(authService *auth.AuthService, storyService *story.StoryService) *HttpHandler {
	return &HttpHandler{
		authService:  authService,
		storyService: storyService,
	}
}

// Auth Handlers
func (h *HttpHandler) Signup(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid body"})
		return
	}

	if err := h.authService.Signup(body.Email, body.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created"})
}

func (h *HttpHandler) Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid body"})
		return
	}

	token, role, err := h.authService.Login(body.Email, body.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "role": role})
}

func (h *HttpHandler) GetLoginLogs(c *gin.Context) {
	logs, err := h.authService.ListLoginLogs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"logs": logs})
}

// Middleware
func AuthMiddleware(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
		return
	}

	// Remove "Bearer " prefix
	tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte("SECRET_KEY"), nil
	})

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	// Set userID in context
	c.Set("userID", claims["sub"])
	c.Next()
}

// Story Handlers
func (h *HttpHandler) CreateStory(c *gin.Context) {
	var body struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		IsPublic bool   `json:"isPublic"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid body"})
		return
	}

	userIDInterface, _ := c.Get("userID")
	userID := uint(userIDInterface.(float64))

	if err := h.storyService.CreateStory(body.Title, body.Content, body.IsPublic, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create story"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Story created"})
}

func (h *HttpHandler) ListStories(c *gin.Context) {
	stories, err := h.storyService.ListPublicStories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list stories"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"stories": stories})
}

func (h *HttpHandler) ListMyStories(c *gin.Context) {
	userIDInterface, _ := c.Get("userID")
	userID := uint(userIDInterface.(float64))

	stories, err := h.storyService.ListMyStories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list stories"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"stories": stories})
}

// AI Handlers
func (h *HttpHandler) GenerateContent(c *gin.Context) {
	var body struct {
		Context string `json:"context"`
		Mode    string `json:"mode"` // "continue" or "fix"
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Mock AI for Demo (Since Quota Exceeded)
	var suggestion string
	if body.Mode == "fix" {
		// Simple Mock Grammar Fixes for Demo
		if strings.Contains(strings.ToLower(body.Context), "b.tech") {
			suggestion = "I am currently pursuing my B.Tech degree."
		} else {
			suggestion = body.Context + " [Fixed: Capitalization and Punctuation]"
		}
	} else {
		// Mock Story Continuation
		suggestion = " and suddenly, the classroom door burst open!"
		lowerCtx := strings.ToLower(body.Context)
		if strings.Contains(lowerCtx, "dark") {
			suggestion = " The shadows whispered secrets that no one else could hear."
		} else if strings.Contains(lowerCtx, "love") {
			suggestion = " It was a heartbeat that echoed through eternity."
		}
	}

	c.JSON(http.StatusOK, gin.H{"suggestion": suggestion})
}
