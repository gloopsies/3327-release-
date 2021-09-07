<script lang="ts">
    import { clamp } from "../../../libs/imports";
    import type { Currency } from "../../../libs/types";

    export let input: bigint, currency: Currency, max: bigint, funcIn: Function, funcOut: Function;

    let display: string = "";
    let inTimeout, shouldChange = true;

    const clamp_max = (num: bigint): bigint => clamp(num, 0n, max);
    const change = async (input: bigint, _: Currency) => {
        if (typeof display === "undefined") return;
        if (display !== "" || input !== 0n) {
            const ending = display.match(/.[.0]*$/) || ["0"];
            clearTimeout(inTimeout);
            inTimeout = setTimeout(async () => {
                if (shouldChange) {
                    display = await funcIn(input) + ending[0].slice(1);
                }
                shouldChange = true;
            }, 600);

        }
    };

    $: if (typeof input !== "undefined" && typeof currency !== "undefined") {
        change(input, currency);
    }

</script>

<input
    bind:value={display}
    id="amount"
    on:input={async e => {
        if(display.length === 0) {
            input = 0n
            return
        }
        try {
            input = clamp_max(BigInt(await funcOut(e.target.value)))
            shouldChange = false
            // await change(input)
        } catch (e) {
            input = 0n
            display = "0"
        }
    }}
    placeholder="amount"
    type="text"
/>