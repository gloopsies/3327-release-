<script lang="ts">
    import { getChainId, getDonations, getLeaderboard } from "../../../libs/blockchain";
    import { currencyPrint } from "../../../libs/imports";
    import env from "../../../.env";
    import { onMount } from "svelte";

    const getUserData = async (wallet) => {
        const response = await fetch(`${env.api_url}/user/${wallet}`, {
            method: "GET",
        });

        if (response.status < 200 || response.status >= 300) {
            return { display_name: wallet };
        }

        let user_data = await response.json();

        if (user_data.display_name === "") {
            user_data.display_name = wallet;
        }

        return user_data;
    };

    let explorer: string;

    onMount(async () => {
        explorer = env.networks.get(await getChainId()).parameters.blockExplorerUrls[0]
    })
</script>

{#await getLeaderboard() then donations}
    <table>
        <tr>
            <th scope="col">From</th>
            <th scope="col">Transaction hash</th>
            <th scope="col">Campaign</th>
            <th scope="col">Value</th>
            <th scope="col">Time</th>
        </tr>
        {#each donations as donation}
            {#await getUserData(donation.from) then data}
                <tr>
                    <td>{data.display_name}</td>
                    <td><a href={`${explorer}tx/${donation.hash}`}><code>{donation.hash}</code></a>
                    </td>
                    <td>{donation.campaign}</td>
                    <td>
                        {currencyPrint(donation.amount, donation.currency)}
                    </td>
                    <td>{donation.time.toLocaleString()}</td>
                </tr>
            {/await}
        {/each}
    </table>
{:catch err}
    {err}
{/await}

<style lang="scss">
  @use '../../../scss/index' as imports;

  table {
    border-spacing: 18px;
    background-color: imports.$bg-color-alt;
    border-radius: imports.$border-radius;
    width: 100%;
  }

  th {
    text-align: left;
  }

  a {
    color: white;
  }
</style>
