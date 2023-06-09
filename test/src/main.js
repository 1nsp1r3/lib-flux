import { interval } from "rxjs"

const LibFlux = require("../../dist/lib.flux.min.js")

console.log("Bonjour :-)")

const linkCsv = document.getElementById("csv")

const temperature = {
  buttonDownload     : document.querySelector('div.temperature input[name="download"]'),
  buttonClearGraph   : document.querySelector('div.temperature input[name="clearGraph"]'),
  buttonRefreshGraph : document.querySelector('div.temperature input[name="refreshGraph"]'),
  buttonClearStorage : document.querySelector('div.temperature input[name="clearStorage"]'),
  checkboxLive       : document.querySelector('div.temperature input[name="live"]'),
}

const fluxTemperature = new LibFlux({
  id: "temperature",
  title: "Température (°C)",
})

fluxTemperature.refreshGraph()

interval(1000)
  .subscribe((Value) => {
    if (temperature.checkboxLive.checked) fluxTemperature.pushValue(Value)
  })

temperature.buttonDownload.addEventListener("click", async Event => fluxTemperature.downloadCsv(linkCsv))
temperature.buttonClearGraph.addEventListener("click", async Event => fluxTemperature.clearGraph())
temperature.buttonRefreshGraph.addEventListener("click", async Event => fluxTemperature.refreshGraph())
temperature.buttonClearStorage.addEventListener("click", async Event => fluxTemperature.clearStorage())
