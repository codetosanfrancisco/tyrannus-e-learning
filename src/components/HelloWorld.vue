<template>
  <div>
    <h1>{{ subdomain }}</h1>
    <button id="hello">{{ button }}</button>
    <div>{{ info }}</div>
    <vue-form :state="formstate" @submit.prevent="onSubmit">
 
    <validate tag="label">
      <span>Email</span>
      <input v-model="model.email" required name="email" />
 
      <field-messages name="email">
        <div>Success!</div>
        <div slot="required">Name is a required field</div>
      </field-messages>
    </validate>
 
    <validate tag="label">
      <span>PIN</span>
      <input v-model="model.password" name="pin" type="password" required />
 
      <field-messages name="pin">
        <div slot="required">Email is a required field</div>
        <div slot="pin">Email is not valid</div>
      </field-messages>
    </validate>
 
    <button type="submit">Submit</button>
  </vue-form>
  </div>
</template>

<script>
import "@/assets/HelloWorld"
const axios = require('axios');

export default {
  name: 'HelloWorld',
  data: function(){
    return {
      subdomain: "",
      formstate: {},
      model: {
        name: '',
        email: ''
      },
      info: ""
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  },
  props: ['button'],
  created: function(){
    var full = window.location.host
    this.subdomain = full.split('.')[0]
  },
  methods: {
    onSubmit: function () {
      if(this.formstate.$invalid) {
        // alert user and exit early
        alert("Form is invalid")
        return;
      }
      // otherwise submit form
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import "../assets/HelloWorld.scss"
</style>
