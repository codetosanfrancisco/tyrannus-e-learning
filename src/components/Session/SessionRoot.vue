<template>
    <div class="main-content">
        <div class="main-content-menu">
            <div class="functional-calendar" style="width: 90%; margin: auto; padding: 20px 10px;">
                <functional-calendar v-model="calendarData"  :configs="calendarConfigs"></functional-calendar>
            </div>       
            {{ calendarData.selectedDate }}     
            <button v-on:click="create">To Create</button>
        </div>
        <div class="main-content-body">
            <TopBar/>
            <router-view />
        </div>
    </div>
</template>

<script>
import TopBar from "@/components/TopBar/TopBar"
import { FunctionalCalendar } from 'vue-functional-calendar';

export default {
    name: "SessionRoot",
    components: {
        TopBar,
        FunctionalCalendar
    },
    data() {
        return {
            calendarData: {},
            calendarConfigs: {
                sundayStart: true,
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: true,
                isDateRange: false,
                isDark: true
            }
        }
    },
    methods: {
        create() {
            this.$router.push({ name: 'NewSession' })
        }
    }
}
</script>

<style scoped>
</style>