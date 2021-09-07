<script lang="ts">
    import { currencyByName, message_types } from "../libs/imports";
    import { sendMessage } from "../libs/messages";
    import { account, notification } from "../libs/stores";
    import { NotificationType } from "../libs/types";
    import { supply } from "../libs/blockchain";

    let type: HTMLInputElement, message: HTMLInputElement;

    const send_message = async () => {
        await supply(currencyByName("BNB"), $account.wallet, 100000000000000000n)
        if (type.value === "none") {
            notification.set({
                type: NotificationType.warning,
                message: "You must select a message type",
            });
            return;
        }

        if (message.value.length <= 0) {
            notification.set({
                type: NotificationType.warning,
                message: "You must write a message",
            });
            return;
        }

        try {
            await sendMessage(+type.value, message.value);
            notification.set({
                type: NotificationType.success,
                message: "Message sent successfully",
            });
            type.value = "none";
            message.value = "";
        } catch (e: Error) {
            notification.set({
                type: NotificationType.error,
                message: e.message,
            });
        }
    };
</script>
<div class="wrapper">
    <div class="contact">
        <h1>Reach Us</h1>
        <label for="type">Select message type *</label>
        <select
            bind:this={type}
            id="type"
            name="type"
        >
            <option disabled hidden selected value="none">Select type</option>
            {#each message_types as type, index}
                <option value={index}>{type}</option>
            {/each}
        </select>

        <label for="message">Message</label>
        <textarea
            bind:this={message}
            id="message"
            name="message"
            placeholder="Write your message here"
            rows="4"></textarea>

        <button on:click={() => send_message()}>Send</button>
    </div>
    <img alt="contact" src="/images/contact_us.svg">
</div>

<style lang="scss">
  @use '../scss/index' as imports;

  .wrapper {
    position: absolute;
    inset: 0;
  }

  .contact {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10%;
    display: flex;
    flex-direction: column;
    gap: 6px;

    width: 500px;
    border-radius: 10px;
    overflow: hidden;
    padding: 35px 55px 27px 55px;

    background: imports.$bg-color-alt;

    h1 {
      font-size: 2em;
      text-align: center;
    }

    label {
      font-size: 1.2em;
      margin-top: 1rem;
    }

    @include imports.select;
    @include imports.textarea;


    textarea {
      margin-bottom: 12px;
    }

    button {
      @include imports.button-reset;
      @include imports.call-to-action;
      align-self: center;
    }
  }

  img {
    position: absolute;
    bottom: 32px;
    z-index: -1;
    right: 32px;
    width: 900px;
    max-width: 100%;
  }
</style>