import './styles.css'
import Canvas from './Canvas'
import Connector from './Connector'

document.addEventListener('DOMContentLoaded', handlerDOMloaded)

function handlerDOMloaded(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const canvasObject = new Canvas({
    id: 'canvas',
  });

  const canvas = canvasObject.root
  const context = canvasObject.context
  const imagesToDrow = canvasObject.imagesToDrow
  const linesToDrow = canvasObject.linesToDrow

  const connector = new Connector("line", canvasObject)

  document.querySelectorAll('.panel-for-icons img').forEach((img)=> {
    if (img.id !== "line") img.addEventListener('dragstart', handlerImgDragstart)
    else  img.addEventListener('dragstart', (event) => event.preventDefault() )
  })

  document.querySelector('.menu .close').addEventListener("click", (e)=>{
    document.getElementById('menu').style.display = 'none';
  })

  document.querySelector('.menu .button').addEventListener("click", (e)=>{
    document.getElementById('menu').style.display = 'none';
  })

  document.querySelector('#cmd').addEventListener("input", cmdInputHandler)
  document.querySelector('#cmd').addEventListener("keydown", cmdSubmitHandler)


  function handlerImgDragstart(e){
    e.dataTransfer.setData("mouse_position_x",e.clientX - e.target.offsetLeft );
    e.dataTransfer.setData("mouse_position_y",e.clientY - e.target.offsetTop  );
    e.dataTransfer.setData("image_id", e.target.id);
  }


  function cmdInputHandler(e){
    let newValue = e.target.value;
    if(newValue[0] !== ">") newValue = ">" + newValue
    newValue = newValue.replaceAll(/\n(?!>)/g, "\n>")
    e.target.value = newValue
    
  }
  function cmdSubmitHandler(e){
    let newValue = e.target.value;
    if(e.key !== "Enter") return 

    let lastStringIndex = newValue.lastIndexOf("\n>") || 0
    let lastString = newValue.substring(lastStringIndex+2)

    const comman = extractCommand(lastString)
    const nodeNames = extractNodes(lastString)

    function findObjects(nodeNames){

    }

    function extractCommand( string ) {
      let command = string.match(/\b\w*\b/)
      return command[0]
    }

    function extractNodes( string ) {
      let nodes = string.match(/\w#\d*/g)
      return nodes
    }

  }

}

