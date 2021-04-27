import './styles.css'
import Canvas from './Canvas'
import Connector from './Connector'

document.addEventListener('DOMContentLoaded', handlerDOMloaded)

function handlerDOMloaded(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const canvasObject = new Canvas({
    id: 'canvas',
    imageObserver: cmdUpdate
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


  function handlerImgDragstart(e){
    e.dataTransfer.setData("mouse_position_x",e.clientX - e.target.offsetLeft );
    e.dataTransfer.setData("mouse_position_y",e.clientY - e.target.offsetTop  );
    e.dataTransfer.setData("image_id", e.target.id);
  }

  const cmd = {
    root: document.getElementById("cmd"),
    firstField: document.getElementById("cmd-start"),
    secondField: document.getElementById("cmd-end"),
    
    button: document.getElementById("cmd-button"),
    display: document.getElementById("cmd-display")
  }

  cmd.button.addEventListener('click', startTest)

  function cmdUpdate( image ) {
    const index = imagesToDrow.indexOf(image);
    cmd.firstField.insertAdjacentHTML('beforeend', `<option value='${index}'> #${index+1}: ${image.type}</option>`)
    cmd.secondField.insertAdjacentHTML('beforeend', `<option value='${index}'> #${index+1}: ${image.type}</option>`)
  }

  function startTest(){
    const startNode = imagesToDrow[cmd.firstField.value]
    const finishNode = imagesToDrow[cmd.secondField.value]    
    const processed = []

    const tetsResult = iteration(startNode, finishNode)

    if(tetsResult) cmd.display.className = "cmd-display_positive"
    else cmd.display.className = "cmd-display_negative"


    function iteration(origin, goal){
      processed.push(origin)

      if (origin == goal) return true

      let isConnect = false
      origin.connectedLines.forEach((line) => {
        if (line.isDeprecated) return

        if (processed.indexOf(line.startImg) == -1) {
          isConnect = iteration( line.startImg, goal) || isConnect
        }
        else if(processed.indexOf(line.finishImg)  == -1) {
          isConnect = iteration( line.finishImg, goal) || isConnect
        }
      })

      return isConnect
    }
  }
}

