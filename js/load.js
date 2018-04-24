// App version needs to be set here and in package.json
const appVersion = '0.0.1'

let sessionData
let notebookData

let lastRunTime = null
let lastRunVersion = null
let lastOpenNotebook = null
let lastOpenPage = null

let defaultSession = {
   LastRunTime: null,
   LastRunVersion: appVersion,
   LastOpenNotebook: null,
   LastOpenPage: "blank"
}



function LoadSession() {
   sessionData = new DataStore('session', 'session', defaultSession)

   sessionData.set("LastRunTime", Date.now())

   lastRunTime = sessionData.get("LastRunTime")
   lastRunVersion = sessionData.get("LastRunVersion")
   lastOpenNotebook = sessionData.get("LastOpenNotebook")
   lastOpenPage = sessionData.get("LastOpenPage")
}

function SetLastOpenNoteBook (notebookID) {
   sessionData.set("lastOpenNotebook", notebookID)
}

function SetLastOpenPage (pageID) {
   sessionData.set("lastOpenPage", pageID)
}
