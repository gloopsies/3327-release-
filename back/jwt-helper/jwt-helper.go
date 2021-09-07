package jwt_helper

import (
	"github.com/golang-jwt/jwt"

	. "back/config"
	. "back/log"
)

type User = struct {
	Session        string `json:"session"`
	DisplayName    string `json:"display_name"`
	Email          string `json:"email"`
	ProfilePicture string `json:"profile_picture"`
	Wallet         string `json:"wallet"`

	jwt.StandardClaims
}

func SignJWT(user User) (string, error) {
	var token *jwt.Token

	token = jwt.NewWithClaims(jwt.SigningMethodRS512, user)
	signedToken, err := token.SignedString(Config.Key.Private)

	if err != nil {
		Log(err)
		return "", err
	}

	return signedToken, nil
}

func ReadJWT(signedToken string) *User {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&User{},
		func(token *jwt.Token) (interface{}, error) {
			return Config.Key.Public, nil
		},
	)

	if err != nil {
		Log(err)
		return nil
	}

	user, ok := token.Claims.(*User)
	if !ok {
		Log(err)
		return nil
	}

	return user
}
