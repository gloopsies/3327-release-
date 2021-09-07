<script lang="ts">
    import { loader } from "../../libs/stores";
</script>

<div class="loading" class:show={$loader}>
    <div>
    </div>
    <h1>{$loader}</h1>
</div>

<style lang="scss">
  @use "../../scss" as imports;

  @keyframes load {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(720deg);
    }
  }

  h1 {
    font-size: 3rem;
  }

  .loading {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, .8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;

    div {
      position: relative;
      width: 8rem;
      aspect-ratio: 1/1;
      background-color: imports.$bg-color-alt;
      border-radius: 50%;
      animation: load 2s infinite ease-in-out;
    }

    div:before, div:after {
      position: absolute;
      content: "";
      border-radius: 50%;
      aspect-ratio: 1/1;
      inset: 50%;
      transform: translate(-50%, -50%);
    }

    div:before {
      width: 70%;
      background: conic-gradient(imports.$alt-color .7turn, imports.$bg-color-alt .7turn);
    }

    div:after {
      width: 30%;
      background-color: imports.$bg-color-alt;
    }
  }

  .show {
    opacity: 1;
    pointer-events: initial;
  }
</style>