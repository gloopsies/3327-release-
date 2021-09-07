<script lang="ts">
    import { deleteMessage, getMessages } from "../../../libs/messages";
    import type { Message } from "../../../libs/types";
    import { NotificationType } from "../../../libs/types";
    import env from "../../../.env";
    import { message_types } from "../../../libs/imports";
    import { notification } from "../../../libs/stores";

    let messages: Message[] = [];

    const delete_message = async (id: string) => {
        try {
            await deleteMessage(id);
            notification.set({
                type: NotificationType.success,
                message: "Successfully deleted message",
            });
            messages = messages.filter((message: Message) => message.id !== id);
        } catch (err: Error) {
            notification.set({
                type: NotificationType.error,
                message: "Error deleting message",
            });
        }
    };

    const get_messages = async () => {
        const _messages = await getMessages();
        if (_messages === null) return;

        messages = await Promise.all(_messages.map(async (message): Promise<Message> => {
            const response = await fetch(`${env.api_url}/user/${message.wallet}`, {
                method: "GET",
            });

            let display_name = message.wallet;
            let profile_picture = `/images/profile${Math.floor(Math.random() * 2) + 1}.svg`;

            if (response.status >= 200 || response.status < 300) {
                const resp = await response.json();
                if (resp.display_name.length > 0)
                    display_name = resp.display_name;
                if (resp.profile_picture.length > 0)
                    profile_picture = resp.profile_picture;
            }

            return { ...message, display_name, profile_picture };
        }));
    };
</script>

{#await get_messages() then _}
    <ul class="messages">
        {#if messages === null || messages.length === 0}
            <p>No messages at the moment</p>
        {:else}
            {#each messages as message}
                <li>
                    <ul class="msg">
                        <li><img src={message.profile_picture} alt="profile"></li>
                        <li>{message.display_name}</li>
                        <li>{message_types[message.type]}</li>
                        <li class="message">{message.message}</li>
                        <li>
                            <button on:click={() => delete_message(message.id)}>Delete</button>
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
  @use "../../../scss" as imports;

  ul {
    list-style: none;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .msg {
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