document.addEventListener('DOMContentLoaded', handlerDOMloaded)

function handlerDOMloaded(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  requestAnimationFrame(renderScene);

  canvas.onmousedown = function(e) {
    var downX = e.offsetX,downY = e.offsetY;
    for(let x = 0,len = imagesOnCanvas.length; x < len; x++) {
      var obj = imagesOnCanvas[x];

      if(isPointInRange(downX,downY,obj)) {

        startMove(obj,downX,downY);
        break 

      } 
    }
  }
}

var imagesOnCanvas = [];
var linesOnCanvas = [];

function renderScene() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(var x = 0,len = linesOnCanvas.length; x < len; x++) {
    var obj2 = linesOnCanvas[x];
    if(linesOnCanvas.length > 0) {
        ctx.beginPath();
        ctx.moveTo(obj2.fx,obj2.fy);
        ctx.lineTo(obj2.x,obj2.y);
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 5;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
    }
  }

  for(var x = 0,len = imagesOnCanvas.length; x < len; x++) {
      var obj = imagesOnCanvas[x];
      obj.context.drawImage(obj.image, obj.x, obj.y);
  }
  
}

function drag(e){
  e.dataTransfer.setData("mouse_position_x",e.clientX - e.target.offsetLeft );
  e.dataTransfer.setData("mouse_position_y",e.clientY - e.target.offsetTop  );
  e.dataTransfer.setData("image_id", e.target.id);
}


function handleContextMenu(e) {
  e.preventDefault()
  document.getElementById("menu").style.display = "block";
}

function startMove(obj,downX,downY) {
  const origX = obj.x, origY = obj.y;
  const canvas = document.getElementById('canvas');
  canvas.onmousemove = function(e) {
      var moveX = e.offsetX, moveY = e.offsetY;
      var diffX = moveX-downX, diffY = moveY-downY;
      obj.x = origX+diffX; 
      obj.y = origY+diffY;
      requestAnimationFrame(renderScene);
  }
  canvas.addEventListener('contextmenu', handleContextMenu, false);
  canvas.onmouseup = function() {
      canvas.onmousemove = function(){};
  }
}

function isPointInRange(x,y,obj) {
  return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
}

function allowDrop(e){
  e.preventDefault();
}

function drop(e)
{
  e.preventDefault();
  var image = document.getElementById( e.dataTransfer.getData("image_id") );
  var mouse_position_x = e.dataTransfer.getData("mouse_position_x");
  var mouse_position_y = e.dataTransfer.getData("mouse_position_y");
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  console.log(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
  // Тут теперь передаются не данные напрямую, а индекс объекта в массиве 
  document.getElementById("first").innerHTML += `<option value = "${imagesOnCanvas.length}">Устройство #${e.dataTransfer.getData("image_id")}</option>`;
  document.getElementById("end").innerHTML += `<option value = "${imagesOnCanvas.length}">Устройство #${e.dataTransfer.getData("image_id")}</option>`;

  const newImage = {
    context: ctx,
    image: image,
    _x:e.clientX - canvas.offsetLeft - mouse_position_x,
    _y:e.clientY - canvas.offsetTop - mouse_position_y,

    width: image.offsetWidth,
    height: image.offsetHeight,

    get x() {
      return this._x
    },
    set x(value) {
      this._x = value
      
      this.lines.forEach((line) => {
        if (line.startObject == this) {
          line.x = value + this.width/2
        }
        else {
          line.fx = value + this.width/2
        }
      })
    },

    get y() {
      return this._y
    },
    set y(value) {
      this._y = value

      this.lines.forEach((line) => {
        if (line.startObject == this) {
          line.y = value + this.height/1.5
        }
        else {
          line.fy = value + this.height/1.5
        }
      })
    },

    lines: [],
  }

  imagesOnCanvas.push(newImage)
  requestAnimationFrame(renderScene);
}

// document.oncontextmenu = cmenu;
// function cmenu() {
//   return false;
// }
// думаю, предотвращать событие только на canvas было бы правильнее

function openline() {
  document.getElementById("lines").style.display = "block";
}

function lines() {
  const firstIndex = document.getElementById("first").value;
  const endIndex = document.getElementById("end").value;

  const startObject = imagesOnCanvas[firstIndex];
  const finishObject = imagesOnCanvas[endIndex]

  const newLine = {
    startObject: startObject,
    finishObject: finishObject,

    x: startObject.x + startObject.width/2,
    y: startObject.y + startObject.height/1.5,
    fx: finishObject.x + finishObject.width/2,
    fy: finishObject.y + finishObject.height/1.5
  }
  startObject.lines.push(newLine)
  finishObject.lines.push(newLine)

  linesOnCanvas.push(newLine);
  requestAnimationFrame(renderScene);
  console.log("start line: x - " + newLine.x + ", y - " + newLine.y);
  console.log("end line: x - " + newLine.fx + ", y - " + newLine.fy);

}