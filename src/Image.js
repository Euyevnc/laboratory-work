class Image {
  constructor({ context, image, canvas, eventData}) {
    this.context = context,
    this.image = image,

    this._x = (eventData.clientX - canvas.offsetLeft - eventData.dataTransfer.getData("mouse_position_x")),
    this._y = (eventData.clientY - canvas.offsetTop -  eventData.dataTransfer.getData("mouse_position_y")),

    this.width = image.offsetWidth,
    this.height = image.offsetHeight

    this.connectedLines = []
  }

  get x() {
    return this._x
  };
  set x(value) {
    this._x = value
    
    this.connectedLines.forEach((line) => {
      if (line.startObject == this) {
        line.x = value + this.width/2
      }
      else {
        line.fx = value + this.width/2
      }
    })
  };

  get y() {
    return this._y
  };
  set y(value) {
    this._y = value

    this.connectedLines.forEach((line) => {
      if (line.startObject == this) {
        line.y = value + this.height/1.4
      }
      else {
        line.fy = value + this.height/1.4
      }
    })
  };
}

export default Image