class Line {
  constructor ({ startObject, finishObject }) {
    this.startObject = startObject;
    this.finishObject = finishObject;

    this.x = startObject.x + startObject.width/2,
    this.y = startObject.y + startObject.height/1.4,
    this.fx = finishObject.x + finishObject.width/2,
    this.fy = finishObject.y + finishObject.height/1.4
  }
}

export default Line