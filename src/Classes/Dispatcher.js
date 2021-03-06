import generateAlert from "../pure-functions/generateAlert"
import isPointInRange from "../pure-functions/isPointInRange"

class Dispatcher {
  // Содержит элементы и функционал всплывающего окна
  // название методов само за себя говорит, вообще есть спорный момент
  // с назначением отсюда обработчика объекту канваса, (this.canvasObject.root.addEventListener('contextmenu', this.handleCanvasContext)) 
  // хотя, работает так как надо, но это, типо, нарушает принцип инкапсуляции. Но вообще это проект небольшой, так что лучше прописать так
  // чем добавлять API типо обсерверов, 

  constructor (id, canvasObject) {
    this.root = document.getElementById(id)
    this.canvasObject = canvasObject

    this.processingDevice

    this.maskField = document.getElementById("mask")
    this.ipField = document.getElementById("ip")
    this.gateway = document.getElementById("schleuse")

    this.label = this.root.querySelector(".label")
    this.close = this.root.querySelector(".close")
    this.confirmButton = this.root.querySelector(".button")

    this.close.addEventListener("click", this.handlerCloseClick)
    this.confirmButton.addEventListener("click", (e)=> { this.handlerButtonClick(e, this.processingDevice) })

    this.canvasObject.root.addEventListener('contextmenu', this.handleCanvasContext)

  }

  displayDispatcher = (device) => {
    this.processingDevice = device
    this.root.style.display = 'block';

    this.label.textContent = `${device.id}`
    this.maskField.value = device.mask || ''
    this.gateway.value = device.gateway || ''
    this.ipField.value = device.ip || ''
  }

  saveData = (device) => {
    device.mask = this.maskField.value
    device.gateway = this.gateway.value
    device.ip = this.ipField.value
  }

  handlerButtonClick = (evemt, device) => {
    this.saveData(device);
    this.root.style.display = 'none';
    this.processingDevice = undefined
    this.canvasObject.renderScene()
  }

  handlerCloseClick = () => {
    this.root.style.display = 'none';
    this.processingDevice = undefined
  }

  handleCanvasContext = (event) => {
    event.preventDefault()
    const images = this.canvasObject.imagesToDraw
    const downX = event.offsetX,
          downY = event.offsetY;
    for(let x = 0, len = images.length; x < len; x++) {
      const obj = images[x];
      if(isPointInRange(downX, downY, obj)) {
        if(obj.type === 'hub') break 
        if(obj.type === 'rout') generateAlert("under constraction")
        if(obj.type === 'pc') this.displayDispatcher(obj)
      } 
    }
  }
}

export default Dispatcher