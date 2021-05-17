import Line from './Line'

class Linebreaker {
  constructor(id, canvasObject) {
    this.image = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentBreaking = { }
    this.image.addEventListener('click', this.handlerBreakerClick)
  }

  handlerBreakerClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect)

    this.image.addEventListener('click', this.complete)
    this.image.removeEventListener('click', this.handlerBreakerClick)

    this.canvas.style.cursor = 'cell';
    this.image.style.opacity = '0.2'
  }

  handlerImageFirstSelect = (event) => {
    const imagesToDrow = this.canvasObject.imagesToDrow
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDrow.length; index < len; index++) {
      const obj = imagesToDrow[index];
      if(isPointInRange(downX, downY, obj)) {
        if (!obj.connectedLines.length) return

        this.currentBreaking.firstDevice  = obj;
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
        if (!obj.connectedLines.length) return;
        if (obj === this.currentBreaking.firstDevice) return;
        this.currentBreaking.secondDevice = obj;
        this.canvasObject.deleteLine( this.currentBreaking.firstDevice, this.currentBreaking.secondDevice )
        this.complete()
        break
      } 
    } 
  }

  complete = () => {
    this.canvas.removeEventListener('click', this.handlerImageFirstSelect);
    this.canvas.removeEventListener('click', this.handlerImageSecondSelect);

    this.currentBreaking = { };
    this.image.addEventListener('click', this.handlerBreakerClick);
    this.image.removeEventListener('click', this.complete)

    this.canvas.style.cursor = 'auto';
    this.image.style.opacity = '1'

  }
}

function isPointInRange(x, y, obj) {
  return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
}

export default Linebreaker