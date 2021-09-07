<script lang="ts">
    import { Link } from "svelte-navigator";
    import { account } from "../libs/stores";
    import { loggedIn } from "../libs/auth";
    import { isOrganization } from "../libs/blockchain";
    import Tabbed from "../components/atoms/Tabbed.svelte";
    import Create from "../components/pages/Organization/Create.svelte";
    import Yield from "../components/pages/Organization/Yield.svelte";

    export let selected: number = 0;

    const tabs = [
        {
            title: "Create",
            component: Create,
            click: () => {
                window.history.pushState(null, "Requests", "/organization/create");
                selected = 0;
            },

        },
        {
            title: "Yield",
            component: Yield,
            click: () => {
                window.history.pushState(null, "yield", "/organization/yield");
                selected = 1;
            },

        }
    ]
</script>

{#await loggedIn()}
    <h2>Loading...</h2>
{:then _ }

    {#if !$account.session}
        <h1>Please register at
            <Link to="/account">Account page</Link>
        </h1>
    {:else}
        {#await isOrganization($account.wallet) then org}
            {#if org}
                <Tabbed {tabs} {selected} fill/>
            {:else }
                <h2>Please request rights to create campaigns at
                    <Link to="/account">Your account page</Link>
                </h2>
            {/if}
        {/await}
    {/if}
{/await}