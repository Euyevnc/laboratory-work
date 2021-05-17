import './styles.css'
import Canvas from './Classes/Canvas'
import Connector from './Classes/Connector'
import Linebreaker from './Classes/Linebreaker'
import Dispatcher from "./Classes/Dispatcher"
import Cmd from './Classes/Cmd.js'

document.addEventListener('DOMContentLoaded', handlerDOMloaded)

function handlerDOMloaded(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const canvasObject = new Canvas("canvas");

  const connector = new Connector("connector", canvasObject)

  const linebreaker = new Linebreaker("linebreaker", canvasObject)

  const dispatcher = new Dispatcher("menu", canvasObject)

  const cmd = new Cmd("cmd", canvasObject)

  document.querySelectorAll('.panel-for-icons img').forEach((img)=> {
    if (img.id === "connector" || img.id === "linebreaker") img.addEventListener('dragstart', (event) => event.preventDefault() ) 
    else img.addEventListener('dragstart', handlerImgDragstart)
  })

  function handlerImgDragstart(e){
    e.dataTransfer.setData("mouse_position_x", e.clientX - e.target.offsetLeft );
    e.dataTransfer.setData("mouse_position_y", e.clientY - e.target.offsetTop  );
    e.dataTransfer.setData("image_id", e.target.id);
  }
}

