<script>
    import { Link } from "svelte-navigator";
    import { has_provider } from "../libs/web3";
</script>

<a href={"#"}>
    <button class="nav-button"></button>
</a>

<div class="padding"></div>
<div class="page home">
    <div class="wrapper">
        <h1>Change the future</h1>
        <p>
            Growing up in poverty, children face tough challenges: hunger and malnutrition, limited access to education
            and
            medical services, social discrimination and isolation. But with support from people like you, we can help
            children get the health care, education, life skills, job-readiness training and confidence they need to
            create
            lasting change in their lives and communities. Together, we can end poverty for good.
        </p>
        {#if has_provider()}
            <Link to="/explore">Donate now</Link>
        {:else}
            <Link to="/get-metamask">Get Metamask</Link>
        {/if}
        <p>Donate directly to social good projects with zero added fees.</p>
    </div>

    <img alt="home" src="/images/home.webp">
</div>
<div class="spacer"></div>
<div class="page why-crypto">
    <div class="wrapper">
        <h1>Why crypto?</h1>
        <p>
            Donating cryptocurrency directly is more tax efficient and can save you money.
            The IRS (Internal Revenue Service) classifies cryptocurrency as property for tax purposes which means it is
            typically the most tax efficient way to support your favorite cause.
            When donating crypto, you receive a tax deduction for the fair market
            value of the crypto, and you avoid the capital gains tax you would
            have incurred if you had sold the crypto and then made a donation.
            That means you’re able to donate more, as well as deduct more on your tax return.
            The difference? Sometimes more than 30%.
        </p>
    </div>

    <img alt="kid" src="/images/kid.svg">
</div>
<div class="spacer"></div>
<div class="page layer2">
    <div class="wrapper">
        <h1>Layer 2 Support</h1>
        <p>
            As the number of people using Ethereum has grown, the blockchain has reached certain capacity limitations.
            This has driven up the cost of using the network, creating the need for "scaling solutions".
            Layer 2 refers to the overlying network that improves transaction processing rate (TPS) while lowering the
            gas fee.
            These solutions are not part of the package, so to speak — you can use them if you want to, but you are not
            obliged to do so.
        </p>
        {#if has_provider()}
            <Link to="/guides">Check Our Guide</Link>
        {:else}
            <Link to="/get-metamask">Get Metamask</Link>
        {/if}
    </div>

    <img alt="layer2" class="layer2_cover" src="/images/layer2_cover.png">
</div>

<div class="page why-us">
    <h1>Features</h1>
    <div class="features">
        <div>
            <img alt="features_donation" src="/images/features_donation.svg" />
            <h2>Create Campaign</h2>
            <p>
                A campaign allows donations for the most important of them all - children.
                You can create and edit your campaign in hopes of reaching your goal - helping and saving lives that
                matter the most.
            </p>
        </div>
        <div>
            <img alt="features_ethereum" src="/images/features_ethereum.svg" />
            <h2>Donate in Ethereum</h2>
            <p>
                Ethereum enables the deployment of smart contracts and decentralized applications (dapps) to be built
                and run without any downtime,
                fraud, control or interference from a third party.
            </p>
        </div>
        <div>
            <img alt="features_account" src="/images/features_account.svg" />
            <h2>Customize Account</h2>
            <p>
                Logging-in with your wallet, you can keep track of latest transactions and your information about
                previous donations and collected
                NFT's. You can also edit your name and change the avatar.
            </p>
        </div>
        <div>
            <img alt="features_polygon" src="/images/features_polygon.svg" />
            <h2>Polygon Network</h2>
            <p>
                Polygon, formerly known as the Matic Network, is a scaling solution that aims to
                provide multiple tools to improve the speed and reduce the cost and complexities of transactions on
                blockchain networks.
            </p>
        </div>
        <div>
            <img alt="features_swap" src="/images/features_swap.svg" />
            <h2>Swap Coins</h2>
            <p>
              A crypto swap is a process of exchanging one digital asset to another between two wallets without using fiat currency as 
              an intermediary. You can also use our platform to swap currencies between Layers.
            </p>
        </div>
        <div>
            <img alt="features_nft" src="/images/features_nft.svg" />
            <h2>NFT Rewarding</h2>
            <p>
                NFT (non-fungible token) is a unit of data stored on a blockchain, 
                that certifies a digital asset to be unique and therefore not interchangeable. 
                You will receive NFT upon donating to some fundraiser.
            </p>
        </div>
    </div>
</div>

<div class="goals">
    <h1>Our Goal</h1>
    <div class="cards">
        <div class="box">
            <h2>Decentralization</h2>
            <img alt="security" src="/images/homeGoal.png" />
            <p>
                The donation serves as a contract between donor and charity, which is immutable,
                but requires funds to be pledged up-front by the donor.
                This blockchain-based website allows users to donate money directly to
                charitable causes with a number of conditions attached upheld with the
                use of smart contracts.
            </p>
        </div>
        <div class="box">
            <h2>Fighting Poverty</h2>
            <img alt="security" src="/images/homePoverty.png" />
            <p>
                Over the last 30 years over 1 billion people have come out of poverty.
                736 million people are still in extreme poverty - surviving on less than $1.90 a day.
                We tackle the underlying causes of poverty and social injustice,
                in order to deliver lasting change in the lives of poor and vulnerable people.
            </p>
        </div>
        <div class="box">
            <h2>Inspiring Creativity</h2>
            <img alt="security" src="/images/homeCreativity.svg" />
            <p>
                All children need to be truly creative is the freedom to commit themselves completely
                to the effort and make whatever activity they are doing their own.
                Creativity also fosters mental growth in children by providing opportunities
                for trying out new ideas, and new ways of thinking and problem-solving.
            </p>
        </div>
    </div>
</div>
<div class="padding"></div>

<style lang="scss">
  @use '../scss/index' as imports;

  :global(html) {
    scroll-snap-type: y proximity;
    scroll-snap-stop: always;
    scroll-behavior: smooth;

    :global(main) > :not(.spacer),
    .box {
      scroll-snap-align: center;
      scroll-snap-stop: always;
    }
  }

  .nav-button {
    @include imports.button-reset;
    z-index: 10001;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;

    height: 3.5em;
    aspect-ratio: 1/1;
    background-color: imports.$alt-color;
    border-radius: 50%;
    transform: rotate(45deg);
    transition: transform .2s ease-in-out;

    &:hover {
      background-color: desaturate(imports.$alt-color, 30%);
    }

    &:before, &:after {
      transform: translate(-.2rem, -.2rem);
      content: '';
      position: absolute;
      background-color: imports.$bg-color;
      width: .8em;
      height: .2em;
    }

    &:after {
      transform-origin: bottom left;
      width: .6em;
      transform: translate(-.2rem, -.2rem) rotate(90deg);
    }
  }

  .padding {
    height: 16px;
    margin-top: -16px;

    & + .page {
      scroll-snap-align: none;
    }
  }

  .page {
    @include imports.page;

    :global(a) {
      @include imports.link-reset;
      @include imports.call-to-action;
    }
  }

  .home {
    .wrapper {
      left: 32px;
    }

    img {
      right: 0;
    }
  }

  .why-crypto {
    .wrapper {
      top: 64px;
      right: 32px;
    }

    img {
      left: 0;
      z-index: -1;
    }
  }

  .layer2 {
    .wrapper {
      left: 32px;
    }

    img {
      right: 4rem;
      max-width: 80%;
      max-height: 40%;
      margin-bottom: 4rem;
    }
  }

  .spacer {
    height: 120px;
  }

  .goals {
    padding-top: 32px;

    h1 {
      font-size: 4rem;
      text-align: center;
    }
  }

  .why-us {
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 4rem;
      text-align: center;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 2rem 0;
      gap: 2rem;
      max-width: 1000px;

      div {
        background-color: white;
        padding: 2rem;
        border-radius: imports.$border-radius;

        h2 {
          color: imports.$bg-color;
          margin: .4rem 0;
        }

        p {
          font-size: 1.1rem;
          color: black;
        }

        img {
          width: 80px;
          aspect-ratio: 1/1;
        }
      }
    }
  }


  .cards {
    background-color: imports.$bg-color-alt;
    border-radius: imports.$border-radius;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 30px 1rem 1rem;

    .box {
      background-color: transparent;
      padding: 3rem;
      border-radius: imports.$border-radius;

      h2 {
        font-size: 35px;
        word-wrap: break-word;
      }

      img {
        width: 100%;
        height: 30vh;
        margin: 20px 0;

        border-radius: imports.$border-radius;
        object-fit: cover;
      }

      p {
        padding: 0 10px;
        font-size: 1.3rem;
      }
    }
  }

  @media (max-width: 1200px) {
    .cards {
      grid-template-columns: repeat(1, 1fr);

      * {
        grid-column: 1/2;
      }
    }
    .why-crypto {
      flex-direction: column;
    }
  }

</style>