<template>
    <transition name="fade">
      <div class="new-session">
          <modal name="hello-world" :height="700" :clickToClose="false">
            <div class="new-session-loader" v-if="showLoader">
              <div class="new-session-loader-con">
                <vue-loaders name="ball-pulse-rise" color="indigo" scale="0.5"></vue-loaders>
                <div>Scheduling session ...</div>
              </div>
            </div>
            <div v-if="showError" class="new-session-error">
              <v-icon x-large>error</v-icon>
              <div>
                {{ errorMessage }}
              </div>
              <div v-on:click="showError = !showError; showForm = !showForm; ">Go Back</div>
            </div>
            <div v-if="showSuccess" class="new-session-success">
              <v-icon x-large>check</v-icon>
              <div>Schedule successful! </div>
              <div>Session details</div>
              <div>Edit details </div>
              <small>The url to the meeting room will be sent to all participants before the session. </small>
              <v-btn text color="#2f3640" v-on:click="this.hide"> Close </v-btn>
            </div>
            <div class="new-session-form" v-if="showForm">
              <div class="new-session-form-title">Schedule a new session</div>
              <div class="new-session-form-body">
                  <v-form
                    ref="form"
                    v-model="valid"
                    :lazy-validation="lazy"
                  >
                    <v-text-field
                      :rules="nameRules"
                      label="Title"
                      required
                      v-model="title"
                    ></v-text-field>

                    <div>
                      <v-datetime-picker label="Start time" v-model="start"> 
                        <template slot="actions" slot-scope="{ parent }">
                          <v-btn tile color="error lighten-1" @click.native="parent.clearHandler">Cancel</v-btn>
                          <v-btn tile color="success darken-1" @click="parent.okHandler">Done</v-btn>
                        </template>
                      </v-datetime-picker>
                    </div>

                    <div>
                      <v-datetime-picker label="End time" v-model="end"> 
                        <template slot="actions" slot-scope="{ parent }">
                          <v-btn tile color="error lighten-1" @click.native="parent.clearHandler">Cancel</v-btn>
                          <v-btn tile color="success darken-1" @click="parent.okHandler">Done</v-btn>
                        </template>
                      </v-datetime-picker>
                    </div>

                    <v-select
                      v-model="mentors"
                      :items="mentorItems"
                      label="Mentors"
                      multiple
                    >
                    </v-select>

                    <v-select
                      v-model="participants"
                      :items="participantItems"
                      label="Participants"
                      multiple
                    >
                    </v-select>

                    <div>
                      <v-textarea
                      clearable
                      clear-icon="cancel"
                      label="Agenda"
                      rows="7"
                      v-model="agenda"
                    ></v-textarea>
                    </div>
                  </v-form>
              </div>
              <div class="new-session-form-buttons">
                <v-btn class="ma-2" tile color="error" dark v-on:click="this.hide">Cancel</v-btn>
                <v-btn class="ma-2" tile color="success" dark v-on:click="this.createSession">Schedule Now</v-btn>
              </div>
            </div>
          </modal>
          <vue-scheduler @event-clicked="eventClicked" event-display="name" :events="events" :available-views="['month','week', 'day']" initial-view="week" :disable-dialog="true" :initial-date="selectedDate" :key="selectedDate"/>
          <v-btn
            v-show="!hidden"
            color="#2f3640"
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
    </transition>
</template>

<script>
import { mapState } from 'vuex'
import { createSession } from '@/lib/mongodb/session/index'

export default {
    name: "Dashboard",
    data() {
      return {
        events: [
          {
            date: new Date(),
            startTime: "13:00",
            endTime: "15:00",
            name: "Date with David",
            comments: "MUST bring chocolate.",
            customAttribute: "I'm a custom attribute"
          },
          {
            date: new Date() - 1,
            startTime: "13:00",
            endTime: "15:00",
            name: "Date with David",
            comments: "MUST bring chocolate.",
            customAttribute: "I'm a custom attribute",
          }
        ],
        hidden: false,
        selectedDate: new Date(),
        agenda: "The agenda of this session is ...",
        showLoader: false,
        showForm: true,
        showError: false,
        showSuccess: false,
        errorMessage: "You have another session booking overlapped.",
        start: null,
        end: null,
        mentorItems: ["voonshunzhi@gmail.com"],
        participantItems: ["jared@gmail.com"],
        mentors: [],
        participants: [],
        title: ""
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
      eventClicked() {
        alert("Very Very Very")
      },
      createSession() {
        this.showSuccess = !this.showSuccess; 
        this.showForm = !this.showForm; 

        try {
          createSession({
            agenda: this.agenda,
            start: this.start,
            end: this.end,
            mentors: [this.mentors],
            participants: [this.participants]
          })
        }
        catch(e) {
          alert(e);
        }
      }
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

  .new-session-form 
    padding: 20px

  .new-session-form-title
    padding: 20px

  .new-session-form-body 
    padding: 0 20px

  .new-session-form-buttons
    display: flex
    justify-content: flex-end
    padding: 20px 20px

  .new-session-loader-con
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column

  .new-session-loader
    height: 100%
    display: flex
    justify-content: center
    align-items: center
</style>