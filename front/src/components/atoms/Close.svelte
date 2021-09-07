<script lang="ts">
    export let click: Function;
</script>

<div class="close" on:click={click}></div>

<style lang="scss">
  @use '../../scss/index' as imports;

  .close {
    width: 30px;
    aspect-ratio: 1;
    position: absolute;
    left: 100%;
    bottom: 100%;
    background-color: rgb(255, 78, 34);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: -3px 3px 6px rgba(imports.$bg-color, .3);
    transform-origin: center;
    transform: translate(-50%, 50%) rotate(45deg);
    transition: background-color .3s, box-shadow .3s;
    z-index: 1001;

    &::before, &::after {
      content: ' ';
      position: absolute;
      inset: 50%;
      width: 3px;
      height: 12px;
      background-color: white;
      transform: translate(-50%, -50%);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(90deg);
    }

    &:hover {
      background-color: #e0370c;
      box-shadow: -4px 4px 8px rgba(imports.$bg-color, .3);
    }
  }
</style>