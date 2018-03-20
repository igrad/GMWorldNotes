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

let defaultNotebook = {
   name: "Default Notebook",
   initTime: (new Date).toDateString(),
   nodeCount: 0,
   rootNode: root.ConvertToJSON(),
   nodesJSON: {}
}

class Notebook {
   constructor (identifier) {
      if (identifier != null) {
         GetFilePath('notebook', identifier)

         ParseDataFile(this.path, defaultNotebook);
      } else {
         this.name = defaultNotebook.name;
         this.initTime = defaultNotebook.initTime;
         this.nodeCount = defaultNotebook.nodeCount
         this.rootNode = defaultNotebook.rootNode
         this.nodesJSON = defaultNotebook.nodesJSON
      }
   }

   LoadFromFile() {
      console.log("Loading notebook " + this.name + " from file");

      notebookData = new DataStore('notebook', notebookID, defaultNotebook)
      this.name = notebookData.get("Name");
      this.initTime = notebookData.get("initTime");
      this.nodeCount = notebookData.get("nodeCount");
      this.rootNodeJSON = notebookData.get("rootNode");
      this.nodesJSON = notebookData.get("nodesJSON");
   }
}
