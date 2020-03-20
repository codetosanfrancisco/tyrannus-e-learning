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
                    <v-file-input label="File input" accept=".ppx,.ppt,.mp4" @change="onUploadPdf"></v-file-input>
                </v-col>
                <v-col cols="2" style="display: flex; align-items: center; ">
                    <v-btn @click="submitPdf" >Submit</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="media-file" cols="4" v-for="(file,index) in files" v-bind:key="file" style="position: relative; margin: 20px; padding: 0; ">
                    <v-img :src="file.thumbnail_url" style="width:100%; height: 300px; margin-bottom: 20px; ">
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                            >
                            <v-progress-circular indeterminate color="white"></v-progress-circular>
                        </v-row>
                    </v-img>
                    <div class="media-file-overlay" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(0,0,0,0.5); ">
                        <div style="width: 40%; background-color: white; padding: 10px; ">{{ file.display_name }}</div>
                    </div>
                    <v-btn tile block @click="displayFile(index)">Open</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
    <div class="live-navbar" style="height: 80px; ">
        <div v-if="isLecturer" style="height: 100%; ">
            <v-row style="height: 100%; "> 
                <v-col cols="10" style="display: flex; align-items: center; ">
                    <div class="pl-3">Lecturer Portal - {{ sessionTitle }} - {{ email }}</div>
                </v-col>
                <v-col cols="2" style="display: flex; justify-content: flex-end; ">
                    <div style="display: flex; ">
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
                <v-col cols="8" style="display: flex; align-items: center; ">
                    <div class="pl-3">StudentPortal - {{ sessionTitle }} - {{ email }}</div>
                </v-col>
            </v-row>
        </div>
    </div>
    <div class="live-con" style="height: calc(100vh - 80px) ">
        <div class="live-container" style="height: 100%; ">
        <div v-bind:class="{workspace: true }" style="height: calc(100vh - 80px); display: flex; flex-direction: column; ">
            <!-- <v-overlay
                :absolute="true"
                :value="isLecturer ? false : true"
                color="transparent"
            >
            </v-overlay> -->
            <div class="tabs" style="background-color: #212121; z-index: 100; ">
                <div
                    style="display: flex; background-color: #212121; "
                >
                    <div v-for="(item, index) in workSpaceTabs" :key="index" class="tab" @click="changeTab(index)" style="display: flex; align-items: center; border-bottom: 3px solid white; ">
                        <v-icon  @click="closeTab(index)" color="white">cancel</v-icon>    
                        <span style="color: white; " class="mr-2">{{ item.name }}</span>
                    </div>
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
                            <div v-if="item.name == 'SCREENSHARE'"  style="height: 100%; background-color: #212121; " class="screen-share">
                                <div class="screen-children" id="screen-preview" ></div>
                                 <div class="share-my-screen">
                                    <v-btn color="green darken-1" dark tile @click="initializeScreenSharing" v-if="!sharingMyScreen && isLecturer">Share my screen</v-btn>
                                    <v-btn class="mx-2 screen-sharing-control" fab dark large color="purple" v-if="sharingMyScreen && isLecturer" @click="stopScreenSharing" >
                                        <v-icon dark>stop_screen_share</v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2 screen-sharing-control" fab dark large color="purple" v-if="sharingMyScreen && !fullScreen" @click="handleFullScreen" >
                                        <v-icon dark>fullscreen</v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2 screen-sharing-control" fab dark large color="purple" v-if="sharingMyScreen && fullScreen" @click="handleFullScreen" >
                                        <v-icon dark>fullscreen_exit</v-icon>
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
                                <div class="video-upload">
                                    <v-container style="height: 100%; flex-grow: 1; ">
                                            <video-player   @play="onPlayerPlayVideo($event)"
                                    @pause="onPlayerPauseVideo($event)" class="video-player-box" ref="videoPlayer" :options="item.option" >
                                        </video-player>
                                    </v-container>
                                </div>
                            </div>
                            <div class="file-viewer-tab" v-if="item.name == 'FILEVIEWER'" style="background-color: #212121" >
                                <!-- <carousel :items="1" :dots="false"> -->
                                <div style="height: 91%; padding: 50px; ">
                                    <div v-for="(image,i) in item.images" v-bind:key="image"  v-show="i == currentPage" style="height: 100%; " >
                                        <v-img :src="image" style="width: 65%; margin: auto; ">
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
                                <div style="display: flex; justify-content: center; align-items: center; " v-if="isLecturer">
                                    <div class="mx-2">
                                        <v-btn @click="prevSlide">Prev</v-btn>
                                    </div>
                                    <div class="mx-2">
                                        <v-btn @click="nextSlide">Next</v-btn>
                                    </div>
                                </div>
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
                    <div class="zero-lecturer-label">{{ zerolecturer.email }}</div>
                </div>
            </div>
            <div class="students-container">
                <div v-for="item in studentsRole" v-bind:key="item" :id="item.role" class="student">
                    <div class="video-label">
                        <div class="student-control-buttons">
                            <v-btn color="white" fab v-if="isLecturer && item.mute" @click="turnStudentOn(item.role)"><v-icon class="video-call" dark>mic_off</v-icon></v-btn>
                            <v-btn color="white" fab v-if="isLecturer && !item.mute" @click="turnStudentOff(item.role)"><v-icon class="video-call" dark>mic</v-icon></v-btn>
                            <div class="video-label-email">{{ item.email }}</div>
                        </div>
                    </div>
                </div>
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
import { sendVideoLink, sendVideoEvent } from "@/lib/mongodb/video-session/video/index"
import { sendFileLink, submitPdf } from "@/lib/mongodb/video-session/file/index"
import { nextSlide, prevSlide } from "@/lib/mongodb/powerpoint/index";
import { sendFullScreen } from "@/lib/mongodb/video-session/screenshare/index"
import { authStore } from "@/lib/vuex/store/index"

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
            this.role = authStore.state.session.role;
            window.console.log("this.role, this.email",this.role, this.email)
            this.zerolecturer = lecturers.filter(lecturer => lecturer.role == "lecturer-0")[0];
            const socket = await io.connect(`${process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}live`); 
            
            window.console.log("SOCKET", socket);
        

            // Once connect, emit sessionId to join the matching room
            socket.on('connect', function() {
                window.console.log(" ====== SOCKET ON CONNECT ====")
                socket.emit('room', self.sessionId);
            });

             // Get All Existing tabs
            const { data: { session }} = await getAllTabs(this.sessionId);

            this.workSpaceTabs = session.tabs;

            this.changeTab(session.currentTab);
            window.console.log("====EXISTING TABS====", session.tabs);

             

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
                window.console.log("Drawing",data)
                myEmitter.emit('event', data)
            });
            socket.on('editortext', function(data) {
                 window.console.log("Data outside if statement", data);
                if(self.email !== data.email) {
                    window.console.log("Data inside if statement", data);
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
                window.console.log(data)
                if(data.role == self.role) {
                    window.console.log(data)
                    self.publisher.publishAudio(true);
                    self.muted = false;
                }
            })

            socket.on('turn-student-off', function(data) {
                window.console.log(data)
                if(data.role == self.role) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
            })

            socket.on('video-link', function(data) {
                window.console.log(data)
                if(data.email !== self.email) {
                    self.playerOptions = [...self.playerOptions, {
                        // videojs options
                        language: 'en',
                        playbackRates: [0.7, 1.0, 1.5, 2.0],
                        sources: [{
                            type: "video/mp4",
                            src: data.videoLink
                        }],
                        fullscreen: {
                            options: {navigationUI: 'hide'}
                        }
                    }];
                    let length = self.playerOptions.length;
                    self.setNewTab(self.getTab(VIDEO), {
                        option: self.playerOptions[length - 1],
                    })
                }
            })

            socket.on('file-link', function(data) {
                window.console.log(data)
                if(data.email !== self.email) {
                    self.files = [
                        ...self.files,
                        data.file
                    ]
                    
                    let length = self.files.length;
                    window.console.log(length)
                    window.console.log(data)
                    self.addFile(length - 1);
                    
                }
            })

            socket.on('fullscreen', function(data) {
                window.console.log(data)
                if(data.email !== self.email) {
                    self.sharingMyScreen = data.fullscreen
                }
            })

            socket.on('video-event', function(data) {
                if(data.email !== self.email) {
                    if(data.event == 'play') {
                        //self.$refs.videoPlayer.player.play()
                        window.console.log($('.video-player-box').find('video').get()[0].play())
                    } else if(data.event == 'pause') {
                        //self.$refs.videoPlayer.player.pause()
                        window.console.log($('.video-player-box').find('video').get()[0].pause())
                    }
                }
            })

            socket.on('powerpoint-next', function(data) {
                if(data.email !== self.email) {
                    window.console.log(data);
                    if(self.currentPage < 20) {
                        self.currentPage = self.currentPage + 1;
                    }
                }
            })

            socket.on('powerpoint-prev', function(data) {
                if(data.email !== self.email) {
                    window.console.log(data);
                    if(self.currentPage > 0) {
                        self.currentPage = self.currentPage - 1;
                    }
                }
            })
            //this.messages = messageData.data.messages;

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
        }
        catch(e) {
            alert(e);
        }
    },
    data: function() {
        return {
            tabsData: [],
            screenShareSnackbar: false,
            fullScreen: false,
            times: 0,
            sessionTitle: "",
            numPages: 1,
            currentPage: 0,
            fullPage: true,
            publisher: null,
            muted: false,
            see: false,
            session: null,
            sessionId: '',
            message: '',
            socket: null,
            //messages: [],
            studentsRole: [],
            zerolecturer: null,
            showEndSession: false,
            library: false,
            active_tab: null,
            workSpaceTabs: [],
            files: [],
            sharingMyScreen: false,
            //Menu
            data: null,
            content: null,
            previousData: '',
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
            pdfFile: null
        }
    },
    methods: {
        changeTab(index) {
            this.active_tab = index;
            this.handleTabChange(index);
        },
        closeTab: async function(i) {
            window.console.log(i)
            if(this.workSpaceTabs[i].name == SCREENSHARE) {
                await this.stopScreenSharing();
            }
            await removeTab(this.sessionId, this.email, i);
            this.workSpaceTabs = this.workSpaceTabs.filter((tab,index) => {
                return index != i
            })
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
                window.console.log('Fullscreen API is not supported.');
            }
        },
        handleFullScreen () {
            if(!this.fullScreen) {
                const html = document.getElementsByClassName('screen-share')[0]
                window.console.log(document.getElementsByClassName('screen-share'))
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
        prevSlide: async function() {
            if(this.currentPage > 0) {
                await prevSlide(this.sessionId, this.email);
                this.currentPage = this.currentPage - 1;
            }
        },
        nextSlide: async function() {
            if(this.currentPage < 20) {
                await nextSlide(this.sessionId, this.email);
                this.currentPage = this.currentPage + 1;
            }
        },
        onUploadPdf: function(file) {
            this.pdfFile = file
        },
        submitPdf: async function() {
            var self = this;
            this.isLoading = true;
            const formData = new FormData();
            window.console.log(this.pdfFile)
            formData.append('pdf', this.pdfFile);
            const fileExtension = this.pdfFile.name.split('.').pop();
            formData.append('extension', fileExtension);
            window.console.log(this.pdfFile)
            const data = await submitPdf(this.sessionId, formData);
            var array = [];
            window.console.log("NANI___", data.data);
            if(data.data.file.pages > 0) {
                for(let i = 1; i <= data.data.file.pages; i++) {
                    array.push(`https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill,pg_${i}/v${data.data.file.version}/${data.data.file.public_id}.jpg`)
                }
                self.files = [
                    ...self.files,
                    {
                        thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill/v${data.data.file.version}/${data.data.file.public_id}.jpg`,
                        images: array,
                        resource_type: 'document',
                        display_name: data.data.file.original_filename
                    }
                ]
            } else if(data.data.file.resource_type == 'video') {
                self.files = [
                    ...self.files,
                    {
                        thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/video/upload/c_fill/v${data.data.file.version}/${data.data.file.public_id}.jpg`,
                        images: data.data.file.secure_url,
                        resource_type: 'video',
                        display_name: data.data.file.original_filename
                    }
                ]
            } 
            else {
                self.files = [
                    ...self.files,
                    {
                        thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill/v${data.data.file.version}/${data.data.file.public_id}.jpg`,
                        images: [data.data.file.secure_url],
                        resource_type: 'others',
                        display_name: data.data.file.original_filename
                    }
                ]
            }
            this.isLoading = false;
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
            this.setNewTab(this.getTab(YOUTUBE));
            this.sendNewTab(YOUTUBE)
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
            window.console.log(this.files[i].images)
            this.setNewTab(this.getTab(VIDEO,{ option: {
                // videojs options
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    src: this.files[i].images
                }],
                fullscreen: {
                    options: {navigationUI: 'hide'}
                }
            }}))
            this.library = false;
            this.setActiveTab();
        },
        addWhiteBoard: function() {
            if(!this.isLecturer) return
            const tab = this.getTab(DRAWING, {
                bigData: ''
            })
            this.setNewTab(tab);
            this.setActiveTab();
            this.sendNewTab(tab)
        },
        onPlayerPlayVideo: async function() {
            sendVideoEvent(this.sessionId, this.email, 'play')
        },
        onPlayerPauseVideo: async function() {
            sendVideoEvent(this.sessionId, this.email, 'pause')
        },
        displayVideo: async function(index) {
            window.console.log(this.playerOptions[index].sources[0].src);
            try {
                await sendVideoLink(this.playerOptions[index].sources[0].src,  this.sessionId, this.email)
                this.addVideo(index);
            }catch(e) {
                window.console.log(e)
            }
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
                    window.console.log("Nanu")
                    await sendFullScreen(self.sessionId, false, self.email);
                    self.sharingMyScreen = false;
                });

                this.screenSharingPublisher.on('subscribe', function() {
                    alert("Nani")
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
                await sendFileLink(this.sessionId, this.email, this.files[index])
                this.addFile(index);
            }catch(e) {
                window.console.log(e);
            }
        },
        addFile: function(i) {
            if(this.files[i].resource_type == 'document' || this.files[i].resource_type == 'others') {
                this.setNewTab(this.getTab(FILEVIEWER, this.files[i]))
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
        addStudent: function(role, email) {
            window.console.log("this.studentsRole", this.studentsRole)
            this.studentsRole = [...this.studentsRole, { role, email, mute: true}]
        },
        removeStudent: function(role) {
            this.studentsRole = this.studentsRole.filter(student => student.role !== role);
            window.console.log(role, this.studentsRole)
        },
        turnStudentOn: function(role) {
            let studentNum = this.studentsRole.findIndex(student => student.role == role)
            let student = this.studentsRole[studentNum];
            student.mute = false;
            let students = this.studentsRole;
            students[studentNum] = student;
            window.console.log(studentNum, students);
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
            window.console.log([this.workSpaceTabs[this.currentTab]])
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
</style>