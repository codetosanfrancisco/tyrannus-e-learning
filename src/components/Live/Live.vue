<template>
    <div class="live-container">
        <div class="videos">
            <div id="mentees">
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
                <div id="mentee"></div>
            </div>
            <div class="lower-container">
                <div class="mentor-container">
                    <div id="mentor"></div>
                    <div class="videos-control-buttons">
                        <div class="video-control-buttons-other">
                            <v-btn dark class="control-button"><v-icon class="video-call">videocam</v-icon></v-btn>
                            <v-btn dark class="control-button"><v-icon class="voice-call">keyboard_voice</v-icon></v-btn>
                            <v-btn dark class="control-button"><v-icon class="full-screen">fullscreen</v-icon></v-btn>
                        </div>
                        <div class="video-control-buttons-end">
                            <v-btn color="error control-button"><v-icon class="end-call">phone</v-icon></v-btn>
                        </div>
                    </div>
                </div>
                <div class="chat-container"></div>
            </div>
           
        </div>
    </div>
</template>

<script>
import { getSession } from "@/lib/Live/index";
import { initializeSession } from "@/lib/opentok/index"

export default {
    name: "Live",
    created: async function(){
        // Use the id of the session record to retrieve the real session id, and generate token
        try {
            const data = await getSession(this.$route.params.id);
            window.console.log(data.data);
            initializeSession(data.data.sessionId, data.data.token, data.data.role)
        }
        catch(e) {
            alert(e);
        }
    }
}
</script>

<style scoped>
    #mentor {
        width: 100%;
        height: 102%;
        border-radius: 10px;
        overflow: hidden;
    }

    #mentees {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        align-items: center;
    }

    .videos-control-buttons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px 20px;
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
    }

    #mentee {
        background-color: #a4b0be;
        width: 200px;
        height: 80%;
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
    }

    .videos {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>