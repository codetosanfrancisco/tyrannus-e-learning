<template>
     <SidebarMenu :menu="menu" @toggle-collapse="onToggleCollapse" collapsed="collapsed"/>
</template>

<script>
import SidebarMenu from "@/components/SideBar/components/SidebarMenu";
export default {
    name: "SideBar",
    props: {
        onToggleCollapse: { type: Function },
        collapsed: { type: Boolean }
    },
    components: {
        SidebarMenu
    },
    data: function() {
        return {
            sessions:[],
            menu: []
        }
    },
    methods: {
        // onToggleCollapse(collapsed) {},
        // onItemClick(event, item) {}
    }
}
</script>

<style scoped>
    .v-sidebar-menu {
        background-color: #2f3640
    }

    .v-sidebar-menu.vsm_collapsed {
        max-width: 80px !important;
    }

    .v-sidebar-menu.vsm_expanded {
        max-width: 300px !important;
    }
</style>