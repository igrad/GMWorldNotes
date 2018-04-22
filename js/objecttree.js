let nodeTree = new Array()
let rootNode = {
   id: "0-0",
   name: "ROOT",
   associations: null,
   parent: null,
   children: [],
   data: "blank"
}
let defaultPage = {
   id: "1-0",
   name: "New Page",
   associations: null,
   parent: "0-0",
   children: [],
   data: "blank"
}
let defaultFolder = {
   id: "1-0",
   name: "New Folder",
   associations: null,
   parent: "0-0",
   children: [],
   data: null
}




/* Each "page" in the application is tied to a Node object. This contains all data
about the page. */
class TreeNode {
   constructor(jsonData) {
      // Identifier of this node, used to be referenced by other nodes
      // The format of the identifier is "DEPTH-NUM", where depth is, obviously
      // the depth of the object within the tree, and the num is just a number
      // assigned to the node.
      this.id = jsonData.id

      // Name of this node
      this.name = jsonData.name

      /* Each page is, of course, linked to other pages, but it is not always in a
      structured way. Just as a person can be tied to other people and to locations,
      those other people can be tied to their own people and locations, and it's far
      too difficult to track this in a single, structured tree. Thus, the links of a
      node detail these connections in a way that can be tracked. */
      this.associations = jsonData.associations

      // Index of this node's parent, for navigation purposes.
      this.parent = jsonData.parent

      // Indices of this node's children, for navigation purposes.
      this.children = jsonData.children

      // The raw data of this page, which begins as a template.
      this.data = jsonData.data
   }

   AddLink(otherNode) {
      if (this.links.includes(otherNode.id)) {
         return false
      }

      this.links.push(otherNode.id)
      return true
   }

   RemoveLink(otherNode) {
      if (this.links.includes(otherNode.id)) {
         this.links.remove(otherNode.id)
         return true
      }
      return false
   }

   AddChild(otherNodeID) {
      if (this.children.includes(otherNodeID)) {
         return false
      }

      this.children.push(otherNodeID)
      return true
   }

   RemoveChild(otherNode) {
      if (this.children.includes(otherNode.id)) {
         this.children.remove(otherNode.id)
         return true
      }

      return false
   }

   // Get the JSON representation of this node
   ConvertToJSON() {
      var jsondata = {}
      jsondata['id'] = this.id
      jsondata['name'] = this.name
      jsondata['type'] = this.type
      jsondata['associations'] = this.associations
      jsondata['parent'] = this.parent
      jsondata['children'] = this.children
      jsondata['data'] = this.data

      return JSON.stringify(jsondata)
   }
}



class Tree {
   constructor (data) {
      this.nodeTree = {}

      if ((data == null) || (data.length == 0)) {
         this.nodeTree["0-0"] = new TreeNode(rootNode)
      } else {
         for (var i = 0; i < data.length; i++) {
            var node = TreeNode(data[i])
            this.nodeTree[node.id] = node
         }
      }
   }

   GetNodeObject (id) {
      if (typeof(id) == "string") {
         return this.nodeTree[id]
      } else if (typeof(id) == "object") {
         return this.nodeTree[id.id]
      }
   }

   GetBreadth (depth) {
      depth = depth.toString()
      var keys = Object.keys(this.nodeTree)
      var depthKeys = []

      console.log("keys is of type " + typeof(keys))

      for (var i = 0; i < keys.length; i++) {
         console.log(i + ": " + keys[i])
      }

      for (var i = 0; i < keys.length; i++) {
         var key = keys[i]
         var keyDepth = key.substring(0, key.indexOf("-"))
         console.log("key is " + key)
         console.log("keydepth is " + keyDepth)
         if (keyDepth == depth) {
            depthKeys.push(key)
            console.log("Key appended")
         }
      }

      console.log("nodetree is " + this.nodeTree + ", depth is " + depth + ", keys is " + keys + ", breadth is " + depthKeys)

      return depthKeys
   }

   CreateID (depth) {
      var hNeighbors = this.GetBreadth(depth)
      var hNeighborPos = []
      for (var n in hNeighbors) {
         var pos = parseInt(n.substring(n.indexOf("-") + 1))

         hNeighborPos.push(pos)
      }

      hNeighborPos.sort()
      console.log("hNeighborPos is " + hNeighborPos + ", len " + hNeighborPos.length)
      var newPos = 0
      if ((hNeighborPos != null) && (hNeighborPos.length >= 1)) {
         newPos = hNeighborPos[hNeighborPos.length - 1] + 1
         console.log("Edited newPos is " + newPos)
      }
      console.log("newPos is " + newPos)
      return depth + "-" + newPos
   }

   AddNode (newnode) {
      this.nodeTree[newnode.id] = newnode

      console.log("Adding new node: " + newnode.toString())

      notebookData.UpdateDS()
   }

   AddNewNode (type, depth) {
      var node = null
      if (type == "page") {
         node = new TreeNode(defaultPage)
      }
      else if (type == "folder") {
         node = new TreeNode(defaultFolder)
      }

      var newID = this.CreateID(depth)
      node.id = newID
      this.GetNodeObject(node.parent).AddChild(newID)
      this.AddNode(node)

      notebookData.UpdateDS()
   }
}
