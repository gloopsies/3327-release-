<script lang="ts">
    import Tabbed from "../components/atoms/Tabbed.svelte";
    import Latest from "../components/pages/Donations/Latest.svelte";
    import Leaderboard from "../components/pages/Donations/Leaderboard.svelte";

    export let selected: number = 0;

    const tabs = [
        {
            title: "Latest",
            component: Latest,
            click: () => {
                window.history.pushState(null, "Lateset donations", "/donations/latest");
                selected = 0;
            },
        },
        {
            title: "Monthly leaderboard",
            component: Leaderboard,
            click: () => {
                window.history.pushState(null, "Monthly leaderboard", "/donations/leaderboard");
                selected = 1;
            },
        },
    ];
</script>

<Tabbed fill {selected} {tabs} />