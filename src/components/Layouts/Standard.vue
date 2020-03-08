<template>
    <div>
      <SideBar key="this.$route.name"/>
      <div style="padding-left: 256px; ">
          <div style="height: 100vh; ">
              <router-view/>
          </div>
      </div>
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
}
</script>

<style>
</style>