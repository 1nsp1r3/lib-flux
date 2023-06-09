import { interval } from "rxjs"

const LibFlux = require("../../dist/lib.flux.min.js")

console.log("Bonjour :-)")

const buttonDownloadTemperature = document.getElementById("downloadTemperature")
const linkCsv                   = document.getElementById("csv")

const fluxTemperature = new LibFlux({
  id: "temperature",
  title: "Température (°C)",
})

interval(1000)
  .subscribe((Value) => {
    fluxTemperature.pushValue(Value)
  })

buttonDownloadTemperature.addEventListener("click", async Event => fluxTemperature.downloadCsv(linkCsv))
