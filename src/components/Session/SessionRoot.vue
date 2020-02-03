<template>
    <div class="main-content">
        <div class="main-content-menu">
            <div class="functional-calendar" style="width: 90%; margin: auto; padding: 20px 10px;">
                <!-- <functional-calendar v-model="calendarData"  :configs="calendarConfigs" :text="selectedDate"></functional-calendar> -->
            </div>       
            <div v-on:click="create">New Sessions</div>
            <div>All Sessions</div>
        </div>
        <div class="main-content-body">
            <TopBar/>
            <router-view />
        </div>
    </div>
</template>

<script>
import TopBar from "@/components/TopBar/TopBar"
// import { FunctionalCalendar } from 'vue-functional-calendar'

export default {
    name: "SessionRoot",
    components: {
        TopBar,
        // FunctionalCalendar
    },
    data() {
        return {
            calendarData: {
                
            },
            calendarConfigs: {
                sundayStart: true,
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: true,
                isDateRange: false,
                isDark: true,
            }
        }
    },
    methods: {
        create() {
            this.$router.push({ name: 'NewSession' })
        },
        lastSunday(d) {
            d = new Date(d);
            window.console.log(d);
            d.setDate(d.getDate() - d.getDay());
            return d;
        }
    },
    computed: {
        selectedDate: function(){
            this.$store.commit('SET_SELECTED_DATE', this.calendarData.selectedDate)
            return this.calendarData.selectedDate
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
    }
}
</script>

<style scoped>
</style>