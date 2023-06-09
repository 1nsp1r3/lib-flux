const Rxjs       = require("../lib/rxjs-7.8.1.min.js")
const LibGraph   = require("../lib/lib.graph.min.js")
const LibDate    = require("../lib/esp.lib.date.min.js")
const LibStorage = require("../lib/lib.storage.min.js")

//Unable to use rxjs from npm, the generate lib.flux.min.js is not usable :(
const Subject  = Rxjs.Subject
const tap      = Rxjs.tap
const mergeMap = Rxjs.mergeMap
const of       = Rxjs.of

class Flux{
  /**
   * Options: {
   *   id   : "temperature",
   *   title: "Température (°C)",
   *   graphValueformatter: (v) => v*1.852,
   * }
   */
  constructor(Options){
    this.id      = Options.id
    this.data    = LibStorage.loadObject(this.id)
    this.graph   = new LibGraph(
      `graph${this.#upperFirstLetter(this.id)}`, //canvas id
      Options.title,
    )
    this.graph.display()

    this.graphValueformatter = Options.graphValueformatter
    if (this.graphValueformatter == undefined) this.graphValueformatter = (v) => v

    this.subject = new Subject()
    this.subject
      .pipe(
        //tap((Value)      => console.log(this.id, Value)),
        mergeMap((Value) => this.#storeValue(Value)),
        mergeMap((Item)  => {
          this.#addGraphData(Item)
          return of(Item)
        }),
      )
      .subscribe()
  }

  pushValue(Value){
    this.subject.next(Value)
  }

  downloadCsv(HtmlLink){
    const list = LibStorage.loadObject(this.id)
    if (!list.length) throw 'Storage is empty'
    const filename = `${LibDate.dateFilename(list[0].ts)}_${LibDate.timeFilename(list[0].ts)}_${this.id}.csv`
    const header = `ts%2C${this.id}`

    let href = `data:text/csv,${header}%0A`
    for(const item of list){
      href += `${item.ts}%2C${item.value}%0A`
    }

    this.clearStorage()

    HtmlLink.href = href
    HtmlLink.download = filename
    HtmlLink.click()
  }

  clearGraph(){
    this.graph.chart.data.labels = []
    this.graph.chart.data.datasets[0].data = []
    this.graph.chart.update()
  }

  refreshGraph(){
    const list = LibStorage.loadObject(this.id)
    this.clearGraph()
    for(const item of list){
      this.#addGraphData(item)
    }
  }

  clearStorage(){
    this.data = []
    LibStorage.saveObject(this.id, this.data)
  }

  #storeValue(Value){
    const item = {
      ts   : Date.now(),
      value: Value,
    }
    this.data.push(item)
    LibStorage.saveObject(this.id, this.data)
    return of(item)
  }

  #addGraphData(Item){
    this.graph.addData({
      label: LibDate.time(Item.ts),
      value: this.graphValueformatter(Item.value),
    })
  }

  /**
   * Transform roi into Roi
   */
  #upperFirstLetter(Text){
    return Text.charAt(0).toUpperCase() + Text.slice(1)
  }
}

//CommonJS style
module.exports = Flux
