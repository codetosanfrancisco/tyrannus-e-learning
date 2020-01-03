<template>
  <div>
    <h1>{{ subdomain }}</h1>
    <button id="hello" v-on:click="this.requestToken">{{ button }}</button>
    <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
    </div>
  </div>
</template>

<script>
import { initializeSession, requestToken } from "@/assets/opentok/index"
import { checkDbExists } from "@/assets/mongodb/index"

export default {
  name: 'HelloWorld',
  data: function(){
    return {
      subdomain: ""
    }
  },
  props: ['button'],
  created: async function(){
    var full = window.location.host
    this.subdomain = full.split('.')[0]
    const data = await checkDbExists(this.subdomain);
    window.console.log("db exist moy",data)
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
