let sessionData
let notebookData

let lastRunTime = null;
let lastRunVersion = null;
let lastOpenNotebook = null;
let lastOpenPage = null;

let defaultSession = {
   LastRunTime: 'never',
   LastRunVersion: '0.0.1',
   LastOpenNotebook: '',
   LastOpenPage: ''
}



function LoadSession() {
   sessionData = new DataStore('session', 'session', defaultSession);

   sessionData.set("LastRunTime", "never");


   lastRunTime = sessionData.get("LastRunTime");
   lastRunVersion = sessionData.get("LastRunVersion");
   lastOpenNotebook = sessionData.get("LastOpenNotebook");
   lastOpenPage = sessionData.get("LastOpenPage");
}



function LoadPageToScreen(pathtopage) {
   console.log("Loading page");
   $("#content_view_iframe").attr("src", pathtopage);
   currentPage = pathtopage;
}



LoadSession();
notebookData = new Notebook(lastOpenNotebook);
LoadPageToScreen(lastOpenPage);
