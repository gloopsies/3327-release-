package eth

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"math/big"
	"os"
	"strconv"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	. "back/config"
	"back/database"
	. "back/log"
	"back/mail"
)

func VerifySignature(wallet, signature, nonce string) (bool, error) {
	nonceHash := crypto.Keccak256Hash([]byte("\x19Ethereum Signed Message:\n" + strconv.Itoa(len(nonce)) + nonce))
	sigBytes, err := hexutil.Decode(signature)
	if err != nil {
		return false, err
	}

	sigBytes[64] -= 27
	pub, err := crypto.Ecrecover(nonceHash.Bytes(), sigBytes)
	if err != nil {
		Log(err)
		return false, err
	}

	walletHex, err := hexutil.Decode(wallet)
	if err != nil {
		Log(err)
		return false, err
	}

	pubHash := crypto.Keccak256Hash(pub[1:])

	return bytes.Compare(pubHash.Bytes()[12:], walletHex) == 0, nil
}

func IsAdmin(wallet string) bool {
	return Config.Admin == wallet
}

type DonationEvent = struct {
	Name 		 string
	From         common.Address
	CampaignId   *big.Int
	Amount       *big.Int
	TokenAddress common.Address
	Beneficiary  common.Address
}

type GoalReachedEvent struct {
	Name 		 string
	CampaignId   *big.Int
	RaisedAmount *big.Int
	Beneficiary  common.Address
	Contributors []common.Address
}

func Watcher() {
	var err error
	var DonationHash = hexutil.Encode(crypto.Keccak256([]byte("Donation(string,address,uint256,uint256,address,address)")))
	var GoalReachedHash = hexutil.Encode(crypto.Keccak256([]byte("GoalReached(string,uint256,uint256,address,address[])")))

	file, err := os.Open(Config.Blockchain.AbiFile)
	if err != nil {
		Log(err)
		return
	}

	contractAbi, err := abi.JSON(io.Reader(file))

	client, err := ethclient.Dial(Config.Blockchain.Url)
	if err != nil {
		log.Fatal(err)
	}

	contractAddress := common.HexToAddress(Config.Blockchain.Contract)

	latestBlock, err := client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	query := ethereum.FilterQuery{
		FromBlock: latestBlock.Number,
		Addresses: []common.Address{contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal(err)
	}

	for {
		select {
		case err := <-sub.Err():
			log.Fatal(err)
		case vLog := <-logs:
			switch vLog.Topics[0].String() {

			//Donation event
			case DonationHash:
				donation := DonationEvent{}
				err = contractAbi.UnpackIntoInterface(&donation, "Donation", vLog.Data)
				if err != nil {
					Log(err)
					break
				}

				fmt.Println(vLog)
				fmt.Println(donation)
				fmt.Println("Wallet: ", donation.From.String())
				from, err := database.GetUser(donation.From.String())
				if err != nil {
					Log(err)
				} else {
					name := from.DisplayName
					if len(name) == 0 {
						name = from.Wallet
					}

					err = mail.SendMail([]string{from.Email}, "We received your donation", fmt.Sprintf(
						Config.Messages.DonationGiven,
						name,
						donation.Name,
						vLog.TxHash,
					))
					if err != nil {
						Log(err)
					}
				}

				beneficiary, err := database.GetUser(donation.Beneficiary.String())
				if err != nil {
					Log(err)
				} else {
					name := beneficiary.DisplayName
					if len(name) == 0 {
						name = beneficiary.Wallet
					}

					err = mail.SendMail([]string{beneficiary.Email}, "You received a donation", fmt.Sprintf(
						Config.Messages.DonationReceived,
						name,
						donation.Name,
						vLog.TxHash,
					))
					if err != nil {
						Log(err)
					}
				}

				break

			//GoalReached event
			case GoalReachedHash:
				reached := GoalReachedEvent{}
				err = contractAbi.UnpackIntoInterface(&reached, "GoalReached", vLog.Data)
				if err != nil {
					Log(err)
					break
				}

				for _, address := range reached.Contributors {
					contributor, err := database.GetUser(address.String())
					if err != nil {
						Log(err)
					} else {
						name := contributor.DisplayName
						if len(name) == 0 {
							name = contributor.Wallet
						}

						err = mail.SendMail([]string{contributor.Email}, "Campaign you donated to reached it's goal!", fmt.Sprintf(
							Config.Messages.CampaignDone,
							name,
							reached.Name,
						))
						if err != nil {
							Log(err)
						}
					}
				}

				beneficiary, err := database.GetUser(reached.Beneficiary.String())
				if err != nil {
					Log(err)
				} else {
					name := beneficiary.DisplayName
					if len(name) == 0 {
						name = beneficiary.Wallet
					}

					err = mail.SendMail([]string{beneficiary.Email}, "Campaign you created reached it's goal!", fmt.Sprintf(
						Config.Messages.CampaignOver,
						name,
						reached.Name,
					))
					if err != nil {
						Log(err)
					}
				}

				break

			default:
				//Unhandled events
				fmt.Println(vLog.Topics[0].String())
			}
		}
	}
}
