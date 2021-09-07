<script lang="ts">
    import Tabbed from "../components/atoms/Tabbed.svelte";
    import Currency from "../components/pages/Swap/Currency.svelte";
    import Layer from "../components/pages/Swap/Layer.svelte";

    export let selected: number = 0;

    const tabs = [
        {
            title: "Currency",
            component: Currency,
            click: () => {
                window.history.pushState(null, "Swap currency", "/swap/currency");
                selected = 0;
            },
        },
        {
            title: "Layer",
            component: Layer,
            click: () => {
                window.history.pushState(null, "Transfer layer", "/swap/layer");
                selected = 1;
            },
        },
    ];
</script>

<div class="wrapper">
    <div>
        <Tabbed {selected} {tabs} />
    </div>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>