<template>
    <div>
        <button v-on:click="this.goToCreateSession">Create a session</button>
        <button v-on:click="this.logOut">Log Out</button>
    </div>
</template>

<script>
import {logOutUser} from "@/assets/mongodb/index"
import { authStore } from "@/assets/vuex/store/index"

export default {
    name: "Dashboard",
    methods: {
        logOut: async function(){
            try {
                await logOutUser()
                authStore.commit('logOut')
                this.$router.push("/user/login")
            }
            catch(err) {
                alert(err);
            }
        },
        goToCreateSession: function() {
            this.$router.push("/session/new")
        }
    }
}
</script>

<style scoped>

</style>