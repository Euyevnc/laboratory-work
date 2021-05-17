import Line from './Line'

import isPointInRange from "../pure-functions/isPointInRange"

class Connector {
  constructor(id, canvasObject) {
    this.image = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentConnecting = { }
    this.image.addEventListener('click', this.handlerConnectorClick)
  }

  handlerConnectorClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect)

    this.image.addEventListener('click', this.complete)
    this.image.removeEventListener('click', this.handlerConnectorClick)

    this.canvas.style.cursor = 'cell';
    this.image.style.opacity = '0.2'
  }

  handlerImageFirstSelect = (event) => {
    const imagesToDraw = this.canvasObject.imagesToDraw
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDraw.length; index < len; index++) {
      const obj = imagesToDraw[index];
      if(isPointInRange(downX, downY, obj)) {

        this.currentConnecting.startDevice  = obj;
        this.canvas.removeEventListener('click', this.handlerImageFirstSelect)
        this.canvas.addEventListener('click', this.handlerImageSecondSelect)

        break
      } 
    }
  }

  handlerImageSecondSelect = (event) => {
    const imagesToDraw = this.canvasObject.imagesToDraw
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDraw.length; index < len; index++) {
      const obj = imagesToDraw[index];
      if( isPointInRange(downX, downY, obj) ) {

        if (obj !== this.currentConnecting.startDevice){

          this.currentConnecting.finishDevice = obj
          this.canvasObject.createLine( this.currentConnecting.startDevice, this.currentConnecting.finishDevice )
          
          this.complete()
          break
        } 

      } 
    } 
  }

  complete = () => {
    this.canvas.removeEventListener('click', this.handlerImageFirstSelect);
    this.canvas.removeEventListener('click', this.handlerImageSecondSelect);

    this.currentConnecting = { };
    this.image.addEventListener('click', this.handlerConnectorClick);
    this.image.removeEventListener('click', this.complete)

    this.canvas.style.cursor = 'auto';
    this.image.style.opacity = '1'

  }
}

export default Connector