<script lang="ts">
    import { getAwards } from "../../../libs/blockchain";
    import { currencyPrint } from "../../../libs/imports";
    import type { User } from "../../../libs/types";
    import { account } from "../../../libs/stores";
    import { onDestroy } from "svelte";

    let acc: User;
    const account_unsubscribe = account.subscribe((account: User) => acc = account);
    onDestroy(() => account_unsubscribe());
</script>

{#await getAwards(acc.wallet) then awards}
    <table>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Campaign</th>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
            <th scope="col">Time</th>
        </tr>
        {#each awards as award}
            <tr>
                <td>{award.id}</td>
                <td>{award.campaign}</td>
                <td>{award.category}</td>
                <td>
                    {currencyPrint(award.amount, award.currency)}
                </td>
                <td>{new Date(award.time).toLocaleString()}</td>
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