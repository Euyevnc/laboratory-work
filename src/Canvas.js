class Canvas {
  constructor({ id, onmousedown, ondrop, ondragover, oncontextmenu } ) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');


    this.imagesToDrow = [],
    this.linesToDrow = [],

    this.canvas.addEventListener('mousedown', onmousedown);
    this.canvas.addEventListener('drop', ondrop);
    this.canvas.addEventListener('dragover', ondragover);
    this.canvas.addEventListener('contextmenu', oncontextmenu)
  }

}

export default Canvas