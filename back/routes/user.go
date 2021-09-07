package routes

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"back/database"
	"back/eth"
	jwt "back/jwt-helper"
	. "back/log"
	. "back/redis-connection"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func register(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	wallet := string(body)

	nonce, err := uuid.NewRandom()
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error creating nonce")
		return
	}

	err = database.Register(wallet, nonce.String())
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error creating user")
		return
	}

	context.String(http.StatusOK, nonce.String())
}

func getNonce(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	wallet := string(body)

	nonce, err := database.GetNonce(wallet)
	if err != nil {
		if err.Error() == "no user" {
			context.String(http.StatusForbidden, "Please register first")
		} else {
			context.String(http.StatusInternalServerError, "Error getting nonce")
		}
		return
	}

	context.String(http.StatusOK, nonce)
}

type loginT = struct {
	Wallet    string `json:"wallet"`
	Signature string `json:"signature"`
}

func login(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	var login loginT
	err = json.Unmarshal(body, &login)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	nonce, err := database.GetNonce(login.Wallet)
	if err != nil {
		if err.Error() == "no user" {
			context.String(http.StatusForbidden, "Please register first")
		} else {
			Log(err)
			context.String(http.StatusInternalServerError, "Error getting nonce")
		}
		return
	}

	if ok, err := eth.VerifySignature(login.Wallet, login.Signature, nonce); err != nil || !ok {
		Log(err)
		context.String(http.StatusUnauthorized, "Verification check error")
		return
	}

	nonceUUID, err := uuid.NewRandom()
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error creating nonce")
		return
	}

	err = database.SetNonce(login.Wallet, nonceUUID.String())
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error updating nonce")
		return
	}

	sessionUUID, err := uuid.NewRandom()
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error creating session")
		return
	}

	status := RedisClient.SetEX(RedisContext, "session: "+sessionUUID.String(), login.Wallet, 24*time.Hour)
	if status.Err() != nil {
		Log(status.Err())
		context.String(http.StatusInternalServerError, "Error creating session")
		return
	}

	dbUser, err := database.GetUser(login.Wallet)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from the database")
		return
	}

	token, err := jwt.SignJWT(jwt.User{
		Session:        sessionUUID.String(),
		Email:          dbUser.Email,
		DisplayName:    dbUser.DisplayName,
		ProfilePicture: dbUser.ProfilePicture,
		Wallet:         login.Wallet,
	})

	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error signing JWT")
		return
	}

	context.String(http.StatusOK, token)
}

type loggedInT = struct {
	Jwt string `json:"jwt"`
}

func isAuth(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		context.Abort()
		return
	}

	context.Set("json", body)

	var token loggedInT
	err = json.Unmarshal(body, &token)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		context.Abort()
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(token.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		context.Abort()
		return
	}

	result := RedisClient.Get(RedisContext, "session: "+user.Session)

	wallet, err := result.Result()
	if err != nil {
		context.String(http.StatusExpectationFailed, "User session expired")
		context.Abort()
		return
	}

	if wallet != user.Wallet {
		context.String(http.StatusUnauthorized, "Wrong session")
		context.Abort()
		return
	}

	context.Next()
}

func isAdmin(context *gin.Context) {
	var err error
	body, exists := context.Get("json")
	if !exists {
		context.String(http.StatusInternalServerError, "Value doesn't exist")
		context.Abort()
		return
	}

	var token loggedInT
	err = json.Unmarshal(body.([]byte), &token)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		context.Abort()
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(token.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		context.Abort()
		return
	}

	admin := eth.IsAdmin(user.Wallet)

	if !admin {
		context.String(http.StatusUnauthorized, "Account is not an admin account")
		context.Abort()
		return
	}
}

func loggedIn(context *gin.Context) {
	context.String(http.StatusOK, "User logged in")
}

func logOut(context *gin.Context) {
	var err error
	body, exists := context.Get("json")
	if !exists {
		context.String(http.StatusInternalServerError, "Value doesn't exist")
		return
	}

	var token loggedInT
	err = json.Unmarshal(body.([]byte), &token)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(token.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		return
	}

	RedisClient.Del(RedisContext, "session: "+user.Session)

	context.String(http.StatusOK, "Logged out")
}

type updateT = struct {
	Jwt            string `json:"jwt"`
	DisplayName    string `json:"display_name"`
	Email          string `json:"email"`
	ProfilePicture string `json:"profile_picture"`
}

func updateUser(context *gin.Context) {
	var err error
	body, exists := context.Get("json")
	if !exists {
		context.String(http.StatusInternalServerError, "Value doesn't exist")
		return
	}

	var update updateT
	err = json.Unmarshal(body.([]byte), &update)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	var user *jwt.User
	user = jwt.ReadJWT(update.Jwt)
	if user == nil {
		context.String(http.StatusUnauthorized, "No jwt present")
		return
	}

	err = database.UpdateUser(user.Wallet, update.DisplayName, update.Email, update.ProfilePicture)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from the database")
		return
	}

	sessionUUID, err := uuid.NewRandom()
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error creating session")
		return
	}

	status := RedisClient.SetEX(RedisContext, "session: "+sessionUUID.String(), user.Wallet, 24*time.Hour)
	if status.Err() != nil {
		Log(status.Err())
		context.String(http.StatusInternalServerError, "Error creating session")
		return
	}

	token, err := jwt.SignJWT(jwt.User{
		Session:        sessionUUID.String(),
		Email:          update.Email,
		DisplayName:    update.DisplayName,
		ProfilePicture: update.ProfilePicture,
		Wallet:         user.Wallet,
	})

	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error signing JWT")
		return
	}

	context.String(http.StatusOK, token)
}

type UserData = struct {
	DisplayName string `json:"display_name"`
	ProfilePicture string `json:"profile_picture"`
}

func getUserData(context *gin.Context) {
	var data UserData
	wallet := context.Param("wallet")


	user, err := database.GetUser(wallet)
	if err != nil {
		context.String(http.StatusNotFound, "User with this wallet doesn't exist")
		return
	}

	data.DisplayName = user.DisplayName
	data.ProfilePicture = user.ProfilePicture

	context.JSON(http.StatusOK, data)
}