package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	. "back/config"
)

type route struct {
	method method
	route string
	execChain gin.HandlersChain
}

type method int
const (
	POST method = iota
	GET = iota
	PATCH = iota
	DELETE = iota
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", Config.CORS)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func ApplyRoutes (server *gin.Engine) {
	var routes = []route {
		// User
		{GET, "/user/:wallet", gin.HandlersChain{getUserData}},
		{POST, "/register", gin.HandlersChain{register}},
		{POST, "/nonce", gin.HandlersChain{getNonce}},
		{POST, "/login", gin.HandlersChain{login}},
		{POST, "/logged", gin.HandlersChain{isAuth, loggedIn}},
		{POST,"/logout", gin.HandlersChain{isAuth, logOut}},
		{PATCH,"/user", gin.HandlersChain{isAuth, updateUser}},

		// Messages
		{POST, "/requests", gin.HandlersChain{isAuth, isAdmin, getRequests}},
		{DELETE, "/request/:id", gin.HandlersChain{isAuth, isAdmin, DeleteRequest}},
		{POST, "/request", gin.HandlersChain{isAuth, SendRequest}},
		{POST, "/messages", gin.HandlersChain{isAuth, isAdmin, getMessages}},
		{DELETE, "/message/:id", gin.HandlersChain{isAuth, isAdmin, DeleteMessage}},
		{POST, "/message", gin.HandlersChain{isAuth, SendMessage}},
	}

	server.Use(CORS())
	server.Static(Config.Images.Serve, Config.Images.Local)

	for _, route := range routes {
		switch route.method {
			case POST:
				server.POST(route.route, route.execChain...)
				break
			case GET:
				server.GET(route.route, route.execChain...)
				break
			case PATCH:
				server.PATCH(route.route, route.execChain...)
				break
			case DELETE:
				server.DELETE(route.route, route.execChain...)
				break
		}
	}
}