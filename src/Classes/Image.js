import pingChecking from "../pure-functions/pingChecking"

class Image {
  // Данные иконки-девайса для отрисовки (x-y), его IP, маски, некоторые вспомогательные данные типа type
  // Содержит массив объектов линий, которыми соеденён с другими девайсами
  // это те же объекты, что и массиве LineToDraw в канвасе, но сюда они помещены, чтобы при изменении координат картинки
  // оперативно менять координаты линий, это обеспечивают сеттеры на свойствах x-y
  // все эти вычисления в них с необозначенными цифраим по типу  (value + this.width/2 - 11 + index * 11) 
  // производятся , чтобы линии располагались на определённом интервале друг от друга (чтобы в "гнёзда" "втыкались", да)
  // Ну, и проверку соединения (connectionTest) я тут прописал, а не в канвасе, т.к. это не совсем по его епархии
  constructor({ image, canvasObject, eventData }) {
    this.image = image,
    this.context = canvasObject.context,

    this.type = image.id
    this.id = this.type + "#" + (canvasObject.imagesToDraw.filter( (image) => image.type === this.type).length + 1);
    this.mask
    this.gateway
    this.ip

    this._x = (eventData.clientX - canvasObject.root.offsetLeft - eventData.dataTransfer.getData("mouse_position_x")),
    this._y = (eventData.clientY - canvasObject.root.offsetTop -  eventData.dataTransfer.getData("mouse_position_y")),

    this.width = image.offsetWidth,
    this.height = image.offsetHeight

    this.connectedLines = []
  }

  addLine( newLine ) {
    this.connectedLines.push(newLine)
  }

  connectionTest = (final) => {  
    const processed = []

    const areConected = iterating(this, final)

    const sameSubnet = pingChecking(this, final)

    return (areConected && sameSubnet)

    function iterating(origin, goal){
      processed.push(origin)

      if (origin == goal) return true

      let isConnect = false
      origin.connectedLines.forEach((line) => {
        if (line.isDeprecated) return

        if (processed.indexOf(line.startImg) == -1) {
          isConnect = iterating( line.startImg, goal) || isConnect
        }
        else if(processed.indexOf(line.finishImg)  == -1) {
          isConnect = iterating( line.finishImg, goal) || isConnect
        }
      })
      return isConnect
    }
  }

  get x() {
    return this._x
  };

  set x(value) {
    this._x = value
    this.connectedLines.forEach((line, index) => {
      if (line.startImg == this) {
        line.x = this.type == "hub" 
          ? (value + this.width/2 - 11 + index * 11) 
          : this.type == "rout" 
          ? (value + this.width/2 - 33 + index * 13) 
          : value + this.width/2
      }

      else if (line.finishImg == this){
        line.fx = this.type == "hub" 
        ? (value + this.width/2 - 11 + index * 11) 
        : this.type == "rout" 
        ? (value + this.width/2 - 33 + index * 13) 
        : value + this.width/2
      }
    })
  };

  get y() {
    return this._y
  };

  set y(value) {
    this._y = value

    this.connectedLines.forEach((line) => {
      if (line.startImg == this) {
        line.y = this.type !== "pc" 
          ? (value + this.height/1.4 - 3) 
          : value + this.height/2
      }

      else if (line.finishImg == this) {
        line.fy = this.type !== "pc" 
        ? (value + this.height/1.4 - 3) 
        : value + this.height/2
      }
    })
  };
}

export default Image