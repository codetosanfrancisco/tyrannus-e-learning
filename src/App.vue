<template>
  <v-app>
    <component v-bind:is="layout" key="this.$router.view"></component>
  </v-app>
</template>

<script>
import Auth from "@/components/Layouts/Auth"
import Standard from "@/components/Layouts/Standard"

export default {
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  mounted() {
      this.$store.commit('SET_LAYOUT', this.$route.meta.layout)
  },
  components: {
    'auth': Auth,
    'standard': Standard
    // define as many layouts you want for the application
  },
  watch:{
    $route (){
        this.$store.commit('SET_LAYOUT', this.$route.meta.layout)
    }
} 
}
</script>