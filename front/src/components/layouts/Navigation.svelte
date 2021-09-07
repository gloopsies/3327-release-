<script lang="ts">
    import { Link } from "svelte-navigator";
    import { onDestroy } from "svelte";
    import { loggedIn } from "../../libs/auth";
    import { account } from "../../libs/stores";
    import type { User } from "../../libs/types";
    import { has_provider } from "../../libs/web3";

    let acc: User;

    const account_unsubscribe = account.subscribe((account: User) => acc = account);
    onDestroy(() => account_unsubscribe());

    let promise = loggedIn();
</script>
<nav>
    <ul>
        <li>
            <Link to="/">
                <img alt="Home" src="/icons/home.svg">
                Home
            </Link>
        </li>
        {#if !has_provider()}
            <li>
                <Link to="/get-metamask">
                    <img src="/icons/download.svg" alt="Get Metamask">
                    Get Metamask
                </Link>
            </li>
        {:else}

            <li>
                <Link to="/account">
                    <img src="/icons/account.svg" alt="Account">
                    Account
                </Link>
            </li>

            <li>
                <Link to="/explore">
                    <img src="/icons/explore.svg" alt="Explore">
                    Explore
                </Link>
            </li>

            <li>
                <Link to="/donations">
                    <img src="/icons/leaderboard.svg" alt="Leaderboard">
                    Donations
                </Link>
            </li>


            <li>
                <Link to="/switch-network">
                    <img src="/icons/network.svg" alt="Switch network">
                    Switch network
                </Link>
            </li>

            {#await promise then _}
                {#if acc.logged}
                    <li>
                        <Link to="/swap">
                            <img src="/icons/swap.svg" alt="Swap">
                            Swap
                        </Link>
                    </li>

                    {#if acc.organization}
                        <li>
                            <Link to="/organization">
                                <img src="/icons/people.svg" alt="Organization">
                                Organization
                            </Link>
                        </li>
                    {/if}

                    {#if acc.admin}
                        <li>
                            <Link to="/admin">
                                <img src="/icons/admin.svg" alt="Admin panel">
                                Admin panel
                            </Link>
                        </li>
                    {/if}
                {/if}
            {/await}
        {/if}
        <li class="spacer"></li>

        <li>
            <Link to="/guides">
                <img alt="Guides" src="/icons/docs.svg">
                Guides
            </Link>
        </li>

        {#if has_provider()}
            <li>
                <Link to="/contact-us">
                    <img src="/icons/contact.svg" alt="Contact">
                    Contact us
                </Link>
            </li>
        {/if}
    </ul>
</nav>

<style lang="scss">
  @use "../../scss" as imports;

  nav {
    position: fixed;
    background-color: imports.$bg-color-alt;
    padding: 16px 0;
    width: imports.$sidebar-closed-width;
    white-space: nowrap;
    overflow: hidden;
    height: 100%;
    z-index: 10;
    transition: width ease-in .2s;

    &:hover {
      width: imports.$sidebar-opened-width;
    }

    ul {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    li {
      list-style: none;
      font-size: 1.4rem;

      &.spacer {
        flex-grow: 1;
      }

      &:not(.spacer):hover {
        background-color: imports.$bg-color;
      }

      :global(a) {
        display: flex;
        align-items: center;
        color: imports.$fg-color;
        padding: 16px;
        text-decoration: none;
        font-weight: lighter;
      }
    }

    &::before {
      content: '';
      background-color: black;
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: 0;
      transition: opacity .2s ease-in-out;
    }

    &:hover::before {
      opacity: .4;
    }

    &::after {
      content: '';
      background-color: inherit;
      position: fixed;
      inset: 0;
      z-index: -1;
      width: inherit;
      pointer-events: none;
    }
  }

  img {
    display: inline;
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }

</style>