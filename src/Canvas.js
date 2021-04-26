import Line from './Line'
import Image from './Image'

class Canvas {
  constructor({ id, ondrop, ondragover, oncontextmenu } ) {
    this.root = document.getElementById(id);
    this.context = this.root.getContext('2d');


    this.imagesToDrow = [],
    this.linesToDrow = [],

    this.root.addEventListener('mousedown', this.handlerCanvasMousedown);
    this.root.addEventListener('drop', this.handlerCanvasDrop);
    this.root.addEventListener('dragover', ondragover);
    this.root.addEventListener('contextmenu', oncontextmenu)
  }

  handlerCanvasDrop = (event) => {
    event.preventDefault();
    const image = document.getElementById( event.dataTransfer.getData("image_id") );
    this.createImage({
      image,
      canvas: this.root,
      eventData: event
    })
  }

  handlerCanvasMousedown = (event) => {
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let x = 0, len = this.imagesToDrow.length; x < len; x++) {
      const obj = this.imagesToDrow[x];
      if(isPointInRange(downX, downY, obj)) {
        this.addMoveHandler(obj, downX, downY);
        break 
      } 
    }

  }

  addMoveHandler(obj, downX, downY) {
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

    canvas.onmouseup = function() {
        canvas.onmousemove = function(){};
    }
  }


  createLine (startIndex, finishIndex){
    const startImg = this.imagesToDrow[startIndex];
    const finishImg = this.imagesToDrow[finishIndex];

    const newLine = new Line({ startImg, finishImg })
    this.linesToDrow.push(newLine)

    this.renderScene()
  } 

  createImage (data){
    const newImage = new Image(data)
    this.imagesToDrow.push(newImage)
    console.log(newImage)

    this.renderScene()
  }

  renderScene() {
    const canvas = this.root 
    const context = this.context

    const imagesToDrow = this.imagesToDrow
    const linesToDrow = this.linesToDrow

    // requestAnimationFrame(renderScene);
    context.clearRect(0 , 0, canvas.width, canvas.height);

    if (imagesToDrow.length) {
      for(let x = 0, len = imagesToDrow.length; x < len; x++) {
        const image = imagesToDrow[x];
        if (image.type == "pc") continue
        image.context.drawImage(image.image, image.x, image.y);
      }
    }

    if(linesToDrow.length) {
      for(let x = 0, len = linesToDrow.length; x < len; x++) {
        const line = linesToDrow[x];
        if(line.isDeprecated) continue
        context.beginPath();
        context.moveTo(line.fx, line.fy);
        context.lineTo(line.x, line.y);
        context.strokeStyle = '#212121';
        context.lineWidth = 5;
        context.lineJoin = context.lineCap = 'round';
        context.stroke();
      } 
    }   

    if (imagesToDrow.length) {
      for(let x = 0, len = imagesToDrow.length; x < len; x++) {
        const image = imagesToDrow[x];
        if (image.type !== "pc") continue
        image.context.drawImage(image.image, image.x, image.y);
      }
    }
    //Изображения перебираются два раза, чтобы одни из них оказались поверх линий. 
    //В canvas это зависит только от очерёдности прорисовки
    //Если это не принципиальный момент - можно убрать 
  }
}

function isPointInRange(x, y ,obj) {
  return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
}

export default Canvas