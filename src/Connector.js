import Line from './Line'

class Connector {
  constructor(id, canvasObject) {
    this.connector = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentConnecting = { }
    this.connector.addEventListener('click', this.handlerConnectorClick)
  }

  handlerConnectorClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect)

    this.connector.addEventListener('click', this.complete)
    this.connector.removeEventListener('click', this.handlerConnectorClick)

    this.canvas.style.cursor = 'cell';
    this.connector.style.opacity = '0.2'
  }

  handlerImageFirstSelect = (event) => {
    const imagesToDrow = this.canvasObject.imagesToDrow
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDrow.length; index < len; index++) {
      const obj = imagesToDrow[index];
      if(isPointInRange(downX, downY, obj)) {

        this.currentConnecting.startIndex = index;
        this.canvas.removeEventListener('click', this.handlerImageFirstSelect)
        this.canvas.addEventListener('click', this.handlerImageSecondSelect)

        break
      } 
    }
  }

  handlerImageSecondSelect = (event) => {
    const imagesToDrow = this.canvasObject.imagesToDrow
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDrow.length; index < len; index++) {
      const obj = imagesToDrow[index];
      if( isPointInRange(downX, downY, obj) ) {

        if (index !== this.currentConnecting.startIndex){

          this.currentConnecting.finishIndex = index
          this.canvasObject.createLine( this.currentConnecting.startIndex, this.currentConnecting.finishIndex )
          
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
    this.connector.addEventListener('click', this.handlerConnectorClick);
    this.connector.removeEventListener('click', this.complete)

    this.canvas.style.cursor = 'auto';
    this.connector.style.opacity = '1'

  }
}

function isPointInRange(x, y, obj) {
  return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
}

export default Connector