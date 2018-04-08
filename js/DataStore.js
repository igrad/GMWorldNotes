const electron = require('electron');
const path = require('path');
const fs = require('fs');

function CreateNewNotebookID() {
   var nbPath = path.join((electron.app || electron.remote.app).getPath('userData'), "notebooks");

   fs.readdir(nbPath, (err, dir) => {
      try {
         dir.sort();
         dir.reverse();

         // Find the largest number and add one to it, then return it as a string
         var largestNum = parseInt(dir[0].substring(0, 4));
         return (largestNum += 1).toString().padStart(4, 0);
      } catch (error) {
         fs.mkdir(nbPath, function(dir) {
            console.log("Created notebook directory: " + nbPath);
         });
         return "0000";
      }
   });
}

function GetFilePath(type, identifier) {
   switch (type) {
      case 'session': {
         return path.join((electron.app || electron.remote.app).getPath('userData'),
         identifier + ".json")
      }
      case 'notebook': {
         // If no identifier is provided, it means that it's a new notebook
         // Find a suitable id for this new notebook
         if (identifier == null) { identifier = CreateNewNotebookID(); }

         console.log("Fetching notebook " + identifier);

         return path.join((electron.app || electron.remote.app).getPath('userData'),
         "notebooks/" + identifier + ".json")
      }
   }
}

function ParseDataFile(filePath, defaults) {
   try { return JSON.parse(fs.readFileSync(filePath)); }
   catch(error) { return defaults; }
}

class DataStore {
   constructor(type, identifier, defaults) {
      this.path = GetFilePath(type, identifier);
      console.log(type + " path " + this.path);

      this.data = ParseDataFile(this.path, defaults);
  }

   get(key) {
      return this.data[key];
   }

   set(key, val) {
      this.data[key] = val;

      try { fs.writeFileSync(this.path, JSON.stringify(this.data)); }
      catch(error) { console.log("ERROR: Could not write data to file at " + this.path
      + "\n" + error) }
   }
}
