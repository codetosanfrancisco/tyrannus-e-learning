<template>
    <div class="main-content">
        <div class="main-content-menu">
            <div v-on:click="create">All User</div>
            <div v-on:click="create">Add New User</div>
        </div>
        <div class="main-content-body">
            <TopBar/>
            <router-view />
        </div>
    </div>
</template>

<script>
import TopBar from "@/components/TopBar/TopBar"

export default {
    name: "DashboardRoot",
    components: {
        TopBar
    },
    data() {
        return {
            calendarData: {},
            calendarConfigs: {
                sundayStart: true,
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: true,
                isDateRange: false,
                isDark: false
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