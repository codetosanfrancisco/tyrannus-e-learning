<template>
  <div>Nani</div>
</template>

<script>
import { getAllSessions} from "@/lib/mongodb/session/index"

export default {
    name: "AllSession",
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
</style>