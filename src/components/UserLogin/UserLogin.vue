<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="email" label="Email">
        </v-text-field>
    </v-form>
</template>

<script>
export default {
    name: "UserLogin", 
    data: function() {
        return {
             valid: false
        }
    }
}
</script>

<style scoped>

</style>