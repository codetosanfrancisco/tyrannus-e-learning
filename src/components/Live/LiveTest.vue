<template>
<div class="live-test">
    <v-snackbar
      v-model="screenShareSnackbar"
      :top="true"
      :multi-line="true"
    >
     You can only have 1 screenshare tab.
      <v-btn
        text
        @click="screenShareSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="showEndSession" max-width="290">
        <v-card>
            <v-card-title class="headline">Are you sure you want to end the session?</v-card-title>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="this.endSession">Yes</v-btn>
            <v-btn color="green darken-1" text @click="this.hideEndSessionModal">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="library" fullscreen hide-overlay transition="dialog-bottom-transition" max-width="990">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="library = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Media Library</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="library = false">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-row>
                <v-col cols="6" style="display: flex; align-items: center; ">
                    <v-file-input label="File input" accept=".pptx,.ppt,.mp4" @change="onUploadMedia"></v-file-input>
                </v-col>
                <v-col cols="2" style="display: flex; align-items: center; ">
                    <v-btn @click="submitMedia" >Submit</v-btn>
                </v-col>
            </v-row>
            <v-row style="padding: 20px; ">
                <v-data-table
                    :headers="headers"
                    :items="files"
                    class="elevation-1"
                    style="width: 100%; "
                >
                    <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>My Files</v-toolbar-title>
                        <v-divider
                        class="mx-4"
                        inset
                        vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="addFile(item.index)"
                    >
                        launch
                    </v-icon>
                    <v-icon
                        small
                        @click="deleteFile(item.index)"
                    >
                        mdi-delete
                    </v-icon>
                    </template>
                    <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="messageDrawer"
      absolute
      width="25%"
      :right="true"
      :hide-overlay="true"
      style="z-index: 1000; "
    >
        <div style="display: flex; flex-direction: column; height: 100%; ">
            <div>
            <div style="padding: 0 10px; display: flex; justify-content: space-between; align-items: center; width: 100%; ">
                <div>Chat</div>
                <div>
                    <v-btn class="ma-2" tile small color="black" icon @click="messageDrawer = false; ">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>

        <v-divider></v-divider>
        
        <div class="chatbox">
            <div id="chatbox" class="chatbox__message">
                <div v-for="message in messages" v-bind:key="message" v-bind:class="{ 'message': true,  'message--right': message.name == name}" >
                    <div class="message__content">{{ message.body }}</div>
                    <div class="message__details">
                        <div class="message__sender">{{ message.name == name ? 'me' :  message.name }}</div>
                        <div class="message__time">{{ new Date(message.timeCreated).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}</div>
                    </div>
                </div>
            </div>
            <div class="chatbox__input">
                <div class="chatbox__textbox">
                    <textarea v-model="message"  placeholder="Type your message here" class="chatbox__mou"></textarea>
                </div>
                <div class="chatbox__icon">
                    <v-btn tile color="white" icon @click="sendMessage">
                        <v-icon>send</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>

        </div>
    </v-navigation-drawer>
    <div class="live-navbar" style="height: 80px; ">
        <div v-if="isLecturer" style="height: 100%; ">
            <v-row style="height: 100%; "> 
                <v-col cols="10" style="display: flex; align-items: center; ">
                    <div class="pl-3" style="display: flex; align-items: center; "><div class="mr-5" style="display: flex; justify-content: center; align-items: center; "> <v-img src="@/assets/images/icon.png" max-width="40" style="margin: 10px; "/><span style="font-weight: 800; ">Tyrannus Online Seminary</span></div><span style="font-weight: 800; ">Lecturer Portal</span> <span class="mx-3">Course: <span  style="font-weight: 800; ">{{ sessionTitle }}</span> </span> Lecturer: <span style="font-weight: 800; ">{{ name }}</span></div>
                </v-col>
                <v-col cols="2" style="display: flex; justify-content: flex-end; ">
                    <div style="display: flex; align-items: center; ">
                        <v-btn class="ma-2" outlined color="white" @click="handleRecording"> 
                            {{ this.recording ? "Stop Recording" : "Record" }}
                        </v-btn>
                        <v-btn class="ma-2" tile small color="white" icon @click="openChat">
                            <v-icon>message</v-icon>
                        </v-btn>
                        <v-menu
                        transition="slide-y-transition"
                        offset-y
                        >
                        <template v-slot:activator="{ on }">
                            <v-btn class="ma-2" tile small color="white" icon v-on="on">
                                <v-icon>add_circle_outline</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                            @click="addScreenShare"
                            >
                            <v-list-item-title>Screen Share</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                            @click="addWhiteBoard"
                            >
                            <v-list-item-title>Whiteboard</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                            @click="library = !library"
                            >
                            <v-list-item-title>File/Video</v-list-item-title>
                            </v-list-item>

                             <v-list-item
                            @click="addYoutube"
                            >
                            <v-list-item-title>Youtube</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                            @click="addEditor"
                            >
                            <v-list-item-title>Text Editor</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>

                        <v-menu
                        transition="slide-y-transition"
                        offset-y
                        >
                        <template v-slot:activator="{ on }">
                            <v-btn class="ma-2" tile small color="white" icon v-on="on">
                                <v-icon>settings</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                            @click="goToAllClass"
                            >
                                <v-list-item-title>All Class</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                            v-on:click="this.showEndSessionModal"
                            >
                                <v-list-item-title>Exit Class</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div v-else style="height: 80px; ">
            <v-row>
                <v-col cols="11" style="display: flex; align-items: center; ">
                    <div class="pl-3"><span class="mx-2">Tyrannus Online Seminary</span> Student Portal <span class="mx-3" style="font-weight: 600; ">Course: {{ sessionTitle }}</span> Student: {{ name }}</div>
                </v-col>
                <v-col cols="1">
                    <v-btn class="ma-2" tile small color="white" icon @click="openChat">
                        <v-icon>message</v-icon>
                    </v-btn>
                     <v-menu
                        transition="slide-y-transition"
                        offset-y
                        >
                        <template v-slot:activator="{ on }">
                            <v-btn class="ma-2" tile small color="white" icon v-on="on">
                                <v-icon>settings</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                            @click="goToAllClass"
                            >
                                <v-list-item-title>All Class</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                            v-on:click="this.showEndSessionModal"
                            >
                                <v-list-item-title>Exit Class</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>
                </v-col>
            </v-row>
        </div>
    </div>
    <div class="live-con" style="height: calc(100vh - 80px) ">
        <div class="live-container" style="height: 100%; ">
        <div v-bind:class="{workspace: true }" style="display: flex; flex-direction: column; ">
            <div v-show="isLecturer" class="tabs" style="background-color: #212121; z-index: 100; position: relative; height: 50px; overflow-x: scroll; ">
                <div
                    style="display: flex; background-color: #212121; "
                >
                    <div v-for="(item, index) in workSpaceTabs" :key="index" class="tab" @click="changeTab(index)" style="display: flex; align-items: center;" v-bind:class="{ tab: true, 'tab-border': active_tab == index }">
                        <v-icon  @click="closeTab(index)" color="white">cancel</v-icon>    
                        <span style="color: white; " class="ml-2">{{ item.name }}</span>
                    </div>

                    <v-overlay
                        :absolute="true"
                        :value="isLecturer ? false : true"
                        color="transparent"
                    >
                    </v-overlay>
                </div>
            </div>
            <div class="screens">
                <div class="screen-container">
                    <div style="height: 100%; background-color: #212121; ">
                        <div
                            v-for="(item,index) in workSpaceTabs"
                            :key="item"
                            class="screen"
                            v-show="active_tab == index"
                        >
                            <v-overlay
                                :absolute="true"
                                :value="isLecturer || item.name == 'SCREENSHARE' ? false : true"
                                color="transparent"
                            >
                            </v-overlay>
                            <div v-if="item.name == 'SCREENSHARE'"  style="height: 100%; background-color: #212121; " class="screen-share">
                                <div class="screen-children" id="screen-preview" ></div>
                                 <div class="share-my-screen">
                                    <v-btn color="green darken-1" dark tile @click="initializeScreenSharing" v-if="!sharingMyScreen && isLecturer">Share my screen</v-btn>
                                    <v-btn color="green darken-1" dark tile v-if="!sharingMyScreen && !isLecturer">Waiting for Lecturer to share screen ..</v-btn>
                                    <v-btn class="mx-2 screen-sharing-control" fab dark large color="purple" v-if="sharingMyScreen && isLecturer" @click="stopScreenSharing" >
                                        <v-icon dark>stop_screen_share</v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2 screen-sharing-control" fab dark large color="purple" v-if="sharingMyScreen && !fullScreen" @click="handleFullScreen" >
                                        <v-icon dark>fullscreen</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <div class="screen-children whiteboard" v-if="item.name == 'DRAWING'" >
                                <div class="signature-pad">
                                    <drawing-board :id="`hello-${index}`" :role="role" :sessionId="getSessionId" :email="email" :index="index" :bigData="item.bigData"></drawing-board>
                                </div>
                            </div>
                            <div class="screen-children" id="screen-editor" v-if="item.name == 'TEXTEDITOR'"  :data-editor="index">
                                    <quill-editor v-model="item.textData" ref="myQuillEditor"
                                                    :options="editorOption">
                                    </quill-editor>
                            </div>
                            <div class="video-tab" v-if="item.name == 'VIDEO'" style="background-color: #212121" >
                                <div class="video-upload" :id="`video-upload-${index}`">
                                    <v-container style="height: 100%; flex-grow: 1; ">
                                            <video-player @canplay="onPlayerCanplay($event, index)"  @play="onPlayerPlayVideo(index)"
                                    @pause="onPlayerPauseVideo(index)" class="video-player-box" ref="videoPlayer" :options="item.option" >
                                        </video-player>
                                    </v-container>
                                </div>
                            </div>
                            <div class="video-tab" v-if="item.name == 'YOUTUBE'" style="background-color: #212121" >
                                <div class="video-upload" :id="`video-upload-${index}`">
                                    <v-container style="height: 100%; flex-grow: 1; display: flex; flex-direction: column; " class='youtube-text-field-container'>
                                        <v-row v-if="isLecturer" style="flex-grow: 0; " class="youtube-text-field">
                                            <v-col cols="6">
                                                <v-text-field
                                                dark
                                                v-model="item.youtubeUrl"
                                                label="Youtube Link"
                                                placeholder="Enter the youtube URL here"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-btn block @click="submitVideoLink(index)">Get Video</v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row style="flex-grow: 3; " class="px-2">
                                            <youtube style="width: 100%; height: 100%; " :video-id="item.youtubeId" :ref="`youtube-${index}`" @paused="pauseYoutube(index)" @playing="playYoutube(index)"></youtube>
                                        </v-row>
                                    </v-container>
                                </div>
                            </div>
                            <div class="file-viewer-tab" v-if="item.name == 'FILEVIEWER'" style="background-color: #212121" >
                                <!-- <carousel :items="1" :dots="false"> -->
                                <div style="height: 100%; padding: 5px; position: relative; " :class="`powerpoint-viewer-${index}`">
                                    <div style="position: absolute; top: 0; bottom: 0; right: 0; left: 0; z-index: 1000; background-color: rgba(255,255,255,0.4); display: none; " class="isLoading">
                                        <v-progress-circular
                                        :size="70"
                                        :width="7"
                                        color="#212121"
                                        indeterminate
                                        ></v-progress-circular>
                                        <div style="color: white; background-color: #212121; padding: 5px; margin: 20px; ">Loading screen's at student'side</div>
                                    </div>
                                    <div style="position: absolute; top: 0; bottom: 0; right: 0; left: 0; display: flex; align-items: center; justify-content: center; ">
                                        <div style="display: flex; justify-content: space-between; width: 100%; z-index: 5; " class="powerpoint-viewer">
                                            <v-btn class="mx-2 screen-sharing-control" fab dark large color="transparent" @click="prevSlide(item.currentPage, index)" v-if="isLecturer">
                                                <v-icon dark>keyboard_arrow_left</v-icon>
                                            </v-btn>
                                            <v-btn class="mx-2 screen-sharing-control" fab dark large color="transparent" @click="nextSlide(item.numPages, item.currentPage, index)" v-if="isLecturer" >
                                                <v-icon dark>keyboard_arrow_right</v-icon>
                                            </v-btn>
                                        </div>  
                                        <div style="position: absolute; bottom: 0; right: 1%; ">
                                            <v-btn class="mx-2 screen-sharing-control fullscreen-powerpoint" fab dark large color="transparent" @click="handlePowerPointFullScreen(index)" >
                                                <v-icon dark>fullscreen</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <div v-for="(image,i) in item.images" v-bind:key="image"  v-show="i == item.currentPage" style="height: 100%; " >
                                        <v-img :src="image" style="width: 80%; margin: auto; ">
                                            <template v-slot:placeholder>
                                                <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                                >
                                                <v-progress-circular indeterminate color="white"></v-progress-circular>
                                                </v-row>
                                            </template>
                                        </v-img>
                                    </div>

                                </div>
                                <!-- <div style="display: flex; justify-content: center; align-items: center; " v-if="isLecturer">
                                    <div class="mx-2">
                                        <v-btn @click="prevSlide(item.currentPage, index)">Prev</v-btn>
                                    </div>
                                    <div class="mx-2">
                                        <v-btn @click="nextSlide(item.numPages, item.currentPage, index)">Next</v-btn>
                                    </div>
                                </div> -->
                                <!-- </carousel> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="videos">
            <div class="lecturer-container">
                <div id="lecturer-0" class="lecturer">
                    <div class="zero-lecturer-label">{{ zerolecturer.name }}</div>
                </div>
            </div>
            <div class="students-container">
                <v-row no-gutters> 
                    <v-col cols="4" v-for="item in studentsRole" v-bind:key="item" :id="item.role" class="student">
                        <div class="video-label">
                            <div class="student-control-buttons">
                                <v-btn color="white" fab v-if="isLecturer && item.mute" @click="turnStudentOn(item.role)"><v-icon class="video-call" dark>mic_off</v-icon></v-btn>
                                <v-btn color="white" fab v-if="isLecturer && !item.mute" @click="turnStudentOff(item.role)"><v-icon class="video-call" dark>mic</v-icon></v-btn>
                                <div class="video-label-email" style="width: 100%; text-align: center;">{{ item.name }}</div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="videos-control-buttons">
                <div class="video-control-buttons-other">
                    <v-btn v-if="!see" v-on:click="publisher.publishVideo(false); see = true" class="control-button" color="black" dark ><v-icon class="video-call">videocam</v-icon></v-btn>
                    <v-btn v-if="see" v-on:click="publisher.publishVideo(true); see = false" class="control-button" color="black" dark ><v-icon class="video-call">videocam_off</v-icon></v-btn>
                    <v-btn v-if="!muted" class="control-button" color="black" dark  v-on:click="this.muteButton"><v-icon class="voice-call">mic</v-icon></v-btn>
                    <v-btn v-if="muted" class="control-button" color="black" dark  v-on:click="this.unmuteButton"><v-icon class="voice-call">mic_off</v-icon></v-btn>
                    <!-- <v-btn dark class="control-button"><v-icon class="full-screen">fullscreen</v-icon></v-btn> -->
                </div>
                <div class="video-control-buttons-end">
                    <v-btn color="error control-button" v-on:click="this.showEndSessionModal"><v-icon class="end-call">phone</v-icon></v-btn>
                </div>

               </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import 'videojs-youtube/dist/Youtube.min.js';
import { getSession } from "@/lib/Live/index";
import { initializeSession, checkScreenSharing, initializeScreenSharing } from "@/lib/opentok/index"
import { sendEditorText } from "@/lib/mongodb/video-session/editor/index"
import { sendNewTab, sendSwapTab, removeTab, getAllTabs } from "@/lib/mongodb/video-session/tab/index"
import io from 'socket.io-client';
import { quillEditor } from 'vue-quill-editor'
import $ from 'jquery';
import DrawingBoard from "./DrawingBoard.vue"
import myEmitter from './resources/events';
import { turnStudentOn, turnStudentOff } from "@/lib/mongodb/video-session/audio/index"
import { sendVideoEvent, sendVideoProgress, sendVideoLink, sendYoutubeEvent } from "@/lib/mongodb/video-session/video/index"
import { sendFileLink ,submitPdf, deleteFileLink } from "@/lib/mongodb/video-session/file/index"
import { nextSlide, prevSlide } from "@/lib/mongodb/powerpoint/index";
import { sendFullScreen } from "@/lib/mongodb/video-session/screenshare/index"
import { authStore } from "@/lib/vuex/store/index"
import { sendMessage, getMessages } from "@/lib/mongodb/messages/index"
import Vue from 'vue';

const VIDEO = 'VIDEO';
const FILEVIEWER = 'FILEVIEWER';
const SCREENSHARE = 'SCREENSHARE';
const DRAWING = 'DRAWING';
const TEXTEDITOR = 'TEXTEDITOR';
const YOUTUBE = 'YOUTUBE';



const tabOptions = new Map([
    [
        VIDEO, 
        {
            name: VIDEO,
            option: null,
            tabLimit: false,
            videoLink: ""
        }
    ],
    [
        SCREENSHARE,
        {
            name: SCREENSHARE,
            tabLimit: 1,
        }
    ],
    [
        DRAWING,
        {
            name: DRAWING,
            tabLimit: false,
        }
    ],
    [
        FILEVIEWER,
        {
            name: FILEVIEWER,
            tabLimit: false,
        }
    ],
    [
        TEXTEDITOR,
        {
            name: TEXTEDITOR,
            tabLimit: false
        }
    ],
    [
        YOUTUBE,
        {
            name: YOUTUBE,
            tabLimit: false,
            youtubeUrl: "",
            youtubeId: ''
        }
    ]
])

export default {
    name: "Live",
    components: {
        quillEditor,
        DrawingBoard,
    },
    beforeDestroy: function() {
        this.session.disconnect()
    },
    mounted : async function(){
        // Use the id of the session record to retrieve the real session id, and generate token
        try {
            const self = this;
            this.sessionId = this.$route.params.id;
            const { data: { token, sessionData: { lecturers, sessionId, title } }} = await getSession(this.sessionId);
            this.sessionTitle = title;
            this.email = authStore.state.session.email;
            this.name = authStore.state.session.name;
            this.role = authStore.state.session.role;
            this.zerolecturer = lecturers.filter(lecturer => lecturer.role == "lecturer-0")[0];
            const socket = await io.connect(`${process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}live`); 
            // Once connect, emit sessionId to join the matching room
            socket.on('connect', function() {
                socket.emit('room', self.sessionId);
                socket.on('message', function(data) {
                    window.console.log("Hello World");
                    window.console.log(data);
                    self.messages = data;
                    Vue.nextTick(function() {
                        $('#chatbox').scrollTop(1000000)
                    })
                })
            });

            const { data: { messages } } = await getMessages(this.sessionId);
            window.console.log("CHAT",messages);
            this.messages = messages;
            $('#chatbox').scrollTop(1000000);

             // Get All Existing tabs
            const { data: { session }} = await getAllTabs(this.sessionId);

            this.workSpaceTabs = session.tabs;
            this.files = session.files.map(function(file, i) {
                return {    
                    ...file,
                    index: i + 1,
                }
            });

            this.changeTab(session.currentTab);

            // Initialize Video Camera
            initializeSession(self, token, sessionId, function(publisher, session) {
                self.publisher = publisher;
                self.session = session;

                if(!self.isLecturer) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
            }, function showFullScreen() {
                self.sharingMyScreen = true;
            });
            
            socket.on('drawing', function(data) {
                myEmitter.emit('event', data)
            });

            socket.on('editortext', function(data) {
                if(self.email !== data.email) {
                    let objs = self.workSpaceTabs;
                    let obj = self.workSpaceTabs[data.index];
                    obj.textData = data.data;
                    objs[data.index] = obj;
                    self.workSpaceTabs = objs;
                }
            });
            socket.on('new-tab', function(data) {
                if(self.email !== data.email) {
                    self.workSpaceTabs = [
                        ...self.workSpaceTabs,
                        data
                    ]
                    self.active_tab = self.workSpaceTabs.length - 1

                    Vue.nextTick(function() {
                        if(!self.isLecturer) {
                            $('.ql-toolbar').each(function() {
                                $(this).hide();
                            })
                        }
                    })
                }
            })


            socket.on('remove-tab', function(data) {
                if(self.email !== data.email) {
                    self.workSpaceTabs = self.workSpaceTabs.filter((tab, index) => index != data.index)
                }
            })

            socket.on('tab-swap', function(data) {
                if(self.email !== data.email) {
                    self.active_tab = data.index;
                }
            })

            socket.on('turn-student-on', function(data) {
                if(data.role == self.role) {
                    self.publisher.publishAudio(true);
                    self.muted = false;
                }
            })

            socket.on('turn-student-off', function(data) {
                if(data.role == self.role) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
            })

            socket.on('video-link', function(data) {
                if(data.email !== self.email) {
                    let index = data.index;
                    let tabs = [ ...self.workSpaceTabs]
                    let tab = self.workSpaceTabs[index];
                    tab.youtubeId = data.videoLink;
                    tabs[index] = tab;
                    self.workSpaceTabs = tabs;
                    window.console.log(self.workSpaceTabs);
                }
            })

            socket.on('file-link', function(data) {
                if(data.email !== self.email) {
                   self.setNewTab(data.file)
                }
            })

            socket.on('fullscreen', function(data) {
                if(data.email !== self.email) {
                    self.sharingMyScreen = data.fullscreen
                }
            })

            socket.on('video-event', function(data) {
                if(data.email !== self.email) {
                    if(data.event == 'play') {
                        //self.$refs.videoPlayer.player.play()
                        $(`#video-upload-${data.index}`).find('.video-player-box').find('video').get()[0].play()
                    } else if(data.event == 'pause') {
                        //self.$refs.videoPlayer.player.pause()
                        $(`#video-upload-${data.index}`).find('.video-player-box').find('video').get()[0].pause()
                    }
                }
            })

            socket.on('youtube-event', function(data) {
                if(data.email !== self.email) {
                    if(data.event == 'play') {
                        //self.$refs.videoPlayer.player.play()
                        window.console.log(data);
                        window.console.log(self.$refs[`youtube-${data.index.index}`][0]);
                        self.$refs[`youtube-${data.index.index}`][0].player.seekTo(data.index.duration);
                        self.$refs[`youtube-${data.index.index}`][0].player.playVideo();
                        window.console.log(self.$refs);
                    } else if(data.event == 'pause') {
                        //self.$refs.videoPlayer.player.pause()
                        window.console.log(data);
                        window.console.log(self.$refs[`youtube-${data.index}`][0]);
                        self.$refs[`youtube-${data.index}`][0].player.pauseVideo();
                    }
                }
            })

            socket.on('video-progress', function(data) {
                window.console.log(data);
                if(data.email !== self.email) {
                    $(`#video-upload-${data.index}`).find('.video-player-box').find('video').get()[0].currentTime = data.progress;
                }
            })

            socket.on('powerpoint-next', function(data) {
                if(data.email !== self.email) {
                    const tab = self.workSpaceTabs[data.fileIndex];
                    tab.currentPage = tab.currentPage + 1;
                    const tabs = self.workSpaceTabs;
                    tabs[data.fileIndex] = tab;
                    self.workSpaceTabs = tabs;
                }
            })

            socket.on('powerpoint-prev', function(data) {
                if(data.email !== self.email) { 
                    const tab = self.workSpaceTabs[data.fileIndex];
                    tab.currentPage = tab.currentPage - 1;
                    const tabs = self.workSpaceTabs;
                    tabs[data.fileIndex] = tab;
                    self.workSpaceTabs = tabs;
                }
            })


            // Text Editor's event listener
            $(document).on('click', '.quill-editor', function(e) {
                if(!self.isLecturer) return
                const index = parseInt($(e.target).closest("#screen-editor").data("editor"))
                sendEditorText(self.workSpaceTabs[index].textData, index, self.sessionId, self.email)
            })

             $(document).on('keyup', '.quill-editor', function(e) {
                 if(!self.isLecturer) return
                 const index = parseInt($(e.target).closest("#screen-editor").data("editor"))
                sendEditorText(self.workSpaceTabs[index].textData, index, self.sessionId, self.email)
            })

            $(document).on('keydown', '.quill-editor', function(e) {
                 if(!self.isLecturer) return
                 const index = parseInt($(e.target).closest("#screen-editor").data("editor"))
                sendEditorText(self.workSpaceTabs[index].textData, index, self.sessionId, self.email)
            })

            document.addEventListener('fullscreenchange', self.exitHandler);
            document.addEventListener('webkitfullscreenchange', self.exitHandler);
            document.addEventListener('mozfullscreenchange', self.exitHandler);
            document.addEventListener('MSFullscreenChange', self.exitHandler);

            Vue.nextTick(function() {
                if(!self.isLecturer) {
                    $('.ql-toolbar').each(function() {
                        $(this).hide();
                    })
                    $('.whiteboard-toolbar').each(function() {
                        $(this).hide();
                    })
                }
            })
        }
        catch(e) {
            throw e;
        }
    },
    data: function() {
        return {
             headers: [
                { text: 'No.', value: 'index' },
                { text: 'Name', value: 'display_name'},
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            recorder: null,
            messages: [],
            message: '',
            messageDrawer: false,
            tabsData: [],
            screenShareSnackbar: false,
            fullScreen: false,
            times: 0,
            sessionTitle: "",
            currentPage: 0,
            publisher: null,
            muted: false,
            see: false,
            session: null,
            sessionId: '',
            socket: null,
            studentsRole: [],
            zerolecturer: null,
            showEndSession: false,
            library: false,
            active_tab: null,
            workSpaceTabs: [],
            recordingBlobs: [],
            files: [],
            sharingMyScreen: false,
            recording: false,
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction
                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean']                                         // remove formatting button
                    ]
                }
            },
            playerOptions: [],
            media: null
        }
    },
    methods: {
        mergeAudioStreams: function (desktopStream, voiceStream) {
            const context = new AudioContext();
            const destination = context.createMediaStreamDestination();
            let hasDesktop = false;
            let hasVoice = false;
            if (desktopStream && desktopStream.getAudioTracks().length > 0) {
            // If you don't want to share Audio from the desktop it should still work with just the voice.
            const source1 = context.createMediaStreamSource(desktopStream);
            const desktopGain = context.createGain();
            desktopGain.gain.value = 0.7;
            source1.connect(desktopGain).connect(destination);
            hasDesktop = true;
            }
            
            if (voiceStream && voiceStream.getAudioTracks().length > 0) {
            const source2 = context.createMediaStreamSource(voiceStream);
            const voiceGain = context.createGain();
            voiceGain.gain.value = 0.7;
            source2.connect(voiceGain).connect(destination);
            hasVoice = true;
            }
            
            return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
        },
        handleRecording: async function() {
            if(!this.recording) {
                if ('MediaRecorder' in window) {
                    try {
                        var desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: true });
                        var voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                        this.recording = true;

                        desktopStream.getVideoTracks()[0].onended = function() { // Click on browser UI stop sharing button
                            this.recording = false;
                            this.recorder.stop();
                        }.bind(this);

                        const tracks = [
                        ...desktopStream.getVideoTracks(), 
                        ...this.mergeAudioStreams(desktopStream, voiceStream)
                        ];
                        var stream = new MediaStream(tracks);
                        this.recorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp8,opus'});
                        this.recorder.addEventListener('stop', () => {
                            var recording = new Blob(this.recordingBlobs, {
                            type: 'video/webm; codecs=vp8,opus'
                            });
                            this.recordingBlobs = [];
                            this.recording = false;
                            var blobUrl = URL.createObjectURL(recording);
                            const anchor = document.createElement('a');
                            anchor.setAttribute('href', blobUrl);
                            const now = new Date();
                            anchor.innerHTML = '<span>Download</span>';
                            anchor.setAttribute(
                            'download',
                            `recording-${now.getFullYear()}-${(now.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}-${now
                                .getDay()
                                .toString()
                                .padStart(2, '0')}--${now
                                .getHours()
                                .toString()
                                .padStart(2, '0')}-${now
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}-${now
                                .getSeconds()
                                .toString()
                                .padStart(2, '0')}.webm`
                            );
                            anchor.id = 'download'
                            anchor.style.display = 'none';
                            document.body.appendChild(anchor);
                            $('#download span').click();
                            document.body.removeChild(anchor);
                        });
                        this.recorder.addEventListener('dataavailable', event => {
                            if (typeof event.data === 'undefined') return;
                            if (event.data.size === 0) return;
                            this.recordingBlobs = [...this.recordingBlobs, event.data];
                        });
                        this.recorder.start();
                        } catch {
                            this.recording = false;
                            alert(
                                'You denied access to the microphone so this demo will not work.'
                            );
                        }
                } 
                else 
                {
                    this.recording = false;
                    alert(
                        "Sorry, your browser doesn't support the MediaRecorder API, so this demo will not work."
                    );
                }
            } else {
                this.recorder.stop();
            }
        },
        sendMessage: async function() {
            await sendMessage(this.name, this.message , this.sessionId);
            this.message = ''
        },
        openChat: function() {
            this.messageDrawer = true;
        },
        submitVideoLink: async function (index) {
            var video = this.workSpaceTabs[index].youtubeUrl.split('v=')[1];
            window.console.log(video);
            await sendVideoLink(this.sessionId, this.email, video, index);

            // Set the video src
            var tabs = this.workSpaceTabs;
            var tab = this.workSpaceTabs[index];

            tab = {
                ...tab,
                youtubeId: video
            }

            tabs[index] = tab;

            this.workSpaceTabs = tabs;

            this.$forceUpdate();
        },
        playYoutube: async function(index) {
            if (!this.isLecturer ) return;
            const duration = await this.$refs[`youtube-${index}`][0].player.getCurrentTime();
            window.console.log(this.$refs, "duration", duration);
            await sendYoutubeEvent(this.sessionId, this.email, 'play', { index, duration } );
        },
        pauseYoutube: async function(index) {
            if (!this.isLecturer ) return;
             window.console.log(this.$refs);
            await sendYoutubeEvent(this.sessionId, this.email, 'pause', index);
        },
        exitHandler() {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                ///fire your event
                Vue.nextTick(function() {
                    $('.fullscreen-powerpoint').each(function() {
                    $(this).show()
                })
                })
            }
        } ,
        changeTab(index) {
            this.active_tab = index;
            this.handleTabChange(index);
        },
        closeTab: async function(i) {
            if(!this.isLecturer) return
            if(this.workSpaceTabs[i].name == SCREENSHARE) {
                await this.stopScreenSharing();
            }
            this.workSpaceTabs = this.workSpaceTabs.filter((tab,index) => {
                return index != i
            })
            await removeTab(this.sessionId, this.email, i);
            this.changeTab(this.workSpaceTabs.length - 1);
        },
        launchFullscreen(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                throw 'Fullscreen API is not supported.';
            }
        },
        handleFullScreen () {
            if(!this.fullScreen) {
                const html = document.getElementsByClassName('screen-share')[0]
                this.launchFullscreen(html);
                this.fullScreen = true;
            } else {
                this.exitFullscreen()
                this.fullScreen = false;
            }
        },
        handlePowerPointFullScreen(index) {
            if(!this.fullScreen) {
                const html = document.getElementsByClassName(`powerpoint-viewer-${index}`)[0]
                $(`.fullscreen-powerpoint`).hide()
                this.launchFullscreen(html);
                this.fullScreen = true;
            } else {
                this.exitFullscreen()
                this.fullScreen = false;
            }
        },
        goToAllClass: function() {
            let routeData = this.$router.resolve({name: 'Sessions' });
            window.open(routeData.href, '_blank');
        },
        prevSlide: async function(currentPage, fileIndex) {
            if(currentPage > 0) {
                $(`.powerpoint-viewer-${fileIndex}`).find('.isLoading').addClass('showLoading')
                await prevSlide(this.sessionId, this.email, fileIndex);
                currentPage = currentPage - 1;
                //update current page
                const tab = this.workSpaceTabs[fileIndex];
                tab.currentPage = currentPage;
                const tabs = this.workSpaceTabs;
                tabs[fileIndex] = tab;
                this.workSpaceTabs = tabs;
                $(`.powerpoint-viewer-${fileIndex}`).find('.isLoading').removeClass('showLoading')
            }
        },
        nextSlide: async function(total, currentPage, fileIndex) {
            if(currentPage < total) {
                $(`.powerpoint-viewer-${fileIndex}`).find('.isLoading').addClass('showLoading')
                await nextSlide(this.sessionId, this.email, fileIndex);
                currentPage = currentPage + 1;
                const tab = this.workSpaceTabs[fileIndex];
                tab.currentPage = currentPage;
                const tabs = this.workSpaceTabs;
                tabs[fileIndex] = tab;
                this.workSpaceTabs = tabs;
                $(`.powerpoint-viewer-${fileIndex}`).find('.isLoading').removeClass('showLoading')
                //update currentpage
            }
        },
        onUploadMedia: function(file) {
            this.media = file
        },
        submitMedia: async function() {
            var self = this;
            try {
                const formData = new FormData();
                self.files = [ ...self.files, { 'display_name': 'Loading...' } ]
                const fileExtension = this.media.name.split('.').pop();
                formData.append('pdf', this.media);
                formData.append('extension', fileExtension);
                const { data: { file } } = await submitPdf(this.sessionId, formData);
                const files = [ ...self.files ];
                files[self.files.length - 1] = file;
                self.files = files.map(function(file, index){
                    return {
                        ...file,
                        index: index + 1
                    }
                });      
            } catch(e) {
                self.files = self.files.filter(function(file) {
                    return file.display_name != 'Loading...';
                });
                alert("Error Uploading file.")
            }
                 
        },
        getTab: function(nameOfTab, option) {
            return {
                ...tabOptions.get(nameOfTab),
                ...option
            };
        },
        setNewTab: function(newTab) {
            this.workSpaceTabs = [
                ...this.workSpaceTabs,
                {
                    ...newTab
                }
            ]
        },
        addYoutube: async function() {
            if(!this.isLecturer) return
            const obj = this.getTab(YOUTUBE);
            this.setNewTab(obj);
            this.sendNewTab(obj)
            this.setActiveTab();
        },
        addScreenShare: function() {
            if(!this.isLecturer) return
            const numberOfScreenShare = this.workSpaceTabs.filter(tab => tab.name == SCREENSHARE).length
            if(checkScreenSharing()) {
                if(tabOptions.get(SCREENSHARE).tabLimit > numberOfScreenShare) {
                    const object = this.getTab(SCREENSHARE, {
                        sharingMyScreen: false
                    })
                    this.setNewTab(object);
                    this.setActiveTab();
                    this.sendNewTab(object);
                } else {
                    this.screenShareSnackbar = true;
                }
                
            } else {
                alert("Screen sharing is not supported in this browser.")
            }
        },
        addEditor: function() {
            if(!this.isLecturer) return
            const tab = this.getTab(TEXTEDITOR, {
                textData: ''
            })
            this.setNewTab(tab);
            this.sendNewTab(tab);
            this.setActiveTab();
        },
        addVideo: function(i) {
            const tab = this.getTab(VIDEO,{ display_name: this.files[i].display_name, option: {
                // videojs options
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    src: this.files[i].images
                }],
                // fullscreen: {
                //     options: {navigationUI: 'hide'}
                // },
                play: false,
                pause: false,
                progress: 0,
            }})
            this.setNewTab(tab)
            this.sendNewTab(tab);
            this.library = false;
            this.setActiveTab();
        },
        addWhiteBoard: function() {
            if(!this.isLecturer) return
            const tab = this.getTab(DRAWING, {
                bigData: ''
            })
            const self = this;
            this.setNewTab(tab);
            this.setActiveTab();
            this.sendNewTab(tab);
            if(!self.isLecturer) {
                $('.ql-toolbar').each(function() {
                    $(this).hide();
                })
                $('.whiteboard-toolbar').each(function() {
                    $(this).hide();
                })
            }
        },
        onPlayerCanplay: async function(player, index) {
            if(!this.isLecturer) return;
            window.console.log(player.currentTime())
            sendVideoProgress(this.sessionId, this.email, player.currentTime() , index)
        },
        onPlayerPlayVideo: async function(index) {
            if(!this.isLecturer) return;
            sendVideoEvent(this.sessionId, this.email, 'play', index)
        },
        onPlayerPauseVideo: async function(index) {
            if(!this.isLecturer) return;
            sendVideoEvent(this.sessionId, this.email, 'pause', index)
        },
        showEndSessionModal () {
            this.showEndSession = true;
        },
        hideEndSessionModal () {
            this.showEndSession = false;
        },
        endSession: async function() {
            let routeData = this.$router.resolve({name: 'Sessions' });
            window.location.href  = routeData.href
        },
        initializeScreenSharing: async function() {
            const self = this;
            const cb = () => {
                this.sharingMyScreen = true
            }
            if(!this.isLecturer) return
            if(checkScreenSharing()) {
                this.screenSharingPublisher = initializeScreenSharing(this.session, this.times, cb)
                this.times = this.times + 1;
                this.screenSharingPublisher.on('mediaStopped', async function() {
                    // The user clicked stop.
                    $(".screen-share").find("#screen-preview").remove()
                    await sendFullScreen(self.sessionId, false, self.email);
                    self.sharingMyScreen = false;
                });

                this.screenSharingPublisher.on('subscribe', function() {
                    window.console.log("Subscribed!")
                })
            } else {
                alert("Screen Sharing is not supported in this browser.")
            }
        },
        // Try stop screen sharing: Unpublish it, continue screen sharing: initialize again
        stopScreenSharing: async function() {
            if(!this.isLecturer) return
            this.session.unpublish(this.screenSharingPublisher);
            await sendFullScreen(this.sessionId, false, this.email);
            this.sharingMyScreen = false; 
            //this.screenSharingPublisher = this.screenSharingPublisher.publishVideo(false);
        },
        displayFile: async function(index) {
            try {
                this.addFile(index);
            }catch(e) {
                throw e;
            }
        },
        deleteFile: async function(i) {
            i--;
            window.console.log(this.workSpaceTabs);
            var isFileOpen = this.workSpaceTabs.filter(workSpaceTab => workSpaceTab.name == FILEVIEWER || workSpaceTab.name == VIDEO).filter(workSpaceTab => workSpaceTab.display_name == this.files[i].display_name).length > 0;
            if(isFileOpen) {
                alert("The file is still opened in tab! Close the tab to proceed.");
            } else {
                const { data } = await deleteFileLink(this.sessionId, i);
                window.console.log("DATA", data);
                this.files = data.files.map((file, index) => {
                    return {
                        ...file,
                        index: index + 1
                    }
                });
            }
        },
        addFile: async function(i) {
            i--;
            if(this.files[i].resource_type == 'powerpoint' || this.files[i].resource_type == 'others') {
                const tabs = this.getTab(FILEVIEWER, { ...this.files[i]});
                await sendFileLink(this.sessionId, this.email, i)
                this.setNewTab(tabs)
            } else if(this.files[i].resource_type == 'video') {
                this.addVideo(i)
            }
            this.library = false;
            this.setActiveTab();
        },
        setActiveTab: function() {
            if(!this.isLecturer) return
            this.changeTab(this.workSpaceTabs.length - 1);

        },
        sendNewTab: function(tabName) {
            if(!this.isLecturer) return
            sendNewTab(tabName, this.sessionId, this.email);
        },
        handleTabChange: function(i) {
            if(!this.isLecturer) return
            sendSwapTab(i, this.sessionId, this.email)
        },
        muteButton: function() {
            this.publisher.publishAudio(false); 
            this.muted = true
        },
        unmuteButton: function() {
            if(!this.isLecturer) return
            this.publisher.publishAudio(true); 
            this.muted = false;
        },
        addStudent: function(role, email, name) {
            this.studentsRole = [...this.studentsRole, { role, email, mute: true, name}]
        },
        removeStudent: function(role) {
            this.studentsRole = this.studentsRole.filter(student => student.role !== role);
        },
        turnStudentOn: function(role) {
            let studentNum = this.studentsRole.findIndex(student => student.role == role)
            let student = this.studentsRole[studentNum];
            student.mute = false;
            let students = this.studentsRole;
            students[studentNum] = student;
            this.studentsRole = students;
            turnStudentOn(role, this.sessionId);
        },
        turnStudentOff: function(role) {
            let studentNum = this.studentsRole.findIndex(student => student.role == role);
            let student = this.studentsRole[studentNum];
            student.mute = true;
            let students = this.studentsRole;
            students[studentNum] = student;
            this.studentsRole = students;
           turnStudentOff(role, this.sessionId);
        },
    },
    computed: {
        activeTabs: function() {
            return [this.workSpaceTabs[this.currentTab]]
        },
        getSessionId() {
            return this.sessionId
        },
        isLecturer() {
            return authStore.state.session.role.split("-")[0] == 'lecturer'
        },
        currentNumberOfSameTab: function(nameOfTab) {
            return this.workSpaceTabs.filter(tab => tab.name == nameOfTab).length
        }
    },
}
</script>

<style lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"

    .showLoading
        flex-direction: column
        display: flex !important
        align-items: center
        justify-content: center
</style>