<template>
<div>
    <div class="video-sidebar"></div>
    <div class="live-container">
        <div class="videos">
            <div id="mentees">
                <swiper :options="swiperOption">
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                    <swiper-slide><div id="mentee"></div></swiper-slide>
                </swiper>
            </div>
            <div class="lower-container">
                <div class="mentor-container">
                    <div id="mentor"></div>
                    <div class="videos-control-buttons">
                        <div class="video-control-buttons-other">
                            <v-btn v-if="!see" v-on:click="publisher.publishVideo(false); see = true" dark class="control-button"><v-icon class="video-call">videocam</v-icon></v-btn>
                            <v-btn v-if="see" v-on:click="publisher.publishVideo(true); see = false" dark class="control-button"><v-icon class="video-call">videocam_off</v-icon></v-btn>
                            <v-btn v-if="!muted" dark class="control-button" v-on:click="publisher.publishAudio(false); muted = true"><v-icon class="voice-call">mic</v-icon></v-btn>
                            <v-btn v-if="muted" dark class="control-button" v-on:click="publisher.publishAudio(true); muted = false"><v-icon class="voice-call">mic_off</v-icon></v-btn>
                            <!-- <v-btn dark class="control-button"><v-icon class="full-screen">fullscreen</v-icon></v-btn> -->
                        </div>
                        <div class="video-control-buttons-end">
                            <v-btn color="error control-button" v-on:click="session.unpublish(publisher)"><v-icon class="end-call">phone</v-icon></v-btn>
                        </div>
                    </div>
                </div>
                <div class="chat-container">
                    <div class="chat"></div>
                    <div class="input-container">
                        <div class="input-div"><input class="input"/></div>
                        <div class="send-div"><v-btn fab dark small><v-icon small>send</v-icon></v-btn></div>
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</div>
</template>

<script>
import { getSession } from "@/lib/Live/index";
import { initializeSession } from "@/lib/opentok/index"
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'




export default {
    name: "Live",
    components: {
        swiper,
        swiperSlide
    },
    created: async function(){
        // Use the id of the session record to retrieve the real session id, and generate token
        try {
            const data = await getSession(this.$route.params.id);
            window.console.log(data.data);
            const {session, publisher } = initializeSession(data.data.sessionId, data.data.token, data.data.role)
            this.publisher = publisher;
            this.session = session;
        }
        catch(e) {
            alert(e);
        }
    },
    data: function() {
        return {
            swiperOption: {
                slidesPerView: 6,
                centeredSlides: false,
                spaceBetween: 20,
                grabCursor: true,
            },
            publisher: null,
            muted: false,
            see: false,
            session: null
        }
    }
}
</script>

<style scoped>
    .video-sidebar {
        position: fixed;
        height: 100%;
        width: 70px;
        background-color: #2f3640;
        z-index: 100;
    }

    #mentor {
        width: 100%;
        height: 102%;
        border-radius: 10px;
        overflow: hidden;
    }

    #mentees {
        width: 100%;
        overflow: scroll;
        height: 20%;
    }

    .videos-control-buttons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px 20px;
        z-index: 10;
    }

    .video-control-buttons-other {
        flex-grow: 2
    }

    .video-control-buttons-end {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
    }

    .end-call {
        transform: rotate(135deg)
    }

    .control-button {
        margin: 5px;
    }

    .live-container {
        height: 100vh;
        background-color: #f1f2f6;
        padding: 10px;
        padding-left: 80px;
    }

    #mentee {
        background-color: #a4b0be;
        width: 200px;
        height: 95%;
        margin: 5px;
        border-radius: 10px;
        overflow: hidden;
    }

    .lower-container {
        display: flex;
        height: 80%
    }

    .mentor-container {
        position: relative;
        background-color: #f1f2f6;
        padding: 10px;
        margin-bottom: 10px;
        width: 70%;
        border-radius: 10px;
    }

    .chat-container {
        flex-grow: 1;
        background-color: #a4b0be;
        border-radius: 10px;
        margin: 10px;
    }

    .videos {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .swiper-container {
        height: 100%;
    }

    .swiper-slide {
        margin-right: 0 !important;
    }

    .chat {
        width: 100%;
        height: 90%;
    }

    .input-container {
        width: 100%;
        height: 10%;
        background-color: #dfe4ea;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        display: flex;
    }

    .input {
        height: 55px;
        padding: 10px;
        width: 100%;
    }

    .input-div {
        width: 85%;
        flex-grow: 5;
    }

    .send-div {
        flex-grow: 1;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>