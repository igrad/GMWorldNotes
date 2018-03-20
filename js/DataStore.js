const electron = require('electron');
const path = require('path');
const fs = require('fs');

// Data storage class basis courtesy of Cameron Nokes for Codeburst
// https://codeburst.io/how-to-store-user-data-in-electron-3ba6bf66bc1e

function GetFilePath(type, identifier) {
   switch (type) {
      case 'session': {
         return path.join((electron.app || electron.remote.app).getPath('userData'),
         identifier + ".json")
      }
      case 'notebook': {
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
