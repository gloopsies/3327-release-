<script lang="ts">
    import Card from "../atoms/Card.svelte";
    import { sendRequest } from "../../libs/messages";
    import { modal_component, modal_open, notification } from "../../libs/stores";
    import { NotificationType } from "../../libs/types";

    let area: HTMLInputElement;

    const modal_close = () => {
        modal_open.set(false);
        modal_component.set(0);
    };

    const send_request = async () => {
        try {
            await sendRequest(area.value);
            modal_close();
            notification.set({
                type: NotificationType.success,
                message: "Request successfully sent",
            });
        } catch (e: Error) {
            notification.set({
                type: NotificationType.error,
                message: e.message,
            });
        }
    };
</script>

<Card>
    <div class="wrapper">
        <h1>Organization request form</h1>
        <label for="request">Enter your message here</label>
        <textarea bind:this={area} cols="30" id="request" name="request" placeholder="Message" rows="10"></textarea>
        <button on:click={() => send_request()}>Send request</button>
    </div>
</Card>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  textarea {
    padding: .5rem;
  }

  button {
    align-self: center;
    padding: .5rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>