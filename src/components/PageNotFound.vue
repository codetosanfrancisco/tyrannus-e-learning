<template>
    <div style="height: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; ">
        <div style="margin-bottom: 30px; ">
            <v-img src="@/assets/images/logo.png" max-width="300"></v-img>
        </div>
        <h1>Page not found!</h1>
        <div style="margin-top: 30px; ">
            <v-btn tile @click="goToHomePage">Go back to Home page!</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',
    methods: {
        goToHomePage() {
            this.$router.push({ name: 'UserLogin'})
        }
    }
}
</script>


<style lang="stylus" scoped>

</style>