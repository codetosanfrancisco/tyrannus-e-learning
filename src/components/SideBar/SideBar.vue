<template>
    <div class="v-sidebar-menu">
        <div class="v-sidebar-menu-header"></div>
        <div class="v-sidebar-menu-items">
            <div class="v-sidebar-menu-item" v-for="item in menu" v-bind:key="item.icon" v-bind:id="item.pathName" v-on:click="navigateTo(item.pathName)">
                <v-icon color="#ffffff">{{ item.icon }}</v-icon>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
export default {
    name: "SideBar",
    data: function() {
        return {
            menu: [
               {
                   icon: "dashboard",
                   pathName: "Dashboard"
               },
               {
                   icon: "date_range",
                   pathName: "Sessions"
               },
               {
                   icon: "more_horiz",
                   pathName: "UserLogin"
               }
            ]
        }
    },
    mounted() {
    // place your code
        this.updateSideBar();
    },
    methods: {
        navigateTo: function(pathName) {
            this.$router.push({ name: pathName })
            this.updateSideBar(); 
        },
        updateSideBar: function() {
            $('.v-sidebar-menu-items').find(`#${this.$route.name}`).css('background-color', '#212121')
            $('.v-sidebar-menu-item').not(`#${this.$route.name}`).css('background-color', '#2f3640')  
        }
    },
    watch: {
        $route() {
             this.updateSideBar();
        }
    }
}
</script>

<style>
    .v-sidebar-menu {
        background-color: #2f3640;
        height: 100%;
        width: 70px !important;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
    }

    .v-sidebar-menu-items {
        flex-grow: 5;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .v-sidebar-menu-item {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .v-sidebar-menu-header {
        flex-grow: 1
    }
</style>