<template>
    <div>
        All Sessions
        {{ sessions }}
    </div>
</template>

<script>
import { getAllSessions} from "@/assets/mongodb/session/index"

export default {
    name: "AllSession",
    data: function() {
        return {
            sessions:[]
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

    }
}
</script>

<style scoped>

</style>