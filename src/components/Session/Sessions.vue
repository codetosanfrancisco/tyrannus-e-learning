<template>
    <div style="position: relative; " >
        <div v-show="scrolled" class="navbar" style="padding: 20px; align-items: center; justify-content: flex-end; display: flex; position: absolute; left: 0; right: 0; z-index: 100; background-color: white; height: 60px; ">
            <v-row no-gutters style="flex-grow: 1; ">
                <v-col
                    :key="1"
                    :cols="11"
                >
                   <div style="font-size: 1.5em; font-weight: 200; ">Session</div>
                </v-col>
                <v-col
                    :key="1"
                    :cols="1"
                >
                   <v-btn text>View All</v-btn>
                </v-col>
            </v-row>
        </div>
        <div style="padding: 30px 40px; height: 95vh; overflow: scroll; " v-on:scroll.passive="handleScroll">
            <v-row no-gutters>
                <v-col
                    :key="1"
                    :cols="11"
                >
                   <div style="font-size: 1.5em; font-weight: 200; ">>All Class </div>
                </v-col>
                <v-col
                    :key="1"
                    :cols="1"
                >
                   <v-btn text>View All</v-btn>
                </v-col>
                <div v-if="sessions.length > 0" style="display: flex; padding: 20px 0; flex-wrap: wrap; justify-content: flex-start; flex-grow: 1; ">
                    <div v-for="(session, index) in sessions" v-bind:key="session" class="e-card" @click="navigateTo(index)">
                        <div class="e-card-image">
                            <div class="e-card-title">{{ session.title }} </div>
                        </div>
                        <div class="e-card-content"> 
                            <div>{{ new Date(session.date).getDate() + '/' + new Date(session.date).getMonth() + '/' + new Date(session.date).getFullYear() }}, {{ new Date(session.date).getHours() + ":" + new Date(session.date).getMinutes()}}</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div>No class yet.</div>
                </div>
            </v-row>
            
            <!-- <v-row no-gutters style="flex-grow: 1; ">
                <v-col
                    :key="1"
                    :cols="11"
                >
                   <div style="font-size: 1.5em; font-weight: 200; ">>Upcoming session </div>
                </v-col>
                <div style="display: flex; padding: 20px 0; flex-wrap: wrap; ">
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
            </div>
            </v-row> -->
            

            <!-- <v-row no-gutters style="flex-grow: 1; ">
                <v-col
                    :key="1"
                    :cols="11"
                >
                   <div style="font-size: 1.5em; font-weight: 200; ">>Previous session </div>
                </v-col>
                <div style="display: flex; padding: 20px 0; flex-wrap: wrap; ">
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div>
                </div>
                <div class="e-card">
                    <div class="e-card-image">
                        <div class="e-card-title">Introduction to Theology </div>
                    </div>
                    <div class="e-card-content"> 
                        <div>8 March 2020, 2pm</div>
                    </div
                    >
                    
                </div>
            </div>
            </v-row> -->
            
        </div>
    </div>
</template>

<script>
//import FixedHeader from 'vue-fixed-header'
import { getAllSessions } from "@/lib/mongodb/session/index";
import { authStore } from "@/lib/vuex/store/index"

export default {
    components: {
    },
    mounted: async function() {
        try {
            let { data } = await getAllSessions();
            if(!authStore.state.user.role.includes('admin')) {
                data = data.filter(session => {
                    const lArray = session.lecturers[0].email
                    const array = session.students.map(s => s.email ).concat(lArray)

                    window.console.log(session.lecturers[0]._id,session.students, array.includes(authStore.state.user.email))

                    return array.includes(authStore.state.user.email)
                })
            }
            this.sessions = data;
        } catch(e) {
            alert(e);
        }
    },
    created: function() {
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed: function() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    data() {
        return {
            scrolled: false,
            lastPosition: 0,
            sessions: []
        }
    },
    methods: {
        navigateTo(i) {
            const data = this.sessions[i]
            this.$router.push({ name: 'Waiting', params: {id: data._id }})
        },
        handleScroll(e) {
            window.console.log(this.scrolled, window.scrollY, e)
            if (this.lastPosition < e.target.scrollTop && e.target.scrollTop > 50) {
                this.scrolled = true;
            } 
            
            if (this.lastPosition > e.target.scrollTop) {
                this.scrolled = false;
            }
            
            this.lastPosition = e.target.scrollTop;
        }
    }
}
</script>

<style scoped>
    .e-card-image {
    height: 150px;
    background-image: url("https://i.picsum.photos/id/238/200/300.jpg")
}

.e-card {
    width: 200px;
    margin-right: 15px;
    border-radius: 5px;
}

.navbar {
    box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.75);
}
</style>