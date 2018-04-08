let nodeTree = new Array();
let defaultNode = {
   id: "0-0",
   name: "node",
   associations: null,
   parent: null,
   children: null,
   data: null
}


/* Each "page" in the application is tied to a Node object. This contains all data
about the page. */
class TreeNode {
   constructor(jsonData) {
      if (jsonData == null) { jsonData = defaultNode; }

      // Identifier of this node, used to be referenced by other nodes
      // The format of the identifier is "DEPTH-NUM", where depth is, obviously
      // the depth of the object within the tree, and the num is just a number
      // assigned to the node.
      this.id = jsonData.id;

      // Name of this node
      this.name = jsonData.name;

      /* Each page is, of course, linked to other pages, but it is not always in a
      structured way. Just as a person can be tied to other people and to locations,
      those other people can be tied to their own people and locations, and it's far
      too difficult to track this in a single, structured tree. Thus, the links of a
      node detail these connections in a way that can be tracked. */
      this.associations = jsonData.associations;

      // Index of this node's parent, for navigation purposes.
      this.parent = jsonData.parent;

      // Indices of this node's children, for navigation purposes.
      this.children = jsonData.children;

      // The raw data of this page, which begins as a template.
      this.data = jsonData.data;
   }

   AddLink(otherNode) {
      if (this.links.includes(otherNode.id)) {
         return false;
      }

      this.links.push(otherNode.id);
      return true;
   }

   RemoveLink(otherNode) {
      if (this.links.includes(otherNode.id)) {
         this.links.remove(otherNode.id);
         return true;
      }
      return false;
   }

   AddChild(otherNode) {
      if (this.children.includes(otherNode.id)) {
         return false;
      }

      this.children.push(otherNode.id);
      return true;
   }

   RemoveChild(otherNode) {
      if (this.children.includes(otherNode.id)) {
         this.children.remove(otherNode.id);
         return true;
      }

      return false;
   }

   // Get the JSON representation of this node
   ConvertToJSON() {
      var jsondata = {};
      jsondata['id'] = this.id;
      jsondata['name'] = this.name;
      jsondata['type'] = this.type;
      jsondata['associations'] = this.associations;
      jsondata['parent'] = this.parent;
      jsondata['children'] = this.children;
      jsondata['data'] = this.data;

      return JSON.stringify(jsondata);
   }
}



class Tree {
   constructor (data) {
      nodeTree = new Array();

      if ((data.length == 0) || (data == null)) {
         var node = TreeNode();
         nodeTree.push(node);
      } else {
         for (var i = 0; i < data.length; i++) {
            var node = TreeNode(data[i]);
            nodeTree.push(node);
         }
      }
   }

   AddNodeToTree (newnode) {

   }

   GetNode (id) {

   }
}



let tree = new Array();
let root = new TreeNode('ROOT', 'ROOT', [], null, [], "");

tree.push(root);

function AddNodeToTree(node, parent) {
   if (parent == "ROOT") {
      root.AddChild(node)
   } else {
      if (tree.includes(parent)) {
         return false;
      } else {
         tree.push(node)
         parent.AddChild(node)
      }
   }
}
