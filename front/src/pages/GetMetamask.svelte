<div class="page get">
    <div class="wrapper">
        <h1>Get Metamask</h1>
        <p>
            MetaMask is an Ethereum web browser extension that acts as an
            Ethereum wallet and an interface for Ethereum-based dApps (decentralized applications).
            <br />
            <br />

            MetaMask allows users to store Ethereum related data like public addresses and private keys
            like any other Ethereum wallet (i.e. you can hold your tokens on there), and it allows users to interact with
            websites running Ethereum-based apps and smart contracts (i.e. it turns your web browser into an Ethereum browser).

            <br />

            The bottom line being that MetaMask allows users to do anything Ethereum related (like interact with smart contracts,
            send/store/receive Ether, or interface with Ethereum-based web apps).
        </p>
        <a href="https://metamask.io/download">Get Metamask</a>
    </div>

    <img alt="home" src="/images/metamask.png">
</div>

<style lang="scss">
  @use "../scss" as imports;

  .page {
    @include imports.page;

    a {
      @include imports.button-reset;
      @include imports.call-to-action;
    }
  }

  .get {
    .wrapper {
      left: 32px;
    }

    img {
      right: 0;
      margin-right: 10%;
      bottom: 10%;
    }
  }
</style>