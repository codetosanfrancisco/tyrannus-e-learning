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

export default {
  name: 'HelloWorld',
  data: function(){
    return {
      subdomain: ""
    }
  },
  mounted () {
    window.console.log(initializeSession)
  },
  props: ['button'],
  created: function(){
    var full = window.location.host
    this.subdomain = full.split('.')[0]
  },
  methods: {
    requestToken: () => {
      requestToken()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import "../assets/HelloWorld.scss"
</style>
