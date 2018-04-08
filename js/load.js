// App version needs to be set here and in package.json
const appVersion = '0.0.1';

let sessionData
let notebookData

let lastRunTime = null;
let lastRunVersion = null;
let lastOpenNotebook = null;
let lastOpenPage = null;

let defaultSession = {
   LastRunTime: null,
   LastRunVersion: appVersion,
   LastOpenNotebook: null,
   LastOpenPage: null
}



function LoadSession() {
   sessionData = new DataStore('session', 'session', defaultSession);

   sessionData.set("LastRunTime", Date.now());

   lastRunTime = sessionData.get("LastRunTime");
   lastRunVersion = sessionData.get("LastRunVersion");
   lastOpenNotebook = sessionData.get("LastOpenNotebook");
   lastOpenPage = sessionData.get("LastOpenPage");
}


function LoadNotebookToScreen() {

   // TODO: Wrap all of this in a try-catch

   // Order of events
   // 1. Load the theme of the notebook onto screen
   // 2. Load the nodes into tree view

   // Load the theme of the notebook onto screen
   // Get the currently-loaded theme's outer HTML string
   var linkTheme = $("#link_theme")[0];
   var linkThemeText = linkTheme.outerHTML;

   // Isolate just the file name of the current theme
   var currentTheme = linkThemeText.substring((linkThemeText.indexOf("/") + 1), (linkThemeText.indexOf(".css")));

   // Replace the current theme with the new theme of notebook being loaded
   linkTheme.outerHTML = linkThemeText.replace(currentTheme, notebookData.theme);


   // Load the nodes into the tree view
   // Get the tree view object
   var treeView = $("#tree_view");


   // Clear out the existing contents

   // Traverse the linked list/binary tree in order and build each node in memory
   // While doing this, also add each label into the content view

   // Make sure that there's a setting for how far each tab is indented. This should be included in the global style settings as well as in the theme, because the tree view font may be different for different notebooks, and people might want to adjust that tab distance.
}



function LoadPageToScreen(pathtopage) {
   console.log("Loading page");
   $("#content_view_iframe").attr("src", pathtopage);
   currentPage = pathtopage;
}



LoadSession();
notebookData = new Notebook(lastOpenNotebook);

LoadNotebookToScreen()
LoadPageToScreen(lastOpenPage);
