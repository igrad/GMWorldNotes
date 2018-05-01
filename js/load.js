// App version needs to be set here and in package.json
const appVersion = '0.0.1'

let sessionData
let notebookData

let lastRunTime = null
let lastRunVersion = null
let lastOpenNotebook = null
let lastOpenPage = null

let defaultSession = {
   LASTRUNTIME: null,
   LASTRUNVERSION: appVersion,
   LASTOPENNOTEBOOK: null,
   LASTOPENPAGE: "blank"
}



function LoadSession() {
   sessionData = new DataStore('session', 'session', defaultSession)

   sessionData.set("LASTRUNTIME", Date.now())

   lastRunTime = sessionData.get("LASTRUNTIME")
   lastRunVersion = sessionData.get("LASTRUNVERSION")
   lastOpenNotebook = sessionData.get("LASTOPENNOTEBOOK")
   lastOpenPage = sessionData.get("LASTOPENPAGE")

   console.log("=====SESSION DATA=====")
   console.log("Last run time: " + lastRunTime)
   console.log("Last run version: " + lastRunVersion)
   console.log("Last open notebook: " + lastOpenNotebook)
   console.log("Last open page: " + lastOpenPage)
   console.log("======================")
}

function SetLastOpenNoteBook (notebookID) {
   sessionData.set("LASTOPENNOTEBOOK", notebookID)
}

function SetLastOpenPage (pageID) {
   lastOpenPage = pageID
   sessionData.set("LASTOPENPAGE", pageID)
}

function LoadFileData (filepath) {
   const fs = require('fs')

   try {
      var dat = fs.readFileSync(filepath)
      return dat.toString()
   } catch(error) {
      console.log("Could not load file " + filepath)
   }
}
