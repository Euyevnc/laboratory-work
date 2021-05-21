class Cmd {
  constructor (id, canvasObject) {
    // Класс просто содержит модель поведения "командной строки", так как команда нужна всего одна,
    // то она не очень замысловатая InputHandler просто расставляет ">" в начале строки SubmitHandler,
    //  если введена команда ping, извлекает IP и шлёт запрос объекту девайса-иконки на проверку соединения
    //  ну и обрабатывает его, результат выводит в консоль
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
    const IP = this.#extractIP(lastString)

    if (command !== "ping"){
      e.target.value += "\n unknown command"
      return
    }

    const startObject = this.canvasObject.selectedDevice
    const finishObject = this.canvasObject.imagesToDraw.filter( (device) => device.ip === IP )[0]

    if (!startObject){
      e.target.value += "\n No entry point "
      return
    }

    if (!finishObject){
      e.target.value += "\n No output point "
      return
    }

    if (startObject === finishObject){
      e.target.value += "\n Entry and output points are the same"
      return
    }

    if (finishObject.type !== "pc") {
      e.target.value += "\n Output point is incorrect"
      return
    }

    const areConnected = startObject.connectionTest(finishObject)

    if (areConnected){
      e.target.value += `\n Ответ от ${finishObject.ip}: число байт = 32, время = ${20 + Math.round( Math.random() * 40)} мс, TTL = 53. Статистика ping для ${finishObject.ip}: пакетов отправлено: 1, получено: 1, потеряно 0 (0% потерь). Приблизительное время приёма/передачи в мс: ${20 + Math.round( Math.random() * 30)}`
    } else e.target.value += `\n При проверки узла не удалось обнаружить узел ${finishObject.ip}. Проверьте имя узла и повторите попытку`

  }

  #extractCommand = ( string ) => {
    const match = string.match(/\b\w*\b/)
    const command = match ? match[0] : null
    return command 
  }

  #extractIP = ( string ) => {
    const match = string.match(/(\d+\.){3}\d+/)
    const ip = match ? match[0] : null
    return ip
  }
}

export default Cmd