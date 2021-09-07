<script lang="ts">
    import Tabbed from "../components/atoms/Tabbed.svelte";
    import Requests from "../components/pages/Admin/Requests.svelte";
    import Messages from "../components/pages/Admin/Messages.svelte";

    export let selected: number = 0;

    const tabs = [
        {
            title: "Requests",
            component: Requests,
            click: () => {
                window.history.pushState(null, "Requests", "/admin/requests");
                selected = 0;
            },
        },
        {
            title: "Messages",
            component: Messages,
            click: () => {
                window.history.pushState(null, "Messages", "/admin/messages");
                selected = 1;
            },
        },
    ];
</script>

<Tabbed fill {selected} {tabs} />