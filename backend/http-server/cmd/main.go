package main

import (
	"newproject-backend/core/pkg/adapter/postgres"
	"newproject-backend/core/pkg/application/auth"
	"newproject-backend/core/pkg/application/story"
	"newproject-backend/http-server/cmd/router"
	"newproject-backend/http-server/internal/handlers"

	"github.com/joho/godotenv"
)

func main() {
	// 0. Load Env
	godotenv.Load()

	// 1. Init Adapters (Context: Infrastructure)
	adapter := postgres.NewAdapter()

	// 2. Init Core Services (Context: Application Layer)
	// The adapter implements both UserRepo and StoryRepo interfaces
	authService := auth.NewAuthService(adapter)
	storyService := story.NewStoryService(adapter)

	// 3. Init Handlers (Context: HTTP Adapter)
	h := handlers.NewHttpHandler(authService, storyService)

	// 4. Init Router
	r := router.NewRouter(h)

	// 5. Run Server
	r.Run(":8080")
}
