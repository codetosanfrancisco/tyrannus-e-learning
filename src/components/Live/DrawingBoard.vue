<template>
    <div>
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
            <div v-for="(color,index) in colors" v-bind:key="color" class="item">
                <div v-on:click="setColor(index)" v-bind:style='{ backgroundColor: color, width: "30px", height: "30px", borderRadius: "30px" }' class="item"></div>
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
        <div :id="id"></div>
    </div>
</template>

<script>
import { sendDrawing } from "@/lib/mongodb/video-session/drawing/index"
import myEmitter from "./events";
import Konva from "konva";

// class Draw {
//     constructor(c, app, cursor, email, sessionId){
//         this.c = c;
//         this.ctx = this.c.getContext('2d');
//         this.app = app;
//         this.cursor = cursor
//         this.email = email
//         this.sessionId = sessionId
        
//         this.mouseDown = false;
//         this.mouseX = 0;
//         this.mouseY = 0;
        
//         this.tempHistory = [];
        
//         this.setSize();
        
//         this.listen();
        
//         this.redraw();
//     }
    
//     listen(){
//         this.c.addEventListener('mousedown', (e)=>{
//             window.console.log("mousedown")
//             this.mouseDown = true;
//             this.mouseX = e.offsetX;
//             this.mouseY = e.offsetY;
//             this.setDummyPoint();
//         });
        
//         this.c.addEventListener('mouseup', ()=>{
//             if(this.mouseDown){
//                 this.setDummyPoint();
//                 sendDrawing(this.app.history, 1, this.sessionId,this.email)
//             }
//             this.mouseDown = false;
//         });
        
//         this.c.addEventListener('mouseleave', ()=>{
//             if(this.mouseDown){
//                 this.setDummyPoint();
//             }
//             this.mouseDown = false;
//         });
        
//         this.c.addEventListener('mousemove', (e)=>{
//             this.moveMouse(e);
            
//             if(this.mouseDown){
//                 this.mouseX = this.mouseX;
//                 this.mouseY = this.mouseY;
                
//                 if(!this.app.options.restrictX){
//                     this.mouseX = e.offsetX;
//                 }
                
//                 if(!this.app.options.restrictY){
//                     this.mouseY = e.offsetY;
//                 }
                                
//                 var item = {
//                     isDummy: false,
//                     x: this.mouseX,
//                     y: this.mouseY,
//                     c: this.app.color,
//                     r: this.app.size
//                 };
                
//                 this.app.history.push(item);
//                 this.draw(item, this.app.history.length);

//             }
//         });
        
//         window.addEventListener('resize', ()=>{
//             this.setSize();
//             this.redraw();
//         });
//     }
    
//     setSize(){
//         this.c.width = window.innerWidth;
//         this.c.height = window.innerHeight - 60;
//     }
    
//     moveMouse(e){
//         let x = e.offsetX;
//         let y = e.offsetY;
        
//         this.cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
//     }
    
//     getDummyItem(){
//         var lastPoint = this.app.history[this.app.history.length-1];
//         window.console.log("LastPoint", lastPoint)
        
//         return {
//             isDummy: true,
//             x: lastPoint.x,
//             y: lastPoint.y,
//             c: null,
//             r: null
//         };
//     }
    
//     setDummyPoint(){
//         var item = this.getDummyItem();
//         this.app.history.push(item);
//         this.draw(item, this.app.history.length);
//     }
    
//     redraw(){
//         this.ctx.clearRect(0, 0, this.c.width, this.c.height);
//         this.drawBgDots()

//         if(!this.app.history.length){
//             return true;
//         }
        
//         this.app.history.forEach((item, i)=>{
//             this.draw(item, i);
//         });
//     }
    
//     drawBgDots(){
//         var gridSize = 50;
//         this.ctx.fillStyle = 'rgba(0, 0, 0, .2)';
        
//         for(var i = 0; i*gridSize < this.c.width; i++){
//             for(var j = 0; j*gridSize < this.c.height; j++){
//                 if(i > 0 && j > 0){
//                     this.ctx.beginPath();
//                     this.ctx.rect(i * gridSize, j * gridSize, 2, 2);
//                     this.ctx.fill();
//                     this.ctx.closePath();
//                 }
//             }
//         }
//     }
    
//     draw(item, i){
//         this.ctx.lineCap = 'round';
//         this.ctx.lineJoin = "round";
        
//         var prevItem = this.app.history[i-2];
                
//         if(i < 2){
//             return false;
//         }

//         if(!item.isDummy && !this.app.history[i-1].isDummy && !prevItem.isDummy){
//             this.ctx.strokeStyle = item.c;
//             this.ctx.lineWidth = item.r;
//             this.ctx.beginPath();
//             this.ctx.moveTo(prevItem.x, prevItem.y);
//             this.ctx.lineTo(item.x, item.y);
//             this.ctx.stroke();
//             this.ctx.closePath();
//         } else if (!item.isDummy) {			
//             this.ctx.strokeStyle = item.c;
//             this.ctx.lineWidth = item.r;
//             this.ctx.beginPath();
//             this.ctx.moveTo(item.x, item.y);
//             this.ctx.lineTo(item.x, item.y);
//             this.ctx.stroke();
//             this.ctx.closePath();
//         }
//     }
// }


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

    constructor(id, sessionId, email){
        this.sessionId = sessionId;
        this.email = email
        this.mode = 'brush'
        this.color = '#a713f7';
        this.width = 6;
        var width = window.innerWidth;
        var height = window.innerHeight - 25;

      // first we need Konva core things: stage and layer
        this.stage = new Konva.Stage({
            container: id,
            width: width,
            height: height
        })

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        if(email == 'mentor1@gmail.com') {
            this.setUpMentorPrivilege();
            this.stage.container().style.cursor = 'crosshair';
        }
    }


    setUpMentorPrivilege() {
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
                self.mode === 'brush' ? 'source-over' : 'destination-out',
                points: [pos.x, pos.y]
            });
            self.layer.add(self.lastLine);
        });

        this.stage.on('mouseup touchend', function() {
            sendDrawing(self.stage.toJSON(),1, self.sessionId, self.email)
            self.isPaint = false;
        });

        // and core function - drawing
        this.stage.on('mousemove touchmove', function() {
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
    props: ['id', 'datas', 'email', 'sessionId'],
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
        // this.draw = new Draw(document.getElementById(this.id), this, document.getElementById('cursor'), this.email, this.sessionId)
        // myEmitter.on('event', (data) => {
        //     window.console.log("Latata", data);
        //     if(data.email !== this.email) {
        //         this.history = [];
        //         this.history = data.data;
        //         this.draw.redraw()
        //     }
        // })
        this.draw = new Draw(this.id, this.sessionId, this.email);
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
            this.draw.setWidth(this.penSizes[index]);
        },
        activateEraser() {
            this.draw.setMode("eraser")
        },
        setEraserSize(index) {
            this.draw.setWidth(this.eraserSize[index]);
        },
        setColor(index) {
            this.draw.setColor(this.colors[index]);
        },
        clearCanvas() {
            this.draw.getLayer().destroyChildren();
            this.draw.getLayer().batchDraw();
            sendDrawing(this.draw.getStage().toJSON(), 1, this.sessionId,this.email)
        }
    }
}
</script>

<style scoped>

</style>
