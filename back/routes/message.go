package routes

import (
	jwt "back/jwt-helper"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"back/database"
	. "back/log"
)

func getRequests(context *gin.Context) {
	requests, err := database.GetRequests()

	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from the database")
		return
	}

	context.JSON(http.StatusOK, requests)
}

func DeleteRequest(context *gin.Context) {
	id := context.Param("id")
	err := database.DeleteRequest(id)
	if err != nil {
		context.String(http.StatusInternalServerError, "Error removing data from the database")
		return
	}

	context.String(http.StatusOK, "Request removed")
}

type Request struct {
	Jwt string
	Message string
}

func SendRequest(context *gin.Context) {
	var err error
	body, exists := context.Get("json")
	if !exists {
		context.String(http.StatusInternalServerError, "Value doesn't exist")
		return
	}

	var request Request
	err = json.Unmarshal(body.([]byte), &request)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(request.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		return
	}

	err = database.AddRequest(user.Wallet, request.Message)
	if err != nil {
		context.String(http.StatusInternalServerError, "Error adding data to the database")
		return
	}

	context.String(http.StatusOK, "Request successfully sent")
}

func getMessages(context *gin.Context) {
	messages, err := database.GetMessages()

	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from the database")
		return
	}

	context.JSON(http.StatusOK, messages)
}

func DeleteMessage(context *gin.Context) {
	id := context.Param("id")
	err := database.DeleteMessage(id)
	if err != nil {
		context.String(http.StatusInternalServerError, "Error removing data from the database")
		return
	}

	context.String(http.StatusOK, "Message removed")
}

type Message struct {
	Jwt string
	Type int
	Message string
}

func SendMessage(context *gin.Context) {
	var err error
	body, exists := context.Get("json")
	if !exists {
		context.String(http.StatusInternalServerError, "Value doesn't exist")
		return
	}

	var message Message
	err = json.Unmarshal(body.([]byte), &message)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(message.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		return
	}

	err = database.AddMessage(user.Wallet, message.Type, message.Message)
	if err != nil {
		context.String(http.StatusInternalServerError, "Error adding data to the database")
		return
	}

	context.String(http.StatusOK, "Request successfully sent")
}