<script lang="ts">
    import { onMount } from "svelte";
    import { clamp, percentage, percentageBN } from "../../libs/imports";

    let component: HTMLElement, bar: HTMLElement, draggable: HTMLElement;
    export let min = 0n, max = 1n, value = 0n, selected = 0n, interactive = false;

    let pay: number, percent: number, minPercent: number = percentageBN(value, min, max);
    let minX: number, valueX: number, maxX: number;

    $: percent = percentageBN(value, min, max);

    const clamp_max = value => clamp(value, min, 100n - minPercent);

    $: selected = clamp(selected, min, max - value);
    $: pay = percentageBN(selected, min, max);

    $: if (typeof component !== "undefined") {
        component.style.setProperty("--value", `${Math.round(percent)}`);
        component.style.setProperty("--pay", `${Math.round(pay)}`);
    }

    onMount(() => {
        const rect = component.getBoundingClientRect();
        minX = rect.left;
        valueX = rect.left + percent * (rect.right - rect.left) / 100;
        maxX = rect.right;
    });

    const drag = (e: MouseEvent) => {
        const x: number = clamp(e.x, valueX, maxX);
        pay = percentage(x - (valueX - minX), minX, maxX);
        selected = BigInt(Math.round(pay * 10)) * (max - min) / 1000n;
    };

    const drag_down = () => {
        if (!interactive) return;
        window.addEventListener("mousemove", drag);
        window.addEventListener("mouseup", drag_up);
    };

    const drag_up = () => {
        window.removeEventListener("mousemove", drag);
        window.removeEventListener("mouseup", drag_up);
    };
</script>

<div bind:this={component} class="meter" class:interactive>
    <div class="events"></div>
    <div bind:this={bar} class="bar">
        <div bind:this={draggable} class="drag" on:mousedown={drag_down}></div>
    </div>
</div>

<style lang="scss">
  @use '../../scss/index' as imports;

  .meter {
    width: 100%;
    height: .8em;
    background-color: hsl(0, 0%, 85%);
    position: relative;
    border-radius: 100000px;
  }

  .bar {
    height: 100%;
    border-radius: 100000px;
    width: calc((var(--pay) + var(--value)) * 1%);
    transition: width .2s;

    background-color: imports.$bg-color-alt;

    &:before {
      content: '';
      position: absolute;
      left: calc(var(--value) * 1%);
      height: 100%;
      width: calc(var(--pay) * 1%);
      transition: width .2s;
      background-color: imports.$information_color;
      border-radius: 100000px;
    }
  }

  .interactive .drag {
    cursor: pointer;
  }

  .drag {
    position: absolute;
    top: 50%;
    left: calc((var(--pay) + var(--value)) * 1%);
    height: 150%;
    aspect-ratio: 1;
    border-radius: 100000px;
    background-color: lighten(imports.$bg-color-alt, 20%);
    box-shadow: 1px 1px 3px rgba(imports.$bg-color, 0.3);
    transform: translate(-50%, -50%);
    transition: scale .3s, color .3s, width .3s, height .3s, left .6s ease-in-out;
    color: lighten(imports.$bg-color-alt, 20%);
    font-size: .8em;
    display: grid;
    place-content: center;
  }

  .meter:hover .drag {
    aspect-ratio: 3/2;
    color: white;
    counter-reset: value calc(var(--value) + var(--pay));
    height: 250%;

    &::after {
      content: counter(value) '%';
    }
  }
</style>