<script>
    import { Link } from "svelte-navigator";
</script>

<div class="wrapper">
    <a href={"#"}>
        <button class="nav-button"></button>
    </a>

    <div class="guide intro">
        <h1>Support Children Guide</h1>
    </div>

    <div class="content-table">
        <h2>Table of Contents</h2>

        <a href="#login">Logging In</a>
        <a href="#networks">Switching Networks</a>
        <a href="#swap">Swap</a>
        <a href="#donating">Donating</a>
        <a href="#account">Account</a>
        <a href="#creating-campaign">Creating Campaign</a>
        <a href="#contact">Contact</a>
    </div>

    <div class="guide" id="login">
        <h2>Logging In</h2>
        <p>
            MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain.
            It allows users to access their Ethereum wallet through a browser extension or mobile app,
            which can then be used to interact with decentralized applications.
            One of the key benefits of blockchain for the recipients of money is that they receive more money than they
            would have otherwise.
            <br>
            When the user is located on any page, he can see
            <Link to="/account">Account section</Link>
            on the left navigation bar.
            After redirecting to that page, user should Log In to MetaMask and thus complete the logging in phase.
            <br />
        </p>
        <img alt="Account Login" src="/images/guides/login/login_page.png">
        <p>
            <strong>Note: </strong>If you don"t have Metamask installed, please refer to <a
            href="https://metamask.io/download">this link</a>.
        </p>
    </div>

    <br>

    <div class="guide" id="networks">
        <h2>Switching Networks</h2>
        <p>Switching networks can be useful for using the option you think it"s best for smallest fees and security.
            It can be found clicking on the
            <Link to="/switch-network">Navigation Bar section</Link>
            or in the
            <Link to="/explore">Explore page</Link>
            where users can donate.
            We give you 4 available networks for donating using MetaMask:
        </p>
        <ul>
            <li><a href="https://ethereum.org/en/">Ethereum Mainnet</a> (ETH Layer 1 Solution)</li>
            <li><a href="https://polygon.technology">Polygon Network</a> (MATIC Layer 2 Solution)</li>
        </ul>
        <img alt="Network Switch" src="/images/guides/switch_networks/switch_networks.png">
        <p><strong>Layer 2</strong> refers to a series of different protocols that facilitate the creation of smart
            contracts and decentralized applications (dApps)
            on top of the core Ethereum blockchain. Through various means, smart contracts and transactions are largely
            executed outside of the
            Ethereum main chain. However, this is achieved whilst maintaining the full network security of the core
            Layer 1 chain.
            <br>
            <strong>Ethereum Bridge</strong> is responsible for holding the assets on a layer-1 blockchain while the
            same assets are released on another (and external) service.
            It defines who has custody of the funds and the conditions that must be satisfied before the assets can be
            unlocked.
            <br><br>
        </p>
        <h3>Polygon Network:</h3>
        <p>Technically, it is a side chain and not a layer 2. What’s the difference?
            Layer 2 solutions are defined by being fully secured by the Ethereum main chain while side chains use their
            consensus mechanisms.
            In Polygon’s case, it’s a PoS (Proof of Stake) consensus where validators can stake Matic tokens and run a
            full node.
            <br>
            To use Polygon, you have to swap ETH for the protocol"s native Matic token over a chain bridge.
            The chain bridge uses a lock and mint mechanism, so you deposit ETH into the chain bridge.
            Once it’s locked, Polygon then meets mints you an equal amount of Matic tokens when going through the chain
            bridge the other way Matic to ETH.
            So Matic tokens are burned, all destroyed, and then the ETH is released from the smart contract. So they all
            work kind of the same way.
            Depending on which chain bridge you use, transactions could take several hours to a week. For instance,
            using the plasma bridge which inherits.
            Its security from the Ethereum main chain these swaps take seven days.
        </p>
    </div>

    <br>

    <div class="guide" id="swap">
        <h2>Swap</h2>
        <p>
            With
            <Link to="/swap">swapping</Link>
            , you can exchange crypto in your MetaMask Wallet, transferring your money to different currencies. 
        </p>
        <img alt="Swap" src="/images/guides/swap/swap.png">
        <p>
            But also, you can transfer currency you want to different Layer using our bridge!
        </p>
        <img alt="Swap Bridge" src="/images/guides/swap/swap_bridge.png">
        <p>
            Transfering between ERC-20 token from Polygon network to Ethereum mainnet can take about 10 minutes to withdraw after you try to swap them.
            Be patient and check Swap page after around that time to click withdraw button which should transfer you funds directly to mainnet wallet.

        </p>
        <p>
            <strong>Note: </strong>Layer 2 solution bridge can take up time. Network is doing its job.
        </p>
    </div>

    <br>

    <div class="guide" id="donating">
        <h2>Donating</h2>
        <p>
            Going into
            <Link to="/explore">Explore section</Link>
            , a list of campaigns appears,
            with integrated Sort (By Expiring Date, Percent Rate, Goal and Raised Amount),
            Search Bar (searching trough both description and name) and filter.
            Filter consists of multiple parts:
        </p>
        <ul>
            <li>
                Categories
                <ul>
                    <li>Health</li>
                    <li>Education</li>
                    <li>Empowerment</li>
                    <li>Employment</li>
                    <li>Arts and Culture</li>
                    <li>Human and Civil Rights</li>
                    <li>Religion</li>
                </ul>
            </li>
            <li>End Date</li>
        </ul>
        <p>
            After finding desired campaign, you can select it, prompting a campaign card:
        </p>
        <img alt="Explore Card" src="/images/guides/explore/guide_explore_card.png">
        <p>
            Inputting desired amount should result in your wallet asking you to confirm your order, paying additionally
            for transaction fees, which
            are incredibly small and don"t make us profit in any sense.
        </p>
        <img alt="Explore Transaction" src="/images/guides/explore/guide_explore_transaction.png">
        <p>
            <strong>Note: </strong>After donation, you receive additional NFT reward which you can see in your Account
            page.
        </p>
    </div>

    <br>

    <div class="guide" id="account">
        <h2>Account</h2>
        <p>
            <Link to="/account">Account page</Link>
            can be located on the navigation bar, functioning as a page for personal information about transactions and
            rewards.
            Users can edit their name, e-mail and avatar picture.
            Awards are received trough donating to any campaign available as a NFT containing info about the donation.
        </p>
        <img alt="Account Page" src="/images/guides/account/account.png">
        <p>
            <strong>Note</strong>: User can ask a to make a campaign. More on that, consider looking into
            <a href="#creating-campaign">Creating Campaign</a> part of the guide here.
        </p>
    </div>

    <br>

    <div class="guide" id="creating-campaign">
        <h2>Creating Campaign</h2>
        <p>
            You can request to be a part of our charity community and create your own campaigns! It is simple,
            after going into Account section in our page, users should have message below which writes:
        </p>
        <img alt="Create Campaign Message" src="/images/guides/create_fundraiser/create_message.png">
        <p>
            After clicking, modal should pop up asking you the reason for your organization request and if you are
            accepted,
            you should have rights to create your own unique campaigns!
        </p>
        <img alt="Create Modal" src="/images/guides/create_fundraiser/create_modal.png">

        <br>
        <p>
            After successful admission,
            <Link to="/organization">Organization</Link>
            part of the navigation bar appears, where users can create their own campaigns, creating must have sections:
        </p>
        <ul>
            <li>Name (Name of the campaign)</li>
            <li>Beneficiary (Wallet address of recipient - can be found in your wallet)</li>
            <li>End Date (Expiration Date of the campaign)</li>
            <li>Goal (Desired amount of money needed for competition)</li>
            <li>Currency (Cryptocurrency in which goal is selected)</li>
            <li>Categories (Select one of the several categories to describe type of the charity)</li>
            <li>Description (Message about your goals and needs. Users donating will see this when they click on your
                campaign card in Explore page)
            </li>
            <li>Image (Select 1:1 image as a logo or representation of your campaign)</li>
        </ul>
        <img alt="Create Campaign" src="/images/guides/create_fundraiser/create_fundraiser.png">
        <p>
            <strong>Note: </strong> Images can have different aspect ratio, but may result in bad formatting when
            displaying cards on the Explore page.
        </p>
    </div>

    <br>

    <div class="guide" id="contact">
        <h2>Contact</h2>
        <p>
            For any questions about the functionalities or bugs in our website, you can locate
            <Link to="/organization">Contact Us</Link>
            section in the lower part of the navigation bar.
            You can select 4 types of message types:
        </p>
        <ul>
            <li>Question</li>
            <li>Complaint</li>
            <li>Advice</li>
            <li>Other</li>
        </ul>
        <img alt="Contact Section" src="/images/guides/contact/guide_contact.png">
        <p>After submitting your message, we will receive your report.</p>
    </div>
</div>

<style lang="scss">
  @use "../scss/index" as imports;

  .wrapper {
    width: 100%;
    max-width: 1200px;
    margin: auto;
  }

  .nav-button {
    @include imports.button-reset;
    z-index: 10001;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;

    height: 3.5rem;
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
      content: "";
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

  .content-table {
    display: grid;
    margin: 1.5rem 1.5rem;
    padding: 1.8rem 3rem;
    max-width: 500px;
    text-align: center;

    background-color: rgb(255, 255, 255);
    border-radius: imports.$border-radius;

    h2 {
      color: imports.$bg-color;
      font-size: 2rem;
      margin: .8rem 0;
    }

    a {
      text-align: left;
      color: black;
      font-size: 1.2rem;
    }
  }

  .guide {
    padding: 0.3rem;

    h1 {
      font-size: 3.2rem;
    }

    h2 {
      color: white;
      font-size: 2rem;
      margin: .5rem 0;
    }

    p {
      font-size: 1.2rem;
      line-height: 1.7rem;
      color: white;
    }

    img {
      display: block;
      margin: 20px auto;
      border: 4px solid white;
      max-width: 90%;
    }

    ul {
      padding: 1.2rem;

      li {
        font-size: 1.2rem;
      }
    }
  }
</style>