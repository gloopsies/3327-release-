package database

import (
	"database/sql"
	"errors"
	_ "github.com/lib/pq"
)

func GetNonce(wallet string) (string, error) {
	var err error
	var nonce sql.NullString

	row := db.QueryRow("SELECT get_nonce($1);", wallet)
	err = row.Scan(&nonce)
	if !nonce.Valid {
		return "", errors.New("no user")
	}

	return nonce.String, err
}

func Register(wallet string, nonce string) error {
	_, err := db.Exec("INSERT INTO users(wallet, nonce) VALUES ($1, $2);", wallet, nonce)

	return err
}

func SetNonce(wallet string, nonce string) error {
	_, err := db.Exec("UPDATE users SET nonce = $2 WHERE wallet = $1;", wallet, nonce)

	return err
}

type User = struct {
	Wallet         string
	Email          string
	DisplayName    string
	ProfilePicture string
}

func GetUser(wallet string) (*User, error) {
	var user User
	var err error

	row := db.QueryRow("SELECT wallet, email, display_name, profile_picture FROM users WHERE wallet = $1", wallet)

	err = row.Scan(&user.Wallet, &user.Email, &user.DisplayName, &user.ProfilePicture)

	return &user, err
}

func UpdateUser(wallet string, displayName string, email string, profilePicture string) error {
	var err error

	_, err = db.Exec("UPDATE users SET display_name = $2, email = $3, profile_picture = $4 WHERE wallet = $1", wallet, displayName, email, profilePicture)

	return err
}