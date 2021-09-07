<script lang="ts">
    import Fundraiser from "./Fundraiser.svelte";
    import Empty from "./Empty.svelte";
    import Filters from "./Filters.svelte";
    import NFT from "./NFT.svelte";
    import Request from "./Request.svelte";
    import { onDestroy, onMount } from "svelte";
    import { modal_component, modal_open } from "../../libs/stores";
    import Close from "../atoms/Close.svelte";
    import NetworkChooser from "./NetworkSwitch.svelte";
    import CurrencyPicker from "./CurrencyPicker.svelte";

    let open = false;
    let component = 0;

    let timeout;

    let open_unsubscribe = modal_open.subscribe(val => open = val);
    let component_unsubscribe = modal_component.subscribe(val => {
        clearTimeout(timeout);
        if (val === 0) {
            timeout = setTimeout(() => component = val, 300);
            return;
        }
        component = val;
    });
    const components = [Empty, Fundraiser, Filters, NFT, Request, NetworkChooser, CurrencyPicker];

    const modal_close = () => {
        modal_open.set(false);
        modal_component.set(0);
    };

    const escape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            modal_close();
        }
    };

    onMount(() => {
        window.addEventListener("keydown", escape);
    });

    onDestroy(() => {
        open_unsubscribe();
        component_unsubscribe();
        window.removeEventListener("keydown", escape);
    });
</script>

<div class="bg" class:open on:click={modal_close}>
    <div on:click|stopPropagation={() => {}}>
        <Close click={modal_close} />
        <svelte:component this={components[component]} />
    </div>
</div>

<style lang="scss">
  div.bg {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: grid;
    place-content: center;
    z-index: 100;

    transition: opacity .2s;
    opacity: 1;

    & > * {
      transition: transform .3s;
      transform: translateY(0);
    }
  }

  div.bg:not(.open) {
    opacity: 0;
    pointer-events: none;

    & > * {
      transform: translateY(-60px);
    }
  }
</style>