import { interval } from "rxjs"
import Flux         from "../../dist/lib.flux.min.mjs"

const linkCsv = document.getElementById("csv")

const temperature = {
  canvas             : document.querySelector('div.temperature canvas[name="graph"]'),
  buttonDownload     : document.querySelector('div.temperature input[name="download"]'),
  buttonClearStorage : document.querySelector('div.temperature input[name="clearStorage"]'),
  checkboxLive       : document.querySelector('div.temperature input[name="live"]'),
}

const fluxTemperature = new Flux({
  id: "temperature",
  htmlCanvasElement: temperature.canvas,
  title: "Température (°C)",
})

interval(1000)
  .subscribe((Value) => {
    if (temperature.checkboxLive.checked) fluxTemperature.pushValue(Value)
  })

temperature.buttonDownload.addEventListener("click", async Event => {
  fluxTemperature.downloadCsv(linkCsv)
  fluxTemperature.clearGraph()
})

let clearConfirm = false
temperature.buttonClearStorage.addEventListener("click", async Event => {
  if (clearConfirm){
    fluxTemperature.clearStorage()
    fluxTemperature.clearGraph()
    temperature.buttonClearStorage.value = "Clear storage"
    clearConfirm = false
  }else{
    temperature.buttonClearStorage.value = "Sure ?"
    clearConfirm = true
  }
})
