<script lang="ts">
    import Card from "../atoms/Card.svelte";
    import { mint_award } from "../../libs/blockchain";
    import { account, loader, modal_open, nft, notification } from "../../libs/stores";
    import { onDestroy } from "svelte";
    import type { User } from "../../libs/types";
    import { NotificationType } from "../../libs/types";
    import { Link } from "svelte-navigator";

    let award, user: User;
    const unsubscribe_nft = nft.subscribe(a => award = a);
    const unsubscribe_user = account.subscribe(u => user = u);

    const mint = async () => {
        try {
            $loader = "Minting your reward...";
            await mint_award(user.wallet, award);
            $notification = {
                type: NotificationType.success,
                message: "Successfully minted nft",
            };
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            };
        } finally {
            $loader = null;
        }
        modal_open.set(false);
    };

    onDestroy(() => {
        unsubscribe_nft();
        unsubscribe_user();
    });
</script>

<Card>
    <div class="wrapper">
        <h1>Claim your reward</h1>
        <p>You can see all your awards at your
            <Link to="/account">Account page</Link>
        </p>
        <button on:click={mint}>Mint NFT</button>
    </div>
</Card>

<style lang="scss">
  * {
    color: black;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  button {
    margin-top: 16px;
    font-size: 1.5rem;
    padding: 1.2rem 1.4rem;
    cursor: pointer;
    align-self: center;
  }
</style>