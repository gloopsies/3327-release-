package main

import (
	. "back/config"
	"back/database"
	"back/eth"
	. "back/log"
	. "back/redis-connection"
	"back/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	var err error
	err = ReadConfig()
	if err != nil {
		Log(err)
		return
	}

	RedisInit()
	err = database.DBConnect()
	if err != nil {
		Log(err)
		return
	}

	go eth.Watcher()

	if Config.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	server := gin.Default()
	routes.ApplyRoutes(server)

	err = server.Run(":" + Config.Port)
	if err != nil {
		Log(err)
	}

}
