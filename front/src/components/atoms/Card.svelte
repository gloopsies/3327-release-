<div>
    <slot />
</div>

<style lang="scss">
  @use '../../scss/index' as imports;

  div {
    background-color: imports.$card-bg-color;
    border-color: imports.$card-color;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 0 15px -5px imports.$card-color;
    color: imports.$card-color;

    :global(*) {
      color: imports.$card-color
    }
  }
</style>