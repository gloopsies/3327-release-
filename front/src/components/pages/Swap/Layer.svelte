<script lang="ts">
    import { Link } from "svelte-navigator";
    import type { Currency, Network } from "../../../libs/types";
    import { NotificationType } from "../../../libs/types";
    import { account, loader, modal_component, modal_currencies, modal_open, notification } from "../../../libs/stores";
    import { currencies, modals, toWei } from "../../../libs/imports";
    import env from "../../../.env";
    import { getChainId } from "../../../libs/blockchain";
    import { onMount } from "svelte";
    import { Polygon } from "../../../libs/networks/polygon";
    import { burn, Goerli } from "../../../libs/networks/goerli";

    let currency: Currency = null;

    let network: Network = null;
    let layer2: Network = null;

    const set_network = async (chainId: string) => {
        network = env.networks.get(chainId);
        layer2 = env.networks.get(network.transfers[0].chainId);
        display_withdraw = update_display_withdraw(network);

    };

    onMount(async () => set_network(await getChainId()));

    const choose = async (): Promise<Currency> => {
        $modal_open = true;
        $modal_component = modals.currency;
        $modal_currencies = currencies;

        return new Promise<Currency>(resolve => {
            window.addEventListener("currency_picked", (e: CustomEvent) => {
                resolve(e.detail);
            }, { once: true });
        });
    };

    let amount = "";

    const transfer = async () => {
        if (network === null) return;

        if (currency === null) {
            $notification = {
                type: NotificationType.warning,
                message: "Please choose a currency first",
            };
            return;
        }
        try {
            if (toWei(amount, currency) === 0n) {
                $notification = {
                    type: NotificationType.warning,
                    message: "Please input a valid amount first",
                };
                return;
            }
        } catch {
            $notification = {
                type: NotificationType.warning,
                message: "Please input a valid amount first",
            };
            return;
        }


        try {
            $loader = "Transfering your tokens, please wait...";
            await network.transfers.find(e => e.chainId === layer2.parameters.chainId)
                .func($account.wallet, currency, toWei(amount, currency));
            if(network.parameters.chainId === Polygon.parameters.chainId) {
                $notification = {
                    type: NotificationType.success,
                    message: "Your transaction is currently getting processed. Please wait 10 minutes and withdraw money on Goerli network"
                };
            } else {
                $notification = {
                    type: NotificationType.success,
                    message: "Successfully transferred funds",
                };
            }
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            };
        } finally {
            $loader = null;
        }
    };

    let withdrawals: any[]
    let display_withdraw = false

    const update_display_withdraw = (network: Network) => {
        if(network.parameters.chainId !== Goerli.parameters.chainId) return false

        withdrawals = JSON.parse(localStorage.getItem("withdrawals"))
        return withdrawals && withdrawals.length > 0;
    }

    const withdraw = async () => {
        let withdrawn = false;
        let errors = false;
        $loader = "Withdrawing funds...";

        withdrawals = (await Promise.all(
            withdrawals.map( async (tx: string): Promise<any[]> => {
                try {
                    await burn($account.wallet, tx);
                    withdrawn = true;
                    return []
                } catch (e: Error) {
                    errors = true;
                    console.log(e)
                    return [tx]
                }
            })
        )).flat(1)

        display_withdraw  = withdrawals.length > 0;
        localStorage.setItem("withdrawals", JSON.stringify(withdrawals));

        if (!errors) {
            $notification = {
                type: NotificationType.success,
                message: "All transactions are withdrawn"
            }
        } else if (withdrawn) {
            $notification = {
                type: NotificationType.warning,
                message: "All completed transactions are withdrawn, but some are still getting processed, please try again later"
            }
        } else {
            $notification = {
                type: NotificationType.error,
                message: "No transactions withdrawn, please try again later"
            }
        }

        $loader = null;
    }
</script>

<div class="wrapper">
    <div class="relative">
        <span class="container">
            <label for="input">
                Transfer currency:
                <button class="currency"
                        on:click={async () => currency = await choose()}>{currency !== null ? currency.name : "Select"}</button>
            </label>
            <input bind:value={amount} id="input" placeholder="0.0" type="text">
        </span>
        <span class="container center">
                Transfer network: <button
            class="currency">{layer2 != null ? layer2.parameters.chainName : "Select"}</button>
        </span>
        <div class="switch"><img alt="Switch" src="/icons/arrow_down.svg"></div>
    </div>
    <span class="swap">
        {#if display_withdraw}
            <button class="secondary" on:click={withdraw}>withdraw</button>
        {/if}
        <button on:click={transfer}>Transfer</button>
    </span>
    <span>To learn more about layer 2 feel free to visit <Link to="/guides">our guide</Link>.</span>
</div>

<style lang="scss">
  @use '../../../scss' as imports;

  .wrapper {
    width: 500px;
    max-width: calc(80vw - #{imports.$sidebar-closed-width});
    padding: 8px;
    display: flex;
    gap: .5rem;
    flex-direction: column;
  }

  .relative {
    position: relative;
    display: flex;
    gap: .5rem;
    flex-direction: column;
  }

  @include imports.input-text-reset;

  input[type="text"] {
    color: white;
    text-align: right;
    display: block;
    width: 100%;
    font-size: 3rem;
    padding: 1rem;
  }

  .container {
    position: relative;
    background-color: imports.$bg-color;
    border-radius: imports.$border-radius;
    height: 100px;
    display: flex;
    align-items: center;

    &.center {
      padding-top: 1rem;
      justify-content: center;
      gap: 1rem;
    }
  }

  label[for] {
    font-size: 1rem;
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: .2rem;
  }

  .swap {
    display: flex;
    justify-content: stretch;
    gap: 1rem;

    button {
      @include imports.button-reset;
      @include imports.button;
      font-size: 1.5rem;
      line-height: 3rem;
      border-radius: imports.$border-radius;
      flex-grow: 1;
    }
    .secondary {
      background-color: imports.$bg-color-alt;
      color: white;
      &:hover {
        background-color: imports.$bg-color;
      }
    }
  }

  .currency {
    @include imports.button-reset;
    color: imports.$fg-color;
    border: 1px white solid;
    padding: .3rem .6rem;
    border-radius: 4px;
    font-size: 1rem;
  }

  .switch {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3.5rem;
    aspect-ratio: 1/1;
    transition: transform 0.2s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    display: flex;
    align-content: center;
    justify-content: center;
    box-shadow: 0 0 6px rgba(darken(imports.$bg-color, 20%), .5);
    background-color: imports.$bg-color-alt;

    img {
      margin: 0;
      padding: 0;
      width: 3em;
      aspect-ratio: 1/1;
    }
  }
</style>