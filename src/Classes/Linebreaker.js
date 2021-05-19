import isPointInRange from "../pure-functions/isPointInRange"
import generateAlert from "../pure-functions/generateAlert"

class Linebreaker {
  constructor(id, canvasObject) {
    this.image = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentBreaking = { }

    this.image.addEventListener('click', this.handlerBreakerClick)
  }

  handlerDocClick = (ev) => {
    if(ev.target !== this.canvas) this.complete()
  }

  handlerBreakerClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect)

    this.image.addEventListener('click', this.complete)
    this.image.removeEventListener('click', this.handlerBreakerClick)

    this.canvas.style.cursor = 'cell';
    this.image.style.opacity = '0.2'

    setTimeout(
      () => document.addEventListener('click', this.handlerDocClick),
      100
    )
  }

  handlerImageFirstSelect = (event) => {
    const imagesToDraw = this.canvasObject.imagesToDraw
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let index = 0, len = imagesToDraw.length; index < len; index++) {
      const obj = imagesToDraw[index];
      if(isPointInRange(downX, downY, obj)) {
        if (!obj.connectedLines.length){
          generateAlert("Не имеет подключений, которые можно разорвать!")
          break
        }

        this.currentBreaking.firstDevice  = obj;
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
        if (!obj.connectedLines.length){
          generateAlert("Не имеет подключений, которые можно разорвать!")
          break
        }
        if (obj === this.currentBreaking.firstDevice) {
          generateAlert("Начальная и конечная точка разрыва соединения совпадают!")
          break
        };
        this.currentBreaking.secondDevice = obj;
        this.canvasObject.deleteLine( this.currentBreaking.firstDevice, this.currentBreaking.secondDevice )
        this.complete()
        break
      } 
    } 
  }

  complete = () => {
    document.removeEventListener('click', this.handlerDocClick)
    this.canvas.removeEventListener('click', this.handlerImageFirstSelect);
    this.canvas.removeEventListener('click', this.handlerImageSecondSelect);

    this.currentBreaking = { };
    this.image.addEventListener('click', this.handlerBreakerClick);
    this.image.removeEventListener('click', this.complete)

    this.canvas.style.cursor = 'auto';
    this.image.style.opacity = '1'

  }
}

export default Linebreaker