<script lang="ts">
    import { onDestroy } from "svelte";
    import type { Notification } from "../../libs/types";
    import { NotificationType } from "../../libs/types";
    import { notification } from "../../libs/stores";
    import Close from "./Close.svelte";

    const timeout = 4;

    let notif: Notification;
    let lastColor: NotificationType = NotificationType.information;

    let timeout1, timeout2, force = false;
    let closed = false;

    notification.subscribe(n => {
        closed = false;
        force = true;
        setTimeout(() => force = false, 30);
        notif = n;
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        if (n !== null) {
            lastColor = n.type;
            timeout1 = setTimeout(() => {
                notification_close();
            }, timeout * 1000);
        }
    });

    const notification_close = () => {
        closed = true;
        timeout2 = setTimeout(() => {
            notification.set(null);
            closed = false;
        }, 200);
    };

    let type: NotificationType;
    $: type = (notif !== null) ? notif.type : lastColor;

    onDestroy(() => {
    });
</script>

<div class={`notification ${type}`} class:closed class:show={notif !== null && !force}
     on:click|stopPropagation={() => {}}
     style={`--timeout:${timeout}s`}>
    <Close click={notification_close} />
    {#if notif !== null && "message" in notif}
        {notif && notif.message}
    {/if}
</div>

<style lang="scss">
  @use '../../scss/index' as imports;

  @mixin test($name, $color) {
    .#{$name} {
      background-color: $color;

      &:before {
        background-color: darken($color, 10%);
      }
    }
  }

  $types: error imports.$error_color,
  warning imports.$warning_color,
  information imports.$information_color,
  success imports.$success_color;

  @each $type in $types {
    @include test(nth($type, 1), nth($type, 2))
  }

  @keyframes timeout {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  .notification {
    position: fixed;
    z-index: 1000;
    width: 500px;
    max-width: 80vw;
    right: 24px;
    bottom: 16px;
    opacity: 0;
    transition: opacity .2s;
    padding: 32px 16px;
    border-radius: imports.$border-radius;

    &:before {
      content: '';
      position: absolute;
      border-radius: imports.$border-radius imports.$border-radius 0 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 20px;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 12px;
      width: 100%;
      height: 6px;
      background-color: white;
      transform-origin: left;
    }
  }

  .notification.closed {
    opacity: 0;
    animation: timeout 0 linear forwards;
  }

  .show {
    opacity: initial;
    pointer-events: initial;

    &:after {
      animation: timeout var(--timeout) linear forwards;
    }
  }
</style>