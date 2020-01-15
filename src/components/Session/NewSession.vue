<template>
    <div class="new-session">
        <modal name="hello-world"/>
        <vue-scheduler @week-changed="weekChanged" :events="events" :available-views="['week', 'day']" initial-view="week" :disable-dialog="true" :initial-date="selectedDate" :key="selectedDate"/>
        <v-btn
                v-show="!hidden"
                color="pink"
                dark
                fixed
                bottom
                right
                fab
                v-on:click="show"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "Dashboard",
    data() {
      return {
        events: [],
        hidden: false,
        selectedDate: new Date()
      }
    },
    methods: {
      eventDisplay: event => event.customAttribute,
      show () {
        this.$modal.show('hello-world');
      },
      hide () {
        this.$modal.hide('hello-world');
      },
    },
    created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_SELECTED_DATE') {
        window.console.log(`Updating to ${state.selectedDate}`);

        // Do whatever makes sense now
        if (state.selectedDate) {
          var arr = state.selectedDate.split('/');
          this.selectedDate = new Date(arr[2], arr[1] - 1, arr[0]);
        }
      }
    });
    },
    computed: mapState(['selectedDate']),
}
</script>

<style lang='sass'>
  .new-session 
    padding: 20px 0
  
</style>