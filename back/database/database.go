package database

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"

	. "back/config"
)

var (
	db *sql.DB
)

func DBConnect() error {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		Config.Db.Host, Config.Db.Port, Config.Db.Username, Config.Db.Password, Config.Db.Name)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	return nil
}