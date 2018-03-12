function LoadSession() {
   var sessionJSON = require("../session.json");

   lastRunTime = sessionJSON.LastRunTime;
   lastRunVersion = sessionJSON.LastRunVersion;
   lastOpenNotebook = sessionJSON.LastOpenNotebook;
   lastOpenPage = sessionJSON.LastOpenPage;
}



function LoadNotebook(pathtonotebook) {
   console.log("Loading notebook");
   // Notebook json files are structured rigidly to provide information about the
   // notebook itself, as well as the nodes within it. The JSON representation of this
   // is defined below:
   // name (string): The name of the node
   // initTime (string): The time and date that this notebook was created
   // nodeCount (int): The number of folders and pages contained within this notebook
   // rootNode (object): JSON representation of the root node of this notebook
   // nodes (array): JSON representation of all nodes contained within this notebook,
   //    excluding the raw HTML data that is stored in another file. This JSON data only
   //    holds strings that point to the HTML file names.
   var nbJSON = require(pathtonotebook);
   var name = nbJSON.name;
   var initTime = nbJSON.initTime;
   var nodeCount = nbJSON.nodeCount;
   var rootNodeJSON = nbJSON.rootNode;
   var nodesJSON = nbJSON.nodesJSON;
}



function LoadPage(pathtopage) {
   console.log("Loading page");
   $("#content_view_iframe").attr("src", pathtopage);
   currentPage = pathtopage;
}



const DataStore = require('DataStore.js');
const DS = new DataStore({
   configName: 'session',
   defaults: {
      LastRunTime: 'never',
      LastRunVersion: '0.0.1',
      LastOpenNotebook: '',
      LastOpenPage: ''
   }
});



let lastRunTime = null;
let lastRunVersion = null;
let lastOpenNotebook = null;
let lastOpenPage = null;

LoadSession();
LoadNotebook(lastOpenNotebook);
LoadPage(lastOpenPage);
