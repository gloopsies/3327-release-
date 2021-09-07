package config

import (
	"crypto"
	"crypto/rsa"
	"encoding/json"
	"io/ioutil"

	"github.com/golang-jwt/jwt"
)

var (
	Config struct {
		Db struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Host     string `json:"host"`
			Port     string `json:"port"`
			Name     string `json:"name"`
		} `json:"database"`
		Port  string `json:"port"`
		Redis struct {
			Host     string `json:"host"`
			Password string `json:"password"`
		} `json:"redis"`
		Images struct {
			Local string `json:"local"`
			Serve string `json:"serve"`
		} `json:"images"`
		Mail struct {
			Mail      string   `json:"email"`
			Password  string   `json:"password"`
			SMTPHost  string   `json:"smtp_host"`
			SMTPPort  string   `json:"smtp_port"`
		} `json:"email"`
		Key struct {
			PrivateFile string `json:"private"`
			Private     *rsa.PrivateKey
			Public      crypto.PublicKey
		} `json:"key"`
		Blockchain struct {
			AbiFile  string `json:"abi_file"`
			Url      string `json:"url"`
			Contract string `json:"contract"`
		} `json:"blockchain"`
		Messages struct {
			DonationGivenFile    string `json:"donation_given"`
			DonationReceivedFile string `json:"donation_received"`
			CampaignDoneFile     string `json:"campaign_done"`
			CampaignOverFile     string `json:"campaign_over"`
			DonationGiven        string
			DonationReceived     string
			CampaignDone         string
			CampaignOver         string
		} `json:"messages"`
		Admin   string `json:"admin"`
		CORS    string `json:"cors"`
		LogFile string `json:"log_file"`
		Debug   bool   `json:"debug"`
	}
)

func ReadConfig() error {
	data, err := ioutil.ReadFile("./config.json")
	if err != nil {
		return err
	}

	err = json.Unmarshal(data, &Config)
	if err != nil {
		return err
	}

	private, err := ioutil.ReadFile(Config.Key.PrivateFile)
	Config.Key.Private, err = jwt.ParseRSAPrivateKeyFromPEM(private)
	if err != nil {
		return err
	}
	Config.Key.Public = Config.Key.Private.Public()

	donationGiven, err := ioutil.ReadFile(Config.Messages.DonationGivenFile)
	if err != nil {
		return err
	}
	Config.Messages.DonationGiven = string(donationGiven)

	donationReceived, err := ioutil.ReadFile(Config.Messages.DonationReceivedFile)
	if err != nil {
		return err
	}
	Config.Messages.DonationReceived = string(donationReceived)

	campaignDone, err := ioutil.ReadFile(Config.Messages.CampaignDoneFile)
	if err != nil {
		return err
	}
	Config.Messages.CampaignDone = string(campaignDone)

	campaignOver, err := ioutil.ReadFile(Config.Messages.CampaignOverFile)
	if err != nil {
		return err
	}
	Config.Messages.CampaignOver = string(campaignOver)

	return err
}
