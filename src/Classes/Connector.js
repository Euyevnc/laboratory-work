import Line from './Line'

import isPointInRange from "../pure-functions/isPointInRange"
import generateAlert from "../pure-functions/generateAlert"

class Connector {
  constructor(id, canvasObject) {
    this.image = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentConnecting = { }
    this.image.addEventListener('click', this.handlerConnectorClick);
  }

  handlerConnectorClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect);

    this.image.removeEventListener('click', this.handlerConnectorClick);

    this.canvas.style.cursor = 'cell';
    this.image.style.opacity = '0.2'

    setTimeout(
      () => {
        document.addEventListener('click', this.handlerDocClick)
        this.canvas.style.cursor = 'cell';
        this.image.style.opacity = '0.2'
      },
      100
    )
  }

  handlerDocClick = (ev) => {
    if(ev.target !== this.canvas) this.complete()
  }

  handlerImageFirstSelect = (event) => {
    const imagesToDraw = this.canvasObject.imagesToDraw
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDraw.length; index < len; index++) {
      const obj = imagesToDraw[index];
      if(isPointInRange(downX, downY, obj)) {
        if (obj.connectedLines.length >= 5) {
          generateAlert("Максимальное число подключений у этого устройства достигнуто!")
          break
        }
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
        if (obj == this.currentConnecting.startDevice){           
          generateAlert("Начальная и конечная точка соединения совпадают!")
          break
        }
        if (obj.connectedLines.length >= 5) {
          generateAlert("Максимальное число подключений у этого устройства достигнуто!")
          break
        }

        this.currentConnecting.finishDevice = obj
        this.canvasObject.createLine( this.currentConnecting.startDevice, this.currentConnecting.finishDevice )
        
        this.complete()
        break
      } 
    } 
  }

  complete = () => {
    document.removeEventListener('click', this.handlerDocClick)
    this.canvas.removeEventListener('click', this.handlerImageFirstSelect);
    this.canvas.removeEventListener('click', this.handlerImageSecondSelect);

    this.currentConnecting = { };
    this.image.addEventListener('click', this.handlerConnectorClick);

    this.canvas.style.cursor = 'auto';
    this.image.style.opacity = '1'

  }
}

export default Connector