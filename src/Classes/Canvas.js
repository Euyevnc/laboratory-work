import Line from './Line'
import Image from './Image'

import isPointInRange from "../pure-functions/isPointInRange"
import generateAlert from "../pure-functions/generateAlert"

class Canvas {
  constructor(id) {
    this.root = document.getElementById(id);
    this.context = this.root.getContext('2d');

    this.imagesToDraw = [],
    this.linesToDraw = [],

    this.selectedDevice
    
    this.root.addEventListener('drop', this.handlerCanvasDrop);
    this.root.addEventListener('dblclick', this.handlerCanvasDoubleClick)
    this.root.addEventListener('mousedown', this.handlerCanvasMousedown);
    this.root.addEventListener('dragover', (event) => event.preventDefault());

  }

  handlerCanvasDrop = (event) => {
    event.preventDefault();
    const image = document.getElementById( event.dataTransfer.getData("image_id") );
    this.createImage({
      image,
      canvasObject: this,
      eventData: event
    })
  }

  handlerCanvasDoubleClick = (event) => {
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let x = 0, len = this.imagesToDraw.length; x < len; x++) {
      const obj = this.imagesToDraw[x];
      if(isPointInRange(downX, downY, obj) && obj.type === "pc") {
        this.selectedDevice = obj;
      } 
    }
    this.renderScene()
  }

  handlerCanvasMousedown = (event) => {
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let x = 0, len = this.imagesToDraw.length; x < len; x++) {
      const obj = this.imagesToDraw[x];
      if(isPointInRange(downX, downY, obj)) {
        this.handlerCanvasMove(obj, downX, downY);
        break 
      } 
    }

  }

  handlerCanvasMove(obj, downX, downY) {
    const canvas = this.root
    const origX = obj.x, 
          origY = obj.y;
    canvas.onmousemove = (event) => {
      const moveX = event.offsetX, 
            moveY = event.offsetY;
      const diffX = moveX-downX, 
            diffY = moveY-downY;
      obj.x = origX + diffX; 
      obj.y = origY + diffY;
      this.renderScene()
    }

    canvas.onmouseup = () => {
        canvas.onmousemove = function(){};
        canvas.onmouseup = function(){}
    }

  }


  createLine (startDevice, finishDevice){
    const newLine = new Line({ startDevice, finishDevice })
    this.linesToDraw.push(newLine)
    this.renderScene()
  } 

  deleteLine (firD, secD){
    let haveCommonLine = false
    firD.connectedLines.forEach((line) => {
      if (haveCommonLine) return
      if( line.startImg === secD || line.finishImg === secD ){
        haveCommonLine = true
        firD.connectedLines.splice( (firD.connectedLines.indexOf(line)), 1);
        secD.connectedLines.splice( (secD.connectedLines.indexOf(line)), 1);
        this.linesToDraw.splice( (this.linesToDraw.indexOf(line)), 1);
      }
    })
    if(haveCommonLine) this.renderScene()
    else generateAlert("Нет общих соединений!")
  }

  createImage (data){
    const newImage = new Image(data)
    this.imagesToDraw.push(newImage)
    
    this.renderScene()
  }

  renderScene() {
    const canvas = this.root 
    const context = this.context

    const imagesToDraw = this.imagesToDraw
    const linesToDraw = this.linesToDraw

    // requestAnimationFrame(renderScene);
    context.clearRect(0 , 0, canvas.width, canvas.height);

    if (imagesToDraw.length) {
      for(let x = 0, len = imagesToDraw.length; x < len; x++) {
        const image = imagesToDraw[x];
        if (image.type == "pc") continue
        if (image.ip){
          context.font = "15px Electrolize, Arial, sans-serif";
          context.textAlign = "center"
          context.fillStyle = "black"
          context.fillText(image.ip, image.x + 128/2, image.y + 128);
        }
        context.drawImage(image.image, image.x, image.y);
      }
    }

    if(linesToDraw.length) {
      for(let x = 0, len = linesToDraw.length; x < len; x++) {
        const line = linesToDraw[x];
        context.beginPath();
        context.moveTo(line.fx, line.fy);
        context.lineTo(line.x, line.y);
        context.strokeStyle = '#212121';
        context.lineWidth = 5;
        context.lineJoin = context.lineCap = 'round';
        context.stroke();
      } 
    }   

    if (imagesToDraw.length) {
      for(let x = 0, len = imagesToDraw.length; x < len; x++) {
        const image = imagesToDraw[x];
        if (image.type !== "pc") continue
        if (this.selectedDevice === image) {
          context.beginPath();
          context.arc(image.x + image.width/2, image.y + 60, 64, 0, 2 * Math.PI)
          context.fillStyle = "#009900"
          context.fill();
        }
        if (image.ip){
          context.font = "15px Electrolize, Arial, sans-serif";
          context.textAlign = "center"
          context.fillStyle = "black"
          context.fillText(image.ip, image.x + 128/2, image.y + 140);
        }
        context.drawImage(image.image, image.x, image.y);
      }
    }
    //Изображения перебираются два раза, чтобы одни из них оказались поверх линий. 
    //В canvas это зависит только от очерёдности прорисовки
    //Если это не принципиальный момент - можно убрать 
  }
}



export default Canvas