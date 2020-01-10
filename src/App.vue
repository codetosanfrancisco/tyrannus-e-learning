<template>
  <v-app>
    <component v-bind:is="layout" key="this.$router.view"></component>
  </v-app>
</template>

<script>
import BeforeAuth from "@/components/Layouts/BeforeAuth"
import AfterAuthStandard from "@/components/Layouts/AfterAuthStandard"

export default {
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  components: {
    'before-auth': BeforeAuth,
    'after-auth-standard': AfterAuthStandard
    // define as many layouts you want for the application
  },
  watch:{
    $route (){
        this.$store.commit('SET_LAYOUT', 'after-auth-standard')
    }
} 
}
</script>