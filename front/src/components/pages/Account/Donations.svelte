<script lang="ts">
    import { onDestroy } from "svelte";
    import { getUsersTransactions } from "../../../libs/blockchain";
    import { account } from "../../../libs/stores";
    import type { User } from "../../../libs/types";
    import { currencyPrint } from "../../../libs/imports";

    let acc: User;

    const account_unsubscribe = account.subscribe((account: User) => {
        acc = account;
    });
    onDestroy(() => account_unsubscribe());

</script>

{#await getUsersTransactions(acc.wallet) then transactions}
    <table>
        <tr>
            <th scope="col">Transaction hash</th>
            <th scope="col">Campaign</th>
            <th scope="col">Value</th>
            <th scope="col">Time</th>
        </tr>
        {#each transactions as transaction}
            <tr>
                <td>{transaction.hash}</td>
                <td>{transaction.campaign}</td>
                <td>{currencyPrint(transaction.amount, transaction.currency)}</td>
                <td>{transaction.time.toLocaleString()}</td>
            </tr>
        {/each}
    </table>
{:catch err}
    {err}
{/await}


<style lang="scss">
  table {
    width: 100%;
  }

  th {
    text-align: start;
  }
</style>