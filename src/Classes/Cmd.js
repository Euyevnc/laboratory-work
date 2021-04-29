class Cmd {
  constructor (id, canvasObject) {
    this.root = document.getElementById(id)
    this.canvasObject = canvasObject

    this.root.addEventListener("input", this.#cmdInputHandler)
    this.root.addEventListener("keydown", this.#cmdSubmitHandler)

  }

  #cmdInputHandler = (e) => {
    let newValue = e.target.value;
    if(newValue[0] !== ">") newValue = ">" + newValue
    newValue = newValue.replaceAll(/\n(?!>)/g, "\n>")
    e.target.value = newValue
  }

  #cmdSubmitHandler = (e) => {
    let newValue = e.target.value;
    if(e.key !== "Enter") return 

    let lastStringIndex = newValue.lastIndexOf("\n>") || 0
    let lastString = newValue.substring(lastStringIndex+2)

    const command = this.#extractCommand(lastString)
    const nodeIds = this.#extractNodes(lastString)

    if (command !== "ping"){
      e.target.value += "\n unknown command"
      return
    }

    if(!nodeIds || !nodeIds[0] || !nodeIds[1]){
      e.target.value += "\n two arguments expected"
      return
    }

    const startObject = this.#findObject(nodeIds[0])
    const finishObject = this.#findObject(nodeIds[1])

    if (startObject === finishObject){
      e.target.value += "\n Entry and output points are the same"
      return
    }

    if(!startObject || !finishObject){
      e.target.value += "\n No device found"
      return
    }

    const areConected = startObject.connectionTest(finishObject)

    if (areConected){
      e.target.value += "\n Devices are connected"
    } else e.target.value += "\n Devices are disconnected"

  }

  #findObject = (nodeId) => {
    const nodeType = nodeId.match(/\w+/)[0]
    const nodeNumber = +nodeId.match(/\d+/)[0]
    
    let nodeOrder = 0
    let node = null

    this.canvasObject.imagesToDrow.forEach((image) => {
      if (image.type !== nodeType) return
      else nodeOrder += 1;

      if (nodeNumber == nodeOrder) node = image
    })
    return node
  }

  #extractCommand = ( string ) => {
    let match = string.match(/\b\w*\b/)
    let command = match ? match[0] : null
    return command 
  }

  #extractNodes = ( string ) => {
    let nodes = string.match(/\w+#\d+/g)
    return nodes
  }
}

export default Cmd