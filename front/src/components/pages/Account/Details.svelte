<script lang="ts">
    import { onDestroy } from "svelte";

    import { logOut, update } from "../../../libs/auth";
    import { account } from "../../../libs/stores";
    import type { User } from "../../../libs/types";
    import env from "../../../.env";

    let acc: User;
    let display_name: string;
    let email: string;

    const account_unsubscribe = account.subscribe((account: User) => {
        acc = account;
        display_name = account.display_name;
        email = account.email;
    });
    onDestroy(() => account_unsubscribe());

    const profile_picture = () => {
        if (acc.profile_picture.length != 0) return acc.profile_picture;

        if (Math.floor(Math.random() * 2) == 0) {
            return "/images/profile1.svg";
        }

        return "/images/profile2.svg";
    };

    let edit = false;
    let image_picker;
    let img;

    const change_image = (e) => {
        let fr = new FileReader();
        fr.onload = function() {
            img.src = fr.result;
        };
        fr.readAsDataURL(e.target.files[0]);
    };

    const edit_button = async () => {
        if (edit) {
            if (image_picker.files.length > 0) {
                // @ts-ignore
                const ipfs = window.IpfsHttpClient.create({
                    host: env.ipfs_address,
                    port: 5001,
                    protocol: "https",
                });

                const b = await ipfs.add(image_picker.files[0]);
                acc.profile_picture = `${env.ipfs_data_address}/${b.path}`;
            }
            acc.display_name = display_name;
            acc.email = email;
            await update(acc);
        }
        edit = !edit;
    };

    let showNft = false;
</script>

<div class="wrapper">
    <div class="picture">
        <img alt="Profile" bind:this={img} src={profile_picture()}>
        {#if edit}
            <label class="change" for="picture"></label>
            <input bind:this={image_picker} on:change={change_image} type="file" id="picture" accept="image/*"
                   class="hidden">
        {/if}
    </div>
    <div class="data">
        <input
            bind:value={display_name}
            disabled={!edit}
            id="name"
            placeholder="no display name"
            type="text"
        />
        <p class="address">{acc.wallet}</p>
        <input
            bind:value={email}
            disabled={!edit}
            id="mail"
            placeholder="no email"
            type="text"
        />
    </div>
    <div class="buttons">
        <button on:click={edit_button}>{edit ? "Save" : "Edit"}</button>
        <button on:click={logOut}>Log out</button>
    </div>
</div>

<style lang="scss">
  input {
    $border-color: white;
    background: none;
    border: none;
    color: white;
    border-bottom: rgba($border-color, 0) 2px solid;

    &:focus {
      outline: none;
    }

    &:not([disabled]) {
      border-color: $border-color;
    }
  }

  .wrapper {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .picture {
    position: relative;
    width: 100px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    .change {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, .3);
      opacity: 0;
      cursor: pointer;
      transition: opacity .1s;

      &:hover {
        opacity: 1;
      }
    }

    .hidden {
      opacity: 0;
      pointer-events: none;
      display: none;
    }
  }

  #name {
    font-size: 2rem;
  }

  #mail {
    font-size: 1.2rem;
  }

  .address {
    margin: .2rem 0;
  }

  button {
    padding: .2rem .4rem;
  }
</style>