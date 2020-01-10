<template>
    <div class="all-sessions">
      <SideBar key="this.$route.name"/>
      <div class="all-sessions-left-view">
      </div>
      <div class="all-sessions-right-view">
          <router-view />
      </div>
    </div>
</template>

<script>
import { getAllSessions} from "@/assets/mongodb/session/index"
import SideBar from "@/components/SideBar/SideBar";

export default {
    name: "AfterAuthStandard",
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

<style scoped>
    .card {
      width: 200px;
      height: 200px;
      -webkit-box-shadow: 10px 10px 13px -5px #dcdde1;
      -moz-box-shadow: 10px 10px 13px -5px #dcdde1;
      box-shadow: 10px 10px 13px -5px #dcdde1;
      border-radius: 20px;
      border: 0.1px solid #dcdde1;
    }

    .appBar {
      box-shadow: none;
      background-color: #f5f6fa;
    }

    .all-sessions {
      display: flex;
      flex-direction: row;
      background-color: #2f3640;
    }

    .all-sessions-left-view {
      flex-grow: 1;
      height: 100vh;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      background-color: #f4faf8
    }

    .all-sessions-right-view {
      flex-grow: 4;
      height: 100vh;
      background-color: #ffffff;
    }
</style>