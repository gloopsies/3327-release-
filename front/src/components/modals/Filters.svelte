<!--<script lang="ts">-->
<!--    import Card from "../atoms/Card.svelte"-->
<!--    import { categories } from "../../libs/imports"-->
<!--    import { all_fundraisers, filtered_fundraisers, modal_open } from "../../libs/stores"-->
<!--    import { onDestroy } from "svelte"-->
<!--    import type { Fundraiser } from "../../libs/types"-->

<!--    let sort = 0-->
<!--    let cats: string[] = []-->
<!--    let start_date = ""-->
<!--    let end_date = ""-->
<!--    let fundraisers: Fundraiser[]-->
<!--    let unsubscribe = all_fundraisers.subscribe(val => fundraisers = val)-->
<!--    onDestroy(() => {-->
<!--        unsubscribe()-->
<!--    })-->

<!--    const set_filters = async (sort: number, cats: string[], start_date: string, end_date: string) => {-->
<!--        filtered_fundraisers.update(() => [])-->
<!--        setTimeout(() =>-->
<!--            filtered_fundraisers.update(() =>-->
<!--                fundraisers.filter(fundraiser => {-->
<!--                    if (start_date != "" && new Date(fundraiser.end_date * 1000) < new Date(start_date)) return false-->
<!--                    if (end_date != "" && new Date(fundraiser.end_date * 1000) > new Date(end_date)) return false-->

<!--                    return (cats.length === 0 || cats.indexOf(fundraiser.category) !== -1)-->
<!--                }).sort((f1: Fundraiser, f2: Fundraiser): Number => {-->
<!--                        switch (sort) {-->
<!--                            case 0:-->
<!--                                return (f1.end_date < f2.end_date) ? -1 : 1-->
<!--                            case 1:-->
<!--                                return ( f1.raisedAmount / f1.goal < f2.raisedAmount / f2.goal) ? -1 : 1-->
<!--                            default:-->
<!--                                return 0-->
<!--                        }-->
<!--                    },-->
<!--                ),-->
<!--            ), 1)-->
<!--    }-->

<!--    $: set_filters(sort, cats, start_date, end_date)-->


<!--    const reset = () => {-->
<!--        sort = 0-->
<!--        cats = []-->
<!--        start_date = ""-->
<!--        end_date = ""-->
<!--    }-->

<!--    const apply = () => {-->
<!--        modal_open.set(false)-->
<!--    }-->
<!--</script>-->


<!--<Card>-->
<!--    <div>-->
<!--        <h3>Filter</h3>-->

<!--        <h4>Sort by</h4>-->
<!--        <div>-->
<!--            <div>-->
<!--                <select bind:value={sort} id="category" name="category">-->
<!--                    <option value="0">Expiring Date</option>-->
<!--                    <option value="1">Percent Collected</option>-->
<!--                </select>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div>-->
<!--            <h4>Choose Category</h4>-->
<!--            {#each categories as category}-->
<!--                <div>-->
<!--                    <input-->
<!--                        type="checkbox"-->
<!--                        bind:group={cats}-->
<!--                        id={category}-->
<!--                        value={category}-->
<!--                    />-->
<!--                    <label for={category}>{category}</label>-->
<!--                </div>-->
<!--            {/each}-->

<!--            <div>-->
<!--                <h4>Select Date</h4>-->
<!--                <label for="start_date">From</label>-->
<!--                <input-->
<!--                    bind:value={start_date}-->
<!--                    id="start_date"-->
<!--                    name="start_date"-->
<!--                    placeholder="Date"-->
<!--                    type="date"-->
<!--                />-->
<!--                <label for="end_date">To</label>-->
<!--                <input-->
<!--                    bind:value={end_date}-->
<!--                    id="end_date"-->
<!--                    name="end_date"-->
<!--                    placeholder="Date"-->
<!--                    type="date"-->
<!--                />-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--    <button on:click={reset}>Reset</button>-->
<!--    <button on:click={apply}>ok</button>-->
<!--</Card>-->

<!--<style>-->
<!--    * {-->
<!--        color: black;-->
<!--    }-->
<!--</style>-->