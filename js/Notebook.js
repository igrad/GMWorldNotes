// Notebook json files are structured rigidly to provide information about the
// notebook itself, as well as the nodes within it. The JSON representation of this
// is defined below:
// name (string): The name of the node
// initTime (string): The time and date that this notebook was created
// theme (string): Theme used for this notebook
// nodeCount (int): The number of folders and pages contained within this notebook
// rootNode (object): JSON representation of the root node of this notebook
// nodes (array): JSON representation of all nodes contained within this notebook,
//    excluding the raw HTML data that is stored in another file. This JSON data only
//    holds strings that point to the HTML file names.

let defaultNotebook = {
   name: "Default Notebook",
   initTime: (new Date).toDateString(),
   theme: "default_dark",
   nodeCount: 0,
   rootNode: root.ConvertToJSON(),
   nodesJSON: {}
}

class Notebook {
   constructor (identifier) {
      if (identifier != null) {
         console.log("Loading notebook " + this.name + " from file");

         var dat = new DataStore('notebook', this.notebookID, defaultNotebook)
         this.name = dat.get("Name");
         this.initTime = dat.get("initTime");
         this.theme = dat.get("theme");
         this.nodeCount = dat.get("nodeCount");
         this.rootNodeJSON = dat.get("rootNode");
         this.nodes = dat.get("nodesJSON");
      } else {
         this.name = defaultNotebook.name;
         this.initTime = defaultNotebook.initTime;
         this.theme = defaultNotebook.theme;
         this.nodeCount = defaultNotebook.nodeCount;
         this.rootNode = defaultNotebook.rootNode;
         this.nodesJSON = defaultNotebook.nodesJSON;

         this.nodes = []
      }
   }

}
