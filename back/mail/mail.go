package mail

import (
	"net/smtp"

	. "back/config"
)

func SendMail(to []string, subject string, body string) error {
	from := Config.Mail.Mail
	password := Config.Mail.Password

	smtpHost := Config.Mail.SMTPHost
	smtpPort := Config.Mail.SMTPPort

	auth := smtp.PlainAuth("", from, password, smtpHost)

	var emails []string

	for _, mail := range to {
		if mail != "" {
			emails = append(emails, "<" + mail + ">")
		}
	}

	if len(emails) > 0 {
		err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte("Subject: " + subject + "\r\n" + "From: \"Support children\" <supportchildren@noreply.com>" + body))
		if err != nil {
			return err
		}
	}

	return nil
} 