<script lang="ts">
    import { Link } from "svelte-navigator";
    import { account, loader, modal_component, modal_currencies, modal_open, notification } from "../../../libs/stores";
    import { currencies, fromWei, modals, toFixedDecimals, toWei } from "../../../libs/imports";
    import type { Currency } from "../../../libs/types";
    import { NotificationType } from "../../../libs/types";
    import { currencySwap, swap } from "../../../libs/blockchain";

    let input: string = "", output: string = "";

    let input_currency: Currency = null, output_currency: Currency = null;

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

    const swap_currency = async () => {
        if (input_currency === null || output_currency === null) {
            $notification = {
                type: NotificationType.warning,
                message: "Please choose currencies",
            };

            return;
        }

        if (input_currency.address === output_currency.address) {
            $notification = {
                type: NotificationType.warning,
                message: "Please choose different currencies",
            };

            return;
        }

        try {
            if (toWei(input, input_currency) === 0n) {
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
            $loader = "Swapping your tokens please wait...";
            await swap($account.wallet, input_currency, output_currency, toWei(input, input_currency));
            $notification = {
                type: NotificationType.success,
                message: "Successfully swapped currencies",
            };
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            };
        } finally {
            $loader = null;
        }
    };

    let deg = 0;

    let switcher;
    $: if (switcher) switcher.style.setProperty("--deg", `${deg}deg`);

    const switch_currencies = () => {
        const temp = input;
        input = output;
        output = temp;

        const temp_currency = input_currency;
        input_currency = output_currency;
        output_currency = temp_currency;

        deg += 180;
    };

    const changed = async (input: string, input_currency: Currency, output: string, output_currency: Currency) => {
        if (input_currency === null || output_currency === null) return output;
        if (input.length === 0) return "";
        const wei = toWei(input, input_currency);
        const swap = await currencySwap(input_currency, output_currency, wei);
        return toFixedDecimals(fromWei(swap, output_currency), 3);
    };

    const input_currency_changed = async (input_currency: Currency) => {
        if (output === "") return;
        input = await changed(output, output_currency, input, input_currency);
    };

    const output_currency_changed = async (output_currency: Currency) => {
        if (input === "") return;
        output = await changed(input, input_currency, output, output_currency);
    };

    $: input_currency_changed(input_currency);
    $: output_currency_changed(output_currency);
</script>

<div class="wrapper">
    <div class="relative">
        <span>
            <label for="input">
                Swap from:
                <button class="currency"
                        on:click={async () => input_currency = await choose()}>{input_currency !== null ? input_currency.name : "Select"}</button>
            </label>
            <input bind:value={input}
                   id="input"
                   on:input={async e => output = await changed(e.target.value, input_currency, output, output_currency)}
                   placeholder="0.0" type="text">
        </span>
        <span>
            <label for="output">
                Swap to:
                <button class="currency"
                        on:click={async () => output_currency = await choose()}>{output_currency !== null ? output_currency.name : "Select"}</button>
            </label>
            <input bind:value={output}
                   id="output"
                   on:input={async e => input = await changed(e.target.value, output_currency, input, input_currency)}
                   placeholder="0.0" type="text">
        </span>
        <button bind:this={switcher} class="switch" on:click={switch_currencies}><img alt="Switch"
                                                                                      src="/icons/swap.svg"></button>
    </div>
    <button class="swap" on:click={swap_currency}>Swap</button>
    <span>To learn more about swapping currencies feel free to visit <Link to="/guides">our guide</Link>.</span>
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
    background-color: imports.$bg-color;
    text-align: right;
    display: block;
    width: 100%;
    font-size: 3rem;
    padding: 1rem;
    border-radius: imports.$border-radius;
  }

  span {
    position: relative;
  }

  label {
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
    @include imports.button-reset;
    @include imports.button;
    font-size: 1.5rem;
    line-height: 3rem;
    border-radius: imports.$border-radius;
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
    @include imports.button-reset;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3.5rem;
    aspect-ratio: 1/1;
    transition: transform 0.2s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
    transform: translate(-50%, -50%) rotate(var(--deg));
    border-radius: 50%;
    display: flex;
    align-content: center;
    justify-content: center;
    box-shadow: 0 0 6px rgba(darken(imports.$bg-color, 20%), .5);
    background-color: imports.$bg-color-alt;

    &:hover {
      box-shadow: 0 0 12px rgba(darken(imports.$bg-color, 20%), .5);
      background-color: lighten(imports.$bg-color-alt, 5%);
    }

    img {
      margin: 0;
      padding: 0;
      width: 3rem;
      aspect-ratio: 1/1;
    }
  }
</style>