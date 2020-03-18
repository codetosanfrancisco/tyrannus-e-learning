<template>
    <div style="height: 100%;">
        <div class="whiteboard-toolbar">
        <v-menu
        v-model="value"
        :disabled="disabled"
        :absolute="absolute"
        :open-on-hover="openOnHover"
        :close-on-click="closeOnClick"
        :close-on-content-click="closeOnContentClick"
        :offset-x="offsetX"
        :offset-y="offsetY"
      >
        <template v-slot:activator="{ on }">
        <div v-on:click="draw" v-on="on" class="toolbar-item"><i class="material-icons white-icon">color_lens</i></div>
        </template>
        <div class="toolbar-item-menu">
            <div v-for="(color,index) in colors" v-bind:key="color" class="item" v-on:click="setColor(index)">
                <div  v-bind:style='{ backgroundColor: color, width: "30px", height: "30px", borderRadius: "30px" }' class="item"></div>
            </div>
        </div>
      </v-menu>
      <v-menu
        v-model="value"
        :disabled="disabled"
        :absolute="absolute"
        :open-on-hover="openOnHover"
        :close-on-click="closeOnClick"
        :close-on-content-click="closeOnContentClick"
        :offset-x="offsetX"
        :offset-y="offsetY"
      >
        <template v-slot:activator="{ on }">
        <div v-on:click="activatePen" v-on="on" class="toolbar-item"><i class="material-icons white-icon">edit</i></div>
        </template>
        <div class="toolbar-item-menu">
            <div class="item" v-on:click="setPenSize(0)">
                <div class="item-outer-1 black-background"></div>
            </div>
            <div class="item" v-on:click="setPenSize(1)">
                <div class="item-outer-2 black-background"></div>
            </div>
            <div class="item" v-on:click="setPenSize(2)">
                <div class="item-outer-3 black-background"></div>
            </div>
        </div>
      </v-menu>
      <v-menu
        v-model="value"
        :disabled="disabled"
        :absolute="absolute"
        :open-on-hover="openOnHover"
        :close-on-click="closeOnClick"
        :close-on-content-click="closeOnContentClick"
        :offset-x="offsetX"
        :offset-y="offsetY"
      >
        <template v-slot:activator="{ on }">
            <div v-on:click="activateEraser" class="toolbar-item" v-on="on"><i class="material-icons white-icon eraser">crop_portrait</i></div>
        </template>
        <div class="toolbar-item-menu">
            <div class="item" v-on:click="setEraserSize(0)">
                <div class="item-outer-1 border"></div>
            </div>
            <div class="item" v-on:click="setEraserSize(1)">
                <div class="item-outer-2 border"></div>
            </div>
            <div class="item" v-on:click="setEraserSize(2)">
                <div class="item-outer-3 border"></div>
            </div>
        </div>
      </v-menu>
        <div class="toolbar-item"><i class="material-icons white-icon">text_fields</i></div>
        <div class="toolbar-item" v-on:click="clearCanvas()">Clear</div>
        </div>
        <!-- <canvas :id="id"></canvas>
        <div class="cursor" id="cursor"></div> -->
        <div :id="id" style="height: calc(100% - 40px);
    display: flex;
    align-items: center;"></div>
    </div>
</template>

<script>
import { sendDrawing } from "@/lib/mongodb/video-session/drawing/index"
import myEmitter from "./resources/events";
import Konva from "konva";

const isLecturer = (role) => {
    return role.split("-")[0] == 'lecturer'
}
  

class Draw {

    setMode(mode) {
        this.mode = mode;
    }

    setColor(color) {
        this.color = color;
    }

    setWidth(width) {
        this.width= width;
    }

    getLayer() {
        return this.layer;
    }

    getStage() {
        return this.stage;
    }

    setUpForText() {
        this.stage.on('dblclick', function() {
            //var mousePos = this.stage.getPointerPosition();
            alert("Hi")
        })
    }

    constructor(id, sessionId, role, email){
        this.sessionId = sessionId;
        this.role = role;
        this.isLecturer = false;
        this.mode = 'brush'
        this.color = '#a713f7';
        this.width = 6;
        this.email = email;
        var width = 1000;
        var height = 600;

      // first we need Konva core things: stage and layer
        this.stage = new Konva.Stage({
            container: id,
            width: width,
            height: height
        })

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        if(isLecturer(this.role)) {
            this.isLecturer = true;
            this.setUplecturerPrivilege();
            this.stage.container().style.cursor = 'crosshair';
        }
    }


    setUplecturerPrivilege() {
        var self = this;
        this.isPaint = false;
        this.lastLine;
        this.setUpForText();
        this.stage.on('mousedown touchstart', function() {
            self.isPaint = true;
            var pos = self.stage.getPointerPosition();
            self.lastLine = new Konva.Line({
                stroke: self.color,
                strokeWidth: self.width,
                globalCompositeOperation:
                self.mode == 'brush' ? 'source-over' : 'destination-out',
                points: [pos.x, pos.y]
            });
            self.layer.add(self.lastLine);
        });

        this.stage.on('mouseup touchend', function() {
            if(!self.isLecturer) return
            sendDrawing(self.stage.toJSON(),1, self.sessionId, self.email)
            self.isPaint = false;
        });

        // and core function - drawing
        this.stage.on('mousemove touchmove', function() {
            if(!self.isLecturer) return
            if (!self.isPaint) {
            return;
            }

            const pos = self.stage.getPointerPosition();
            var newPoints = self.lastLine.points().concat([pos.x, pos.y]);
            self.lastLine.points(newPoints);
            self.layer.batchDraw();
        });
    }

}

export default {
    name: 'drawing-board',
    props: ['id', 'datas', 'role', 'sessionId', 'email'],
    data: function () {
        return {
                colors: [
                    '#d4f713',
                    '#13f7ab',
                    '#13f3f7',
                    '#13c5f7',
                    '#138cf7',
                    '#1353f7',
                    '#2d13f7',
                    '#7513f7',
                    '#a713f7',
                    '#d413f7',
                    '#f713e0',
                    '#f71397',
                    '#f7135b',
                    '#f71313',
                    '#f76213',
                    '#f79413',
                    '#f7e013'
                ],
                penSizes: [3,6,9],
                eraserSize: [15,18,20],
                disabled: false,
                absolute: false,
                openOnHover: false,
                drawing: false,
                eraser: false,
                closeOnClick: true,
                closeOnContentClick: true,
                offsetX: false,
                offsetY: true,
            }
        },
    mounted() {
        this.draw = new Draw(this.id, this.sessionId, this.role, this.email);
         myEmitter.on('event', (data) => {
            window.console.log("Latata", data);
            if(data.email !== this.email) {
                window.console.log(data)
                window.console.log(Konva.Node.create(data.data, this.id));
            }
        })
    },
    methods: {
        setPenSize(index) {
            if(!this.isLecturer) return
            this.draw.setWidth(this.penSizes[index]);
        },
        activatePen() {
            if(!this.isLecturer) return
            this.draw.setMode("brush")
        },
        activateEraser() {
            if(!this.isLecturer) return
            this.draw.setMode("eraser")
        },
        setEraserSize(index) {
            if(!this.isLecturer) return
            this.draw.setWidth(this.eraserSize[index]);
        },
        setColor(index) {
            if(!this.isLecturer) return
            this.draw.setColor(this.colors[index]);
        },
        clearCanvas() {
            if(!this.isLecturer) return
            this.draw.getLayer().destroyChildren();
            this.draw.getLayer().batchDraw();
            sendDrawing(this.draw.getStage().toJSON(), 1, this.sessionId,this.email)
        }
    },
    computed: {
        isLecturer() {
            return isLecturer(this.role)
        }
    }
}
</script>

<style scoped>

</style>
