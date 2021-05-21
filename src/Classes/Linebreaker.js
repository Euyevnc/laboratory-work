import isPointInRange from "../pure-functions/isPointInRange"
import generateAlert from "../pure-functions/generateAlert"

class Linebreaker {
  // Вот ровно то же самое, что коннектор, только наоборот.
  // Да их можно было бы вообще одним объектом сделать, просто бы методы канваса разные вызывали
  // В остальном - то код такой же. Но ООП, наверное другое мнение на этот счёт имеет. 
  constructor(id, canvasObject) {
    this.image = document.getElementById(id)

    this.canvasObject = canvasObject
    this.canvas = canvasObject.root

    this.currentBreaking = { }

    this.image.addEventListener('click', this.handlerBreakerClick)
  }

  handlerBreakerClick = () => {
    this.canvas.addEventListener('click', this.handlerImageFirstSelect)

    this.image.removeEventListener('click', this.handlerBreakerClick)

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

    this.canvas.style.cursor = 'auto';
    this.image.style.opacity = '1'

  }
}

export default Linebreaker