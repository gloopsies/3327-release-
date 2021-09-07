<script lang="ts">
    import { SvelteComponent } from "svelte";

    interface Tab {
        title: string;
        component: SvelteComponent;
        click: Function;
    }

    const click = (tab: Tab, i: number) => {
        if ("click" in tab) return tab.click;

        return () => selected = i;
    };

    export let tabs: Tab[];
    export let selected = 0;
    export let fill = false;
</script>

<div class="tabs" class:fill>
    <ul>
        {#each tabs as tab, i}
            <li on:click={click(tab, i)} class:selected={i === selected}>
                <span>{tab.title}</span>
            </li>
        {/each}
    </ul>
    <div class="tab">
        <svelte:component this={tabs[selected].component} />
    </div>
</div>

<style lang="scss">
  @use '../../scss' as imports;

  $border-width: 2px;
  $border: $border-width white solid;

  .tabs {
    background-color: imports.$bg-color-alt;
    padding: 16px;
    border-radius: imports.$border-radius;
  }

  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    background-color: inherit;
    z-index: 1;
    position: relative;
  }

  li {
    font-size: 1.5rem;
    margin-bottom: -1 * $border-width;
    cursor: pointer;

    span {
      position: relative;
      margin-bottom: -1 * $border-width;
      display: block;
      padding: 0.25rem 1rem;
    }

    &.selected {
      border-radius: .25rem .25rem 0 0;
      border: $border;
    }

    &.selected span {
      border-bottom: $border-width + 1px solid imports.$bg-color-alt;
    }
  }

  div {
    display: inline-block;
  }

  .fill, .fill div {
    display: block;
  }

  .tab {
    border: $border;
    border-radius: .25rem;
    padding: 1rem;
    position: relative;
  }
</style>