<script lang="ts">
    import { onMount } from "svelte";
    import Meter from "./atoms/Meter.svelte";
    import Card from "./atoms/Card.svelte";

    import { calcExp, fromWei, modals, toFixedDecimals } from "../libs/imports";
    import { modal_component, modal_fundraiser, modal_open } from "../libs/stores";
    import type { Fundraiser } from "../libs/types";

    export let fundraiser: Fundraiser = {} as Fundraiser, index;

    fundraiser.days_left = calcExp(fundraiser.end_date);
    const { name, image, category, raisedAmount, goal, days_left, currency } = fundraiser;


    const open_modal = () => {
        modal_open.update(e => !e);
        modal_component.set(modals.fundraiser);
        modal_fundraiser.set(fundraiser);
    };

    let component;
    onMount(() => {
        component.style.setProperty("--index", index);
    });
</script>

<div bind:this={component} class="wrapper">
    <Card>
        <div class="fundraiser" on:click={open_modal}>
            <h1>{name}</h1>
            <img alt={name} src={image} />
            <span>{category}</span>
            <span class="padding">
                <Meter max={goal} value={raisedAmount} />
            </span>
            <h3>{toFixedDecimals(fromWei(raisedAmount, currency), 3)} of </h3>
            <h3> {fromWei(goal, currency)} {currency.name}</h3>
            <h3>{days_left > 1 ? `${days_left} days left` : `${days_left} day left`}</h3>
        </div>
    </Card>
</div>

<style lang="scss">
  @use '../scss/index' as imports;

  * {
    color: imports.$card-color;
  }

  .wrapper {
    transition-duration: 0.3s;

    &:hover {
      transform: scale(1.02);
    }
  }

  .fundraiser {
    position: relative;

    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      width: 80%;

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      font-size: 1.5rem;
      line-height: 1.1;
      height: calc(1.1 * 2em);
    }

    img {
      $margin: 15px;
      width: calc(100% - 2 * #{$margin});
      aspect-ratio: 1;
      margin: $margin;
      border-radius: 10px;

      object-fit: cover;
    }
  }

  .padding {
    padding: 8px 16px;
    width: 100%;
  }
</style>
 