<script lang="ts">
    import { getCampaigns } from "../libs/blockchain";
    import FundraiserCard from "../components/FundraiserCard.svelte";

    import { categories, modals } from "../libs/imports";
    import { modal_component, modal_open, notification } from "../libs/stores";
    import type { Fundraiser } from "../libs/types";
    import { NotificationType } from "../libs/types";
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";

    let filtered: Fundraiser[], fundraisers: Fundraiser[] = [];

    const loadData = async () => {
        try {
            fundraisers = await getCampaigns();
            fundraisers = fundraisers === null ? [] : fundraisers;
            filtered = fundraisers;
            return fundraisers;
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            };

            throw e;
        }
    };

    const open_modal = (modal: modals) => {
        modal_open.update(e => !e);
        $modal_component = modal;
    };

    // Filters

    enum Sorting {
        ExpiringDate = "Expiring Date",
        PercentRaised = "Percent Raised",
        Goal = "Goal",
        Raised = "Raised"
    }

    interface Filters {
        search: string,
        sorting: Sorting,
        sort_order: boolean,
        categories: string[],
        start_date: string,
        end_date: string,
    }

    const default_filters: Filters = Object.freeze({
        search: "",
        sort_order: false,
        sorting: Sorting.ExpiringDate,
        categories: [],
        start_date: "",
        end_date: "",
    });
    let filters: Filters = { ...default_filters };

    const set_filters = (filters: Filters, fundraisers: Fundraiser[]) => {
        const { search, sorting, categories, start_date, end_date } = filters;
        filtered = fundraisers.filter((fundraiser: Fundraiser) => {
            if (start_date.length != 0 && new Date(fundraiser.end_date * 1000) < new Date(start_date)) return false;
            if (end_date.length != 0 && new Date(fundraiser.end_date * 1000) > new Date(end_date)) return false;
            if (search.length != 0 && (`${fundraiser.name}$${fundraiser.description}`.toLowerCase().indexOf(search.toLowerCase()) === -1)) return false;
            return (categories.length === 0 || categories.indexOf(fundraiser.category) !== -1);
        }).sort((f1: Fundraiser, f2: Fundraiser): Number => {
            const order = filters.sort_order ? -1 : 1;
            switch (sorting) {
                case Sorting.ExpiringDate:
                    return ((new Date(f1.end_date * 1000) < new Date(f2.end_date * 1000)) ? -1 : 1) * order;
                case Sorting.PercentRaised:
                    return ((f1.raisedAmount * 1000n / f1.goal < f2.raisedAmount * 1000n / f2.goal) ? -1 : 1) * order;
                case Sorting.Goal:
                    return ((f1.goalETH < f2.goalETH) ? -1 : 1) * order;
                case Sorting.Raised:
                    return ((f1.raisedETH < f2.raisedETH) ? -1 : 1) * order;
                default:
                    return 0;
            }
        });
    };

    $: set_filters(filters, fundraisers);

    const clear_filters = () => filters = { ...default_filters };

    const [send, receive] = crossfade({
        duration: d => Math.sqrt(d * 1000),

        fallback() {
            return {
                duration: 300,
                easing: quintOut,
                css: t => `opacity: ${t}`,
            };
        },
    });
</script>

<div class="explore">
    <div class="page explore">
        <div class="wrapper">
            <h1>Explore active campaigns</h1>
            <p>
                Right now, a lot of kids are hoping for better future.

                <br />
                <br />

                There are children struggling with food and shelter.
                For many, childhood is a daily battle, with nowhere to turn. But You can change this and transform
                someone's life.

                <br />

                Our work relies on generous people like you.
                By donating today you can help us continue our vital nonprofit work. You can give a child a brighter
                future.
                A future full of hope, and free from fear.
            </p>
            <a href="#fundraisers">Explore</a>
            <button class="secondary" on:click={() => open_modal(modals.networks)}>Switch network</button>
            <p>Switch between networks to choose Your favorite network</p>
        </div>

        <img alt="home" src="/images/donate_kids.svg">
    </div>

    <div id="fundraisers">
        <div>
            <div class="filters">
                <h2>Sort</h2>
                <span>
                    <select bind:value={filters.sorting} id="sort" name="sort">
                        {#each Object.entries(Sorting) as sort}
                            <option value={sort[1]}>{sort[1]}</option>
                        {/each}
                    </select>
                    <button aria-label="reverse order" class="sort-order" class:rotated={filters.sort_order}
                            on:click={() => filters.sort_order = !filters.sort_order}></button>
                </span>
                <h2>Search</h2>
                <input bind:value={filters.search} placeholder="Search term" type="text">
                <h2>Filters</h2>
                <h3>Categories</h3>
                {#each categories as category}
                    <span>
                        <input
                            type="checkbox"
                            id={category}
                            value={category}
                            bind:group={filters.categories}
                        >
                        <label for={category} class="checkbox"></label>
                        <label for={category}>{category}</label>
                    </span>
                {/each}
                <h3>End date</h3>
                <span class="dates">
                    <label for="start_date">From</label>
                    <input
                        bind:value={filters.start_date}
                        id="start_date"
                        name="start_date"
                        placeholder="Date"
                        type="date"
                    />
                    <label for="end_date">To</label>
                    <input
                        bind:value={filters.end_date}
                        id="end_date"
                        name="end_date"
                        placeholder="Date"
                        type="date"
                    />
                </span>
                <button class="reset" on:click={clear_filters}>Reset</button>
            </div>
        </div>
        <div>
            {#await loadData()}
                <span>Loading...</span>
            {:then _}
                <div class="cards">
                    {#if fundraisers.length === 0}
                        Currently there are no fundraisers
                    {:else if filtered.length === 0}
                        No fundraisers with selected filters
                    {/if}
                    {#each filtered as fundraiser, index (fundraiser.id)}
                        <div
                            animate:flip={{duration: 750}}
                            in:receive="{{key: fundraiser.id}}"
                            out:send="{{key: fundraiser.id}}"
                        >
                            <FundraiserCard {fundraiser} {index} />
                        </div>
                    {/each}
                </div>
            {:catch e}
                Error loading fundraisers
            {/await}
        </div>
    </div>

</div>

<style lang="scss">
  @use "../scss" as imports;

  $padding: 16px;

  #fundraisers {
    display: grid;
    grid-template-columns: 300px 1fr;
    padding-top: 0;

    & > div:nth-child(2) {
      min-height: 100vh;
    }
  }

  .filters {
    position: sticky;
    top: 0;
    padding: $padding 0;

    display: flex;
    flex-direction: column;
    align-items: start;
    max-height: 100vh;
    overflow-y: auto;
  }

  h2:not(:first-child) {
    margin-top: .75rem;
  }

  h3 {
    margin-top: .5rem;
  }

  span {
    display: flex;
    gap: .5rem;
    justify-content: center;
    align-items: center;
  }

  label {
    cursor: pointer;
  }

  .sort-order {
    @include imports.button-reset;
    height: 2em;
    aspect-ratio: 1/1;
    background-color: imports.$alt-color;
    border-radius: 50%;
    position: relative;
    transform: rotate(45deg);
    transition: transform .2s ease-in-out;

    &:hover {
      background-color: desaturate(imports.$alt-color, 30%);
    }

    &.rotated {
      transform: rotate(225deg);
    }

    &:before, &:after {
      transform: translate(-.2rem, -.2rem);
      content: '';
      position: absolute;
      background-color: imports.$bg-color;
      width: .8em;
      height: .2em;
    }

    &:after {
      transform-origin: bottom left;
      width: .6em;
      transform: translate(-.2rem, -.2rem) rotate(90deg);
    }
  }

  @include imports.input-text;
  @include imports.select;
  @include imports.custom-checkbox;
  @include imports.input-date;

  .dates {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .25rem 1em;
  }

  .reset {
    @include imports.button-reset;
    @include imports.button;
    margin-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .page {
    @include imports.page;

    a {
      @include imports.link-reset;
      @include imports.call-to-action;
    }

    button.secondary {
      @include imports.button-reset;
      @include imports.call-to-action-secondary;
    }
  }

  .explore {
    .wrapper {
      left: 32px;
    }

    img {
      right: 0;
      padding-right: 5%;
    }
  }
</style>
