<template>
    <div style="position: relative; " >

        <v-dialog
            v-model="remove"
            max-width="290"
            >
            <v-card>
                <v-card-title class="headline">Delete this class ?</v-card-title>

                <v-card-text>
                    Are you sure you want to delete the class? 
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    text
                    @click="remove = false"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="green darken-1"
                    text
                    @click="deleteClass"
                >
                    Yes, delete
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
         <v-data-table
            :headers="headers"
            :items="sessions"
            sort-by="title"
            class="elevation-1"
        >
            <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>My Class</v-toolbar-title>
                <v-divider
                class="mx-4"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn v-if="isAdmin || isLecturer" color="primary" dark class="mb-2" @click="navigateToNewClass">New Class</v-btn>
                </template>
                </v-dialog>
            </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="navigateTo(item.index)"
            >
                launch
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
                v-if="isAdmin || isLecturer"
            >
                mdi-delete
            </v-icon>
            </template>
            <template v-slot:no-data>
                <div>No class yet.</div>
            </template>
        </v-data-table>
    </div>
</template>

<script>
//import FixedHeader from 'vue-fixed-header'
import { getAllSessions, deleteSession  } from "@/lib/mongodb/session/index";
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
            //this.sessions = data;
            this.sessions = data.map((session, index) => {
                window.console.log("Inside the sesison", session.lecturers[0].name)
                return {
                    index: index + 1,
                    title: session.title ,
                    lecturer: session.lecturers[0],
                    date: session.date,
                    _id: session._id,
                    students: session.students
                }
            })
        } catch(e) {
            throw e;
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
            sessions: [],
            headers: [
                { text: 'No.', value: 'index' },
                { text: 'Course', value: 'title'},
                { text: 'Lecturer Name', value: 'lecturer.name'},
                { text: 'Date started', value: 'date'},
                { text: 'Action', value: 'action'}
            ],
            selected: 0,
            dialog: false,
            remove: false
        }
    },
    methods: {
        editItem(item) {
            window.console.log(item.index)
        },
        deleteClass: async function(){
            const id = this.sessions[this.selected]._id
            const { data } = await deleteSession(id);
            this.sessions = data.map((session, index) => {
                window.console.log("Inside the sesison", session.lecturers[0].name)
                return {
                    index: index + 1,
                    title: session.title ,
                    lecturer: session.lecturers[0],
                    date: session.date,
                    _id: session._id,
                    students: session.students
                }
            })
            this.remove = false
        },
        deleteItem: async function(item) {
            this.remove = true;
            this.selected = item.index - 1;
            
        },
        navigateToNewClass() {
            this.$router.push({ name: 'NewSession'} )
        },
        navigateTo(i) {
            window.console.log(this.sessions);
            const data = this.sessions[i - 1]
            window.console.log(data);
            var res;
            window.console.log(data)
            if(data.lecturer.email == authStore.state.user.email) {
                const obj = {
                    sessionId: this.sessions[i - 1]._id,
                    email: authStore.state.user.email,
                    role: data.lecturer.role,
                    name: authStore.state.user.name
                }
                window.console.log("OBJ", obj)
                authStore.commit('logInSession', obj);
            } else {
                res = data.students.filter(student => student.email == authStore.state.user.email)[0];
                window.console.log("RES",res)
                const obj = {
                    sessionId: this.sessions[i - 1]._id,
                    email: authStore.state.user.email,
                    role: res.role,
                    name: authStore.state.user.name
                }
                window.console.log("OBJ", obj)
                authStore.commit('logInSession', obj);
            }
            this.$router.push({ name: 'Live', params: {id: data._id }})
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
        },
    },
    computed: {
        isAdmin() {
            return authStore.state.user.role.includes('admin');
        },
        isLecturer() {
            return authStore.state.user.role.includes('lecturer');
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