package router

import (
	"newproject-backend/http-server/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(h *handlers.HttpHandler) *gin.Engine {
	r := gin.Default()

	// Config CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Public Routes
	r.POST("/signup", h.Signup)
	r.POST("/login", h.Login)

	// Private Routes
	authorized := r.Group("/")
	authorized.Use(handlers.AuthMiddleware)
	{
		authorized.POST("/stories", h.CreateStory)
		authorized.POST("/stories/generate", h.GenerateContent)
		authorized.GET("/stories", h.ListStories)
		authorized.GET("/stories/my", h.ListMyStories)
		authorized.GET("/admin/logins", h.GetLoginLogs)
	}

	return r
}
