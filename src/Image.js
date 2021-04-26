class Image {
  constructor({ image, canvas, eventData }) {
    this.image = image,
    this.type = image.id
    this.context = canvas.getContext('2d'),

    this._x = (eventData.clientX - canvas.offsetLeft - eventData.dataTransfer.getData("mouse_position_x")),
    this._y = (eventData.clientY - canvas.offsetTop -  eventData.dataTransfer.getData("mouse_position_y")),

    this.width = image.offsetWidth,
    this.height = image.offsetHeight

    this.connectedLines = []
  }

  addLine( line ) {
    if(this.type == 'hub' && this.connectedLines.length === 2) {
      const lineToDelete = this.connectedLines[0]
      this.connectedLines[0] = line

      lineToDelete.isDeprecated = true
    }
    else this.connectedLines.push(line)
  }

  //Сеттеры далее нужны чтобы при перезаписи координат они, обработанные если нужно, передавались линиям
  get x() {
    return this._x
  };

  set x(value) {
    this._x = value
    this.connectedLines.forEach((line, index) => {
      if (line.startImg == this) {
        line.x = this.type == "hub" 
          ? (value + this.width/2 + 24 + index * 11) 
          : this.type == "rout" 
          ? (value + this.width/2 - 33 + index * 13) 
          : value + this.width/2
      }

      else if (line.finishImg == this){
        line.fx = this.type == "hub" 
        ? (value + this.width/2 + 24 + index * 11) 
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
        line.y = this.type == "hub" 
          ? (value + this.height/1.4 - 2) 
          : this.type == "rout"
          ? (value + this.height/1.25 - 2)
          : value + this.height/2
      }

      else if (line.finishImg == this) {
        line.fy = this.type == "hub" 
        ? (value + this.height/1.4 - 2) 
        : this.type == "rout"
        ? (value + this.height/1.25 - 2)
        : value + this.height/2
      }
    })
  };
}

export default Image