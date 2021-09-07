<script lang="ts">
    import { Route } from "svelte-navigator";
    import Home from "./pages/Home.svelte";
    import Account from "./pages/Account.svelte";
    import Guides from "./pages/Guides.svelte";
    import Contact from "./pages/Contact.svelte";
    import Explore from "./pages/Explore.svelte";
    import Donations from "./pages/Donations.svelte";
    import Organization from "./pages/Organization.svelte";
    import Admin from "./pages/Admin.svelte";
    import NotFound from "./pages/404.svelte";
    import Swap from "./pages/Swap.svelte";
    import SwitchNetwork from "./pages/SwitchNetwork.svelte";
    import GetMetamask from "./pages/GetMetamask.svelte";
</script>

<Route path="/">
    <Home />
</Route>
<Route path="account/*">
    <Route path="donations">
        <Account selected={0} />
    </Route>
    <Route path="awards">
        <Account selected={1} />
    </Route>
    <Route path="/">
        <Account />
    </Route>
    <Route>
        <NotFound />
    </Route>
</Route>
<Route path="guides">
    <Guides />
</Route>
<Route path="contact-us">
    <Contact />
</Route>
<Route path="explore">
    <Explore />
</Route>
<Route path="switch-network">
    <SwitchNetwork />
</Route>
<Route path="get-metamask">
    <GetMetamask />
</Route>
<Route path="donations/*">
    <Route path="latest">
        <Donations selected={0} />
    </Route>
    <Route path="leaderboard">
        <Donations selected={1} />
    </Route>
    <Route path="/">
        <Donations />
    </Route>
    <Route>
        <NotFound />
    </Route>
</Route>
<Route path="swap/*">
    <Route path="currency">
        <Swap selected={0} />
    </Route>
    <Route path="layer">
        <Swap selected={1} />
    </Route>
    <Route path="/">
        <Swap />
    </Route>
    <Route>
        <NotFound />
    </Route>
</Route>
<Route path="organization/*">
    <Route path="create">
        <Organization selected={0} />
    </Route>
    <Route path="yield">
        <Organization selected={1} />
    </Route>
    <Route path="/">
        <Organization />
    </Route>
    <Route>
        <NotFound />
    </Route>
</Route>
<Route path="admin/*">
    <Route path="requests">
        <Admin selected={0} />
    </Route>
    <Route path="messages">
        <Admin selected={1} />
    </Route>
    <Route path="/">
        <Admin />
    </Route>
    <Route>
        <NotFound />
    </Route>
</Route>
<Route>
    <NotFound />
</Route>