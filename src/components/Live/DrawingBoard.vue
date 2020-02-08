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
        <div class="toolbar-item" v-on:click="clearCanvas()">Clear</div>
        </div>
        <canvas :id="id"></canvas>
        <div class="cursor" id="cursor"></div>
    </div>
</template>

<script>
import { sendDrawing } from "@/lib/mongodb/video-session/drawing/index"
import eventEmitter from "./events";

class Draw {
    constructor(c, app, cursor, email, sessionId){
        this.c = c;
        this.ctx = this.c.getContext('2d');
        this.app = app;
        this.cursor = cursor
        this.email = email
        this.sessionId = sessionId
        
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.tempHistory = [];
        
        this.setSize();
        
        this.listen();
        
        this.redraw();
    }
    
    listen(){
        this.c.addEventListener('mousedown', (e)=>{
            window.console.log("mousedown")
            this.mouseDown = true;
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
            this.setDummyPoint();
        });
        
        this.c.addEventListener('mouseup', ()=>{
            if(this.mouseDown){
                sendDrawing(this.app.history, 1, this.sessionId,this.email)
                this.setDummyPoint();
            }
            this.mouseDown = false;
        });
        
        this.c.addEventListener('mouseleave', ()=>{
            if(this.mouseDown){
                this.setDummyPoint();
            }
            this.mouseDown = false;
        });
        
        this.c.addEventListener('mousemove', (e)=>{
            this.moveMouse(e);
            
            if(this.mouseDown){
                this.mouseX = this.mouseX;
                this.mouseY = this.mouseY;
                
                if(!this.app.options.restrictX){
                    this.mouseX = e.offsetX;
                }
                
                if(!this.app.options.restrictY){
                    this.mouseY = e.offsetY;
                }
                                
                var item = {
                    isDummy: false,
                    x: this.mouseX,
                    y: this.mouseY,
                    c: this.app.color,
                    r: this.app.size
                };
                
                this.app.history.push(item);
                this.draw(item, this.app.history.length);

            }
        });
        
        window.addEventListener('resize', ()=>{
            this.setSize();
            this.redraw();
        });
    }
    
    setSize(){
        this.c.width = window.innerWidth;
        this.c.height = window.innerHeight - 60;
    }
    
    moveMouse(e){
        let x = e.offsetX;
        let y = e.offsetY;
        
        this.cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    }
    
    getDummyItem(){
        var lastPoint = this.app.history[this.app.history.length-1];
        window.console.log("LastPoint", lastPoint)
        
        return {
            isDummy: true,
            x: lastPoint.x,
            y: lastPoint.y,
            c: null,
            r: null
        };
    }
    
    setDummyPoint(){
        var item = this.getDummyItem();
        this.app.history.push(item);
        this.draw(item, this.app.history.length);
    }
    
    redraw(){
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.drawBgDots()

        if(!this.app.history.length){
            return true;
        }
        
        this.app.history.forEach((item, i)=>{
            this.draw(item, i);
        });
    }
    
    drawBgDots(){
        var gridSize = 50;
        this.ctx.fillStyle = 'rgba(0, 0, 0, .2)';
        
        for(var i = 0; i*gridSize < this.c.width; i++){
            for(var j = 0; j*gridSize < this.c.height; j++){
                if(i > 0 && j > 0){
                    this.ctx.beginPath();
                    this.ctx.rect(i * gridSize, j * gridSize, 2, 2);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }
    
    draw(item, i){
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = "round";
        
        var prevItem = this.app.history[i-2];
                
        if(i < 2){
            return false;
        }

        if(!item.isDummy && !this.app.history[i-1].isDummy && !prevItem.isDummy){
            this.ctx.strokeStyle = item.c;
            this.ctx.lineWidth = item.r;
            this.ctx.beginPath();
            this.ctx.moveTo(prevItem.x, prevItem.y);
            this.ctx.lineTo(item.x, item.y);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (!item.isDummy) {			
            this.ctx.strokeStyle = item.c;
            this.ctx.lineWidth = item.r;
            this.ctx.beginPath();
            this.ctx.moveTo(item.x, item.y);
            this.ctx.lineTo(item.x, item.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}
export default {
    name: 'drawing-board',
    props: ['id', 'datas', 'email', 'sessionId'],
    data: function () {
        return {
                history: this.datas,
                color: '#13c5f7',
                popups: {
                    showColor: false,
                    showSize: false,
                    showWelcome: true,
                    showSave: false,
                    showOptions: false
                },
                options: {
                    restrictY: false,
                    restrictX: false
                },
                save: {
                    name: '',
                    saveItems: []
                },
                size: 6,
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
                weights: [ 2, 4, 6 ],
                disabled: false,
                absolute: false,
                openOnHover: false,
                drawing: false,
                eraser: false,
                closeOnClick: true,
                closeOnContentClick: true,
                offsetX: false,
                offsetY: true,
                lastPenColor: null,
                draw: null
            }
        },
    mounted() {
        this.draw = new Draw(document.getElementById(this.id), this, document.getElementById('cursor'), this.email, this.sessionId)
        eventEmitter.on('event', (data) => {
            window.console.log("Latata", data);
            if(data.email !== this.email) {
                this.history = data.data;
                this.draw.redraw()
            }
        })
    },
    methods: {
        activatePen() {
            if(this.color == '#ffffff' || !this.lastPenColor) {
                this.color = '#13c5f7'
                this.size = this.penSizes[1]
            } else {
                this.size = this.penSizes[1]
                this.color = this.lastPenColor;
            }
        },
        setPenSize(index) {
            this.size = this.penSizes[index];
        },
        activateEraser() {
            this.lastPenColor = this.color;
            this.color = '#ffffff';
        },
        setEraserSize(index) {
            this.size = this.eraserSize[index];
        },
        setColor(index) {
            this.color = this.colors[index];
            this.lastPenColor = this.colors[index];
        },
        clearCanvas() {
            this.history = [];
            this.draw.redraw()
            sendDrawing([], 1, this.sessionId,this.email)
        }
    }
}
</script>

<style scoped>

</style>
