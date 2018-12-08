const rootNode = {
   id: "00000000",
   name: "ROOT",
   type: "page",
   associations: null,
   parent: null,
   children: [],
   data: "blank"
}



/* Each "page" in the application is tied to a Node object. This contains all data
about the page. */
class TreeNode {
   constructor(jsonData) {
      if (jsonData == 'page') {
         this.id = "00000001"
         this.name = "New Page"
         this.type = "page"
         this.associations = []
         this.parent = "00000000"
         this.children = []
         this.data = "blank"
      } else if (jsonData == 'folder') {
         this.id = "00000001"
         this.name = "New Folder"
         this.type = "folder"
         this.associations = []
         this.parent = "00000000"
         this.children = []
         this.data = null
      } else {
         // Identifier of this node, used to be referenced by other nodes
         // The format of the identifier is "DEPTH-NUM", where depth is, obviously
         // the depth of the object within the tree, and the num is just a number
         // assigned to the node.
         this.id = jsonData.id

         // Name of this node
         this.name = jsonData.name

         // Type of this node
         this.type = jsonData.type

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
   }

   AddAssociation(otherNode) {
      if (this.associations.includes(otherNode.id)) {
         return false
      }

      this.associations.push(otherNode.id)
      return true
   }

   RemoveAssociation(otherNode) {
      if (this.associations.includes(otherNode.id)) {
         this.associations.remove(otherNode.id)
         return true
      }
      return false
   }

   RemoveAllAssociations() {
      for (var i = 0; i < this.associations.length; i++) {
         (notebookData.GetNode(associations[i])).RemoveAssociation(this.id)
      }

      this.associations = []
   }

   AddChild(otherNodeID) {
      if (this.children.includes(otherNodeID)) {
         return false
      }

      this.children.push(otherNodeID)
      return true
   }

   RemoveChild(otherNodeID) {
      if (this.children.includes(otherNodeID)) {
         this.children.splice(this.children.indexOf(otherNodeID), 1)
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
      this.nodes = {}

      try {
         var rawJSON = JSON.parse(data)
         var nodeIDs = Object.keys(rawJSON.nodes)

         for (var i = 0; i < nodeIDs.length; i++) {
            this.nodes[nodeIDs[i]] = new TreeNode(rawJSON.nodes[nodeIDs[i]])
         }
      } catch (error) {
         this.nodes["00000000"] = new TreeNode(rootNode)
      }
   }

   GetNodeObject (id) {
      return this.nodes[id]
   }

   GetNodeDepth (id) {
      if (id == "00000000") { return 0 }
      else {
         var counter = 1
         var node = this.nodes[id]
         var iterNode = node

         while (iterNode.parent != "00000000") {
            counter++
            iterNode = this.nodes[iterNode.parent]
         }

         return counter
      }
   }

   CreateID () {
      // Generate an 8-digit hex number as the id
      while (true) {
         var randInt = Math.floor(Math.random() * 4294967294) + 1

         // Verify that the ID is not already in use
         if ((Object.keys(this.nodes)).includes(randInt)) {
            continue
         } else {
            return randInt.toString(16)
         }
      }
   }

   AddNode (newnode) {
      this.nodes[newnode.id] = newnode

      notebookData.UpdateDS()
   }

   AddNewNode (type, parent) {
      var node = new TreeNode(type)

      var newID = this.CreateID()
      node.parent = parent
      node.id = newID

      this.GetNodeObject(parent).AddChild(newID)
      this.AddNode(node)

      notebookData.UpdateDS()

      LoadNotebookToScreen(notebookData.id)

      return newID
   }

   DeleteNode (id) {
      try {
         var node = this.nodes[id]
         var parentID = node.parent
         var parent = this.nodes[node.parent]
         var children = this.nodes[id].children

         // Go through list of children and set their parent to be this node's parent
         for (var i = 0; i < children.length; i++) {
            this.nodes[children[i]].parent = parentID
         }

         // Go to the parent and add the new children to its list of children
         parent.children = parent.children.concat(children)

         // Remove from this node's parent's list of children
         this.nodes[parentID].RemoveChild(id)

         // Properly remove all 2-way associations
         node.RemoveAllAssociations()

         delete this.nodes[id]

         return true
      } catch (error) {
         console.log("Could not delete " + id + ": " + error)
         return false
      }
   }
}
