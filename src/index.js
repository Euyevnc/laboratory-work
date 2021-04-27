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

    const command = extractCommand(lastString)
    const nodeIds = extractNodes(lastString)

    if (command !== "ping"){
      e.target.value += "\n unknown command"
      return
    }

    if(!nodeIds || !nodeIds[0] || !nodeIds[1]){
      e.target.value += "\n two arguments expected"
      return
    }

    const startObject = findObject(nodeIds[0])
    const finishObject = findObject(nodeIds[1])

    if(!startObject || !finishObject){
      e.target.value += "\n No device found "
      return
    }

    const areConected = connectionTest(startObject, finishObject)
    if (areConected){
      e.target.value += "\n Devices are connected"
    } else e.target.value += "\n Devices are disconnected"

    function findObject(nodeId){
      const nodeType = nodeId.match(/\w+/)[0]
      const nodeNumber = +nodeId.match(/\d+/)[0]
      
      let nodeOrder = 0
      let node = null

      imagesToDrow.forEach((image) => {
        if (image.type !== nodeType) return
        else nodeOrder += 1;

        if (nodeNumber == nodeOrder) node = image
      })
      return node
    }

    function extractCommand( string ) {
      let match = string.match(/\b\w*\b/)
      let command = match ? match[0] : null
      return command 
    }

    function extractNodes( string ) {
      let nodes = string.match(/\w+#\d+/g)
      return nodes
    }

  }

  function connectionTest(start, final){  
    const processed = []

    const areConected = iterating(start, final)
    return areConected

    function iterating(origin, goal){
      processed.push(origin)

      if (origin == goal) return true

      let isConnect = false
      origin.connectedLines.forEach((line) => {
        if (line.isDeprecated) return

        if (processed.indexOf(line.startImg) == -1) {
          isConnect = iterating( line.startImg, goal) || isConnect
        }
        else if(processed.indexOf(line.finishImg)  == -1) {
          isConnect = iterating( line.finishImg, goal) || isConnect
        }
      })
      return isConnect
    }
  }

}

