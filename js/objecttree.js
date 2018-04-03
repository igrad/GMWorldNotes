/* Each "page" in the application is tied to a Node object. This contains all data
about the page. */
class TreeNode {
   constructor(name, type, associations, parent, children, data = null) {
      /********************************************************************************
      * Publicly Accessible Properties                                                *
      ********************************************************************************/
      // Name of this node
      this.name = name;

      /* Each page is, of course, linked to other pages, but it is not always in a
      structured way. Just as a person can be tied to other people and to locations,
      those other people can be tied to their own people and locations, and it's far
      too difficult to track this in a single, structured tree. Thus, the links of a
      node detail these connections in a way that can be tracked. */
      this.associations = associations;

      // Index of this node's parent, for navigation purposes.
      this.parent = parent;

      // Indices of this node's children, for navigation purposes.
      for (var i = 0; i < children.length; i++) {
         this.AddChild(children[i]);
      }

      // The raw data of this page, which begins as a template.
      this.data = data;
   }


   AddLink(othernode) {
      if (this.links.includes(othernode)) {
         return false;
      }

      this.links.push(othernode);
      return true;
   }


   RemoveLink(othernode) {
      if (this.links.includes(othernode)) {
         this.links.remove(othernode);
         return true;
      }
      return false;
   }


   AddChild(othernode) {
      if (this.children.includes(othernode)) {
         return false;
      }

      this.children.push(othernode);
      return true;
   }


   RemoveChild(othernode) {
      if (this.children.includes(othernode)) {
         this.children.remove(othernode);
         return true;
      }

      return false;
   }


   // Get the JSON representation of this node
   ConvertToJSON() {
      var jsondata = {};
      jsondata['name'] = this.name;
      jsondata['type'] = this.type;
      jsondata['associations'] = this.associations;
      jsondata['parent'] = this.parent;
      jsondata['children'] = this.children;
      jsondata['data'] = this.data;

      return JSON.stringify(jsondata);
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
