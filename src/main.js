import { Subject, tap, mergeMap, of } from "rxjs"
import Graph                          from "../lib/lib.graph.min.mjs"
import Storage                        from "../lib/lib.storage.min.mjs"

class Flux{
  /**
   * Options: {
  *    id                 : "temperature",
   *   htmlCanvasElement  : document.getElementById("canvasId"),
   *   title              : "Température (°C)",
   *   graphValueformatter: (v) => v*1.852,
   * }
   */
  constructor(Options){
    this.id = Options.id

    /**
     * GRAPH
     */
    this.graph = new Graph(
      Options.htmlCanvasElement,
      Options.title,
    )

    this.graphValueformatter = Options.graphValueformatter
    if (this.graphValueformatter == undefined) this.graphValueformatter = (v) => v

    //If data already present, display them on the graph
    this.data = Storage.loadObject(this.id)
    for(const item of this.data){
      this.#addGraphData(item)
    }

    /**
     * RXJS
     */
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
    const list = Storage.loadObject(this.id)
    if (!list.length) throw 'Storage is empty'
    const filename = this.#generateFileName(list[0].ts)
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

  clearStorage(){
    this.data = []
    Storage.saveObject(this.id, this.data)
  }

  #storeValue(Value){
    const item = {
      ts: Date.now(),
      value: Value,
    }
    this.data.push(item)
    Storage.saveObject(this.id, this.data)
    return of(item)
  }

  #addGraphData(Item){
    this.graph.addData({
      x: Item.ts,
      y: this.graphValueformatter(Item.value),
    })
  }

  /**
   * Return "20230629_145426_temperature.csv"
   */
  #generateFileName(Now){
    const now = new Date(Now)
    const year = now.getFullYear().toString()
    const month = (now.getMonth()+1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const date = `${year}${month}${day}` //"20230629" for 06/29/2023

    const hh = now.getHours().toString().padStart(2, "0")
    const mm = now.getMinutes().toString().padStart(2, "0")
    const ss = now.getSeconds().toString().padStart(2, "0")
    const time = `${hh}${mm}${ss}` //"145426" for 14h54 26s

    return `${date}_${time}_${this.id}.csv`
  }
}

export default Flux
