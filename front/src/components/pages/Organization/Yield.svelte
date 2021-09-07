<script lang="ts">
    import { farming_supply, get_farming_supply, getCampaigns, supply } from "../../../libs/blockchain";
    import type { Fundraiser } from "../../../libs/types";
    import { NotificationType } from "../../../libs/types";
    import { account, loader, notification } from "../../../libs/stores";

    interface FundraiserYield extends Fundraiser {
        farmed: bigint,
        to_farm: bigint
    }

    const farm = async (fundraiser: FundraiserYield) => {
        $loader = "Farming"
        try {
            await get_farming_supply(fundraiser, $account.wallet);

            await supply(fundraiser.currency, $account.wallet, fundraiser.to_farm);

            $notification = {
                type: NotificationType.success,
                message: "Success",
            }

            fundraiser.farmed = await farming_supply(fundraiser);
            fundraiser.to_farm = fundraiser.raisedAmount - fundraiser.farmed;
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            }
        }
        $loader = null
    }

    const add_yield_data = async (fundraiser: Fundraiser): Promise<FundraiserYield> => {
        let farmed = await farming_supply(fundraiser);
        let to_farm = fundraiser.raisedAmount - farmed;
        return {...fundraiser, farmed, to_farm}
    }
</script>

<div>
    {#await getCampaigns()}
        <span>Loading...</span>
        {:then fundraisers}
        {#if fundraisers === null || fundraisers.length === 0}
            You currently don't have any fundraiser
        {:else}
            <ul class="fundraisers">
                {#each fundraisers as fundraiser, index (fundraiser.id)}
                    {#await add_yield_data(fundraiser) then f}
                        <li>
                            <ul class="fundraiser">
                                <li>{f.name}</li>
                                <li>Farmed: {f.farmed} {f.currency.name}</li>
                                <li>Available: {f.to_farm} {f.currency.name}</li>
                                <li class="grow"></li>
                                <li>
                                    <button on:click={() => farm(fundraiser)}>Farm</button>
                                </li>
                            </ul>
                        </li>
                    {/await}
                {/each}
            </ul>
        {/if}
    {:catch _}
        Error loading fundraisers
    {/await}
</div>

<style lang="scss">
  @use "../../../scss" as imports;
  ul {
    list-style: none;
  }

  .fundraisers {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .fundraiser {
    background-color: imports.$bg-color;
    padding: .5rem 2rem;
    align-items: center;
    display: flex;
    gap: 1rem;
    border-radius: imports.$border-radius;
    position: relative;
    height: 4rem;

    .grow {
      flex: 1;
    }
  }

  button {
    background: white;
    padding: .5rem;
    border: none;
    border-radius: .3rem;
    cursor: pointer;

    &:hover {
      background-color: darken(white, 10%);
    }
  }
</style>