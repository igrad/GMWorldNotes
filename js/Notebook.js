// Notebook json files are structured rigidly to provide information about the
// notebook itself, as well as the nodes within it. The JSON representation of this
// is defined below:
// name (string): The name of the node
// initTime (string): The time and date that this notebook was created
// theme (string): Theme used for this notebook
// nodeCount (int): The number of folders and pages contained within this notebook
// nodes (array): JSON representation of all nodes contained within this notebook,
//    excluding the raw HTML data that is stored in another file. This JSON data only
//    holds strings that point to the HTML file names.

let defaultNotebook = {
   id: "0000",
   name: "Default Notebook",
   initTime: (new Date).toDateString(),
   theme: "default_dark",
   nodeCount: 0,
   nodesJSON: new Object()
}

class Notebook {
   constructor (identifier) {
      console.log("Loading notebook " + identifier + " from file")

      // Create DataStore to fetch data from file in notebook folder
      this.dat = new DataStore('notebook', identifier, defaultNotebook)
      this.id = this.dat.get("id")
      this.name = this.dat.get("name")
      this.initTime = this.dat.get("initTime")
      this.theme = this.dat.get("theme")
      this.nodeCount = this.dat.get("nodeCount")
      this.nodesJSON = this.dat.get("nodesJSON")

      this.nodeTree = new Tree(this.nodesJSON)
   }

   GetNodeTreeJSONString () {
      this.nodesJSON = JSON.stringify(this.nodeTree)
      return this.nodesJSON
   }

   UpdateDS () {
      // Update JSON structure of tree nodes
      this.GetNodeTreeJSONString()
      this.nodeCount = (Object.keys(this.nodeTree)).length

      this.dat.set("id", this.id)
      this.dat.set("name", this.name)
      this.dat.set("initTime", this.initTime)
      this.dat.set("theme", this.theme)
      this.dat.set("nodeCount", this.nodeCount)
      this.dat.set("nodesJSON", this.nodesJSON)
   }

   GetNode (id) {
      return this.nodeTree.GetNodeObject(id)
   }
}
