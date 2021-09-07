package database

type Request struct {
	Id int `json:"id"`
	Wallet string `json:"wallet"`
	Message string `json:"message"`
}

func GetRequests() ([]Request, error) {
	var err error
	var requests []Request

	rows, err := db.Query("SELECT id, wallet, message FROM requests")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var request Request
		err = rows.Scan(&request.Id, &request.Wallet, &request.Message)
		if err != nil {
			return nil, err
		}

		requests = append(requests, request)
	}

	return requests, err
}

func DeleteRequest(id string) error {
	var err error

	_, err = db.Exec("DELETE FROM requests where ID = $1", id)

	return err
}

func AddRequest(wallet string, message string) error {
	var err error

	_, err = db.Exec("INSERT INTO requests(wallet, message) VALUES ($1, $2)", wallet, message)

	return err
}

type Message struct {
	Id int `json:"id"`
	Wallet string `json:"wallet"`
	Type int `json:"type"`
	Message string `json:"message"`
}

func GetMessages() ([]Message, error) {
	var err error
	var messages []Message

	rows, err := db.Query("SELECT id, wallet, type, message FROM messages")
	for rows.Next() {
		var message Message
		err = rows.Scan(&message.Id, &message.Wallet, &message.Type, &message.Message)
		if err != nil {
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, err
}

func DeleteMessage(id string) error {
	var err error

	_, err = db.Exec("DELETE FROM messages where ID = $1", id)

	return err
}

func AddMessage(wallet string, typ int,  message string) error {
	var err error

	_, err = db.Exec("INSERT INTO messages(wallet, type, message) VALUES ($1, $2, $3)", wallet, typ, message)

	return err
}