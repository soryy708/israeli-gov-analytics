/**
 * Combine `parliaments.json` and `parties.json` in to a `.js` file
 * such that each is a global variable.
 */

'use strict';

const parliaments = require('./parliaments.json');
const parties = require('./parties.json');
const validate = require('./validate');
const fs = require('fs');

const outputFile = '../data.js';

if(validate.start()) { // Validation passed successfully
    fs.writeFileSync(outputFile, `var parliaments=${JSON.stringify(parliaments)};var parties=${JSON.stringify(parties)}`);
}
