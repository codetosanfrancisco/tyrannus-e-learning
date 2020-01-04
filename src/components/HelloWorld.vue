<template>
  <div>
    <h1>{{ subdomain }}</h1>
    <button id="hello" v-on:click="this.requestToken">{{ button }}</button>
    <button v-on:click="this.requestToken">Log In</button>
    <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
    </div>
  </div>
</template>

<script>
import { initializeSession, requestToken } from "@/assets/opentok/index"
import { checkDbExists } from "@/assets/mongodb/index"
var capitalize = require('capitalize')

export default {
  name: 'HelloWorld',
  data: function(){
    return {
      subdomain: "",
      button: "Pick Me up"
    }
  },
  created: async function(){
    var full = window.location.host
    this.subdomain = full.split('.')[0]
    try {
      await checkDbExists(capitalize(this.subdomain))
    }
    catch(err){
      //this.$router.push('/pagenotfound');
    }
  },
  methods: {
    requestToken: async () => {
      const { sessionId, token } =  (await requestToken()).data;
      initializeSession(sessionId, token)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import "../assets/HelloWorld.scss"
</style>
