<script lang="ts">
    import { deleteRequest, getRequests } from "../../../libs/messages";
    import { addOrganization } from "../../../libs/blockchain";
    import type { Request, User } from "../../../libs/types";
    import env from "../../../.env";
    import { account, loader, notification } from "../../../libs/stores";
    import { onDestroy } from "svelte";
    import { NotificationType } from "../../../libs/types";

    const delete_request = async (id: string) => {
        try {
            await deleteRequest(id);
            requests = requests.filter((request: Request) => request.id !== id);
        } catch (err) {
            (err);
        }
    };

    let requests: Request[] = [];
    const get_requests = async () => {
        const _requests = await getRequests();
        if (_requests === null) return;

        requests = await Promise.all(_requests.map(async (request): Promise<Request> => {
            const response = await fetch(`${env.api_url}/user/${request.wallet}`, {
                method: "GET",
            });

            let display_name = request.wallet;
            let profile_picture = `/images/profile${Math.floor(Math.random() * 2) + 1}.svg`;

            if (response.status >= 200 || response.status < 300) {
                const resp = await response.json();
                if (resp.display_name.length > 0)
                    display_name = resp.display_name;
                if (resp.profile_picture.length > 0)
                    profile_picture = resp.profile_picture;
            }

            return { ...request, display_name, profile_picture };
        }));
    };

    let acc: User;
    const account_unsubscribe = account.subscribe((account: User) => acc = account);
    onDestroy(() => account_unsubscribe());

    const accept = async (id: string, wallet: string) => {
        $loader = "Adding organization"
        try {
            await addOrganization(acc.wallet, wallet);
            await delete_request(id);
            $notification = {
                type: NotificationType.success,
                message: "Organization added"
            }
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message
            }
        }
        $loader = null
    };

    const deny = (id: string) => delete_request(id);
</script>

{#await get_requests() then _}
    <ul class="requests">
        {#if requests === null || requests.length === 0}
            <p>No requests at the moment</p>
        {:else}
            {#each requests as request}
                <li>
                    <ul class="request">
                        <li><img src={request.profile_picture} alt="profile"></li>
                        <li>{request.display_name}</li>
                        <li class="message">{request.message}</li>
                        <li>
                            <button on:click={() => accept(request.id, request.wallet)}>Accept</button>
                        </li>
                        <li>
                            <button on:click={() => deny(request.id)}>Deny</button>
                        </li>
                    </ul>
                </li>
            {/each}
        {/if}
    </ul>
{:catch err}
    {err}
{/await}

<style lang="scss">
  @use '../../../scss/index' as imports;

  ul {
    list-style: none;
  }

  .requests {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .request {
    background-color: imports.$bg-color;
    padding: .5rem 2rem;
    align-items: center;
    display: flex;
    gap: 1rem;
    border-radius: imports.$border-radius;
    position: relative;

    .message {
      flex-grow: 1;
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

  img {
    max-height: 3rem;
  }
</style>