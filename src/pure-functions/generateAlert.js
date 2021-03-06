export default function generateAlert (text) {
  console.warn(text)
  const error = document.querySelector(".error")
  error.textContent = text
  error.style.display = "inline-block"
  error.classList.add("active")

  setTimeout(removeError, 2000)
}

function removeError() {
  const error = document.querySelector(".error")

  error.classList.remove("active")
  setTimeout(() => {
    error.textContent = ''
    error.style.display = "none"
  }, 1000)

}