<template>
    <div class="main-container">
      <SideBar key="this.$route.name"/>
      <router-view/>
    </div>
</template>

<script>
import { getAllSessions} from "@/lib/mongodb/session/index"
import SideBar from "@/components/SideBar/SideBar";

export default {
    name: "Standard",
    components: {
        SideBar
    },
    data: function() {
        return {
            sessions:[],
            menu: [
                   
                ]
        }
    },
    mounted: async function() {
        try {
            const { data: sessions } = await getAllSessions()
            this.sessions = sessions;
        }
        catch(err){
            alert(err)
        }

    },
    methods: {
        // onToggleCollapse(collapsed) {},
        // onItemClick(event, item) {}
    }
}
</script>

<style>
    .main-container {
      background-color: #2f3640;
      padding-left: 70px;
      height: 100%;
    }

    .main-content {
      display: flex;
      flex-direction: row;
      height: 100%;
    }

    .main-content-menu {
      flex-grow: 0.5;
      height: 100%;
      background-color: #f1f2f6;
    }

    .main-content-body {
      flex-grow: 3;
      height: 100%;
      background-color: #ffffff;
      padding: 0px 20px;
    }
</style>