import './styles.css'
import Line from './Line'
import Canvas from './Canvas'
import Image from './Image'

document.addEventListener('DOMContentLoaded', handlerDOMloaded)

function handlerDOMloaded(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const canvasObject = new Canvas({
    id: 'canvas',
    onmousedown: handlerCanvasMousedown,
    ondrop: handlerCanvasDrop,
    ondragover: (event) => event.preventDefault(),
    oncontextmenu: handleCanvasContext
  });

  const canvas = canvasObject.canvas
  const context = canvasObject.context
  const imagesToDrow = canvasObject.imagesToDrow
  const linesToDrow = canvasObject.linesToDrow

  document.querySelectorAll('.panel-for-icons img').forEach((img)=> {
    if (img.id !== "line") img.addEventListener('dragstart', handlerImgDragstart)
    else { 
      img.addEventListener('click', (event) => {
        document.getElementById("lines").style.display = "block";
      });
      img.addEventListener('dragstart', (event) => {
        event.preventDefault()
      })
    }
  })

  document.querySelector('.menu .close').addEventListener("click", (e)=>{
    document.getElementById('menu').style.display = 'none';
  })

  document.querySelector('.lines .close').addEventListener("click", (e)=>{
    document.getElementById('lines').style.display = 'none';
  })

  document.querySelector('.lines .button').addEventListener("click", handlerCreateLineClick)

  function renderScene() {
    context.clearRect(0 ,0, canvas.width, canvas.height);

    for(var x = 0, len = linesToDrow.length; x < len; x++) {
      var obj2 = linesToDrow[x];
      if(linesToDrow.length > 0) {
          context.beginPath();
          context.moveTo(obj2.fx,obj2.fy);
          context.lineTo(obj2.x,obj2.y);
          context.strokeStyle = '#212121';
          context.lineWidth = 5;
          context.lineJoin = context.lineCap = 'round';
          context.stroke();
      }
    }

    for(var x = 0,len = imagesToDrow.length; x < len; x++) {
        var obj = imagesToDrow[x];
        obj.context.drawImage(obj.image, obj.x, obj.y);
    }
    
  }

  function handlerImgDragstart(e){
    e.dataTransfer.setData("mouse_position_x",e.clientX - e.target.offsetLeft );
    e.dataTransfer.setData("mouse_position_y",e.clientY - e.target.offsetTop  );
    e.dataTransfer.setData("image_id", e.target.id);
  }

  function handlerCanvasMousedown(event){
    var downX = event.offsetX,downY = event.offsetY;
    for(let x = 0, len = imagesToDrow.length; x < len; x++) {
      var obj = imagesToDrow[x];
      if(isPointInRange(downX,downY,obj)) {
        startMove(obj,downX,downY);
        break 
      } 
    }
  }

  function handleCanvasContext(event) {
    event.preventDefault()
    document.getElementById("menu").style.display = "block";
  }

  function startMove(obj, downX, downY) {
    const origX = obj.x, origY = obj.y;
    canvas.onmousemove = function(event) {
        const moveX = event.offsetX, moveY = event.offsetY;
        const diffX = moveX-downX, diffY = moveY-downY;
        obj.x = origX+diffX; 
        obj.y = origY+diffY;
        requestAnimationFrame(renderScene);
    }
    canvas.onmouseup = function() {
        canvas.onmousemove = function(){};
    }
  }

  function isPointInRange(x,y,obj) {
    return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
  }

  function handlerCanvasDrop(event){
    event.preventDefault();
    const image = document.getElementById( event.dataTransfer.getData("image_id") );
    // Тут теперь передаются не данные напрямую, а индекс объекта в массиве 
    document.getElementById("first").innerHTML += `<option value = "${imagesToDrow.length}">Устройство #${event.dataTransfer.getData("image_id")}</option>`;
    document.getElementById("end").innerHTML += `<option value = "${imagesToDrow.length}">Устройство #${event.dataTransfer.getData("image_id")}</option>`;

    const newImage = new Image({
      context,
      image,
      canvas,
      eventData: event
    })

    imagesToDrow.push(newImage)
    requestAnimationFrame(renderScene);
  }

  // document.oncontextmenu = cmenu;
  // function cmenu() {
  //   return false;
  // }
  // думаю, предотвращать событие только на canvas было бы правильнее

  function handlerCreateLineClick() {
    const firstIndex = document.getElementById("first").value;
    const lastIndex = document.getElementById("end").value;

    const startObject = imagesToDrow[firstIndex];
    const finishObject = imagesToDrow[lastIndex]

    const newLine = new Line({ startObject, finishObject })
    startObject.connectedLines.push(newLine)
    finishObject.connectedLines.push(newLine)

    linesToDrow.push(newLine);
    requestAnimationFrame(renderScene);

    console.log("start line: x - " + newLine.x + ", y - " + newLine.y);
    console.log("end line: x - " + newLine.fx + ", y - " + newLine.fy);
  }
}

