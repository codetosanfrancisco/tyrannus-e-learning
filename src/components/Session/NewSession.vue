<template>
    <div>
        <vue-scheduler :events="events" :available-views="['week', 'day']" initial-view="week" disable-dialog="true"/>
        <v-btn
                v-show="!hidden"
                color="pink"
                dark
                fixed
                bottom
                right
                fab
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
    </div>
</template>

<script>

export default {
    name: "Dashboard",
    data() {
      return {
        events: [],
        hidden: false
      }
    },
    methods: {
    eventDisplay: event => event.customAttribute
  }
}
</script>

<style lang='sass'>

</style>