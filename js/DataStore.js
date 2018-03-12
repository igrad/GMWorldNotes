const electron = require('electron');
const path = require('path');
const fs = require('fs');

// Data storage class courtesy of Cameron Nokes for Codeburst
// https://codeburst.io/how-to-store-user-data-in-electron-3ba6bf66bc1e

function parseDataFile(filePath, defaults) {
   try { return JSON.parse(fs.readFileSync(filePath)); }
   catch(error) { return defaults; }
}

class DataStore {
   constructor(opts) {
      const appDataPath = (electron.app || electron.remote.app).getPath('userData');

      this.path = path.join(userDataPath, opts.configName + '.json');

      this.data = parseDataFile(this.path, opts.defaults);
  }

   get(key) {
      return this.data[key];
   }

   set(key, val) {
      this.data[key] = val;

      try { fs.writeFileSync(this.path, JSON.stringify(this.data)); }
      catch { console.log("ERROR: Could not write data to file at " + this.path) }
   }
}

// expose the class
module.exports = DataStore;
