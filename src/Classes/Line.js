class Line {
  constructor ({ startDevice , finishDevice }) {
    this.startImg = startDevice;
    this.finishImg = finishDevice;

    this.x 
    this.y 
    this.fx 
    this.fy 

    this.connectAndSync()
  }

  connectAndSync (){
    this.startImg.addLine(this);
    this.finishImg.addLine(this)

    this.startImg.x = this.startImg.x,
    this.startImg.y = this.startImg.y,
    this.finishImg.x = this.finishImg.x,
    this.finishImg.y = this.finishImg.y
    //небольшой кунштюг, чтобы сеттеры объектов изображений сами расчитали положение линии
  }
}

export default Line