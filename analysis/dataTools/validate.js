/**
 * Validate `parliaments.json` and `parties.json`.
 * Finds parties that exist in `parliaments.json` but not in `parties.json`.
 */

'use strict';

const parliaments = require('./parliaments.json');
const parties = require('./parties.json');

function findPartiesNotInDatabase(parliaments, parties) {
    parties = JSON.parse(JSON.stringify(parties)); // Deep copy for immutability
    let partiesNotInDb = [];
    for (let i in parliaments) {
        const parliament = parliaments[i];
        for (let partyName in parliament.parties) {
            if (!parties[partyName]) {
                parties[partyName] = true; // prevent duplicates
                partiesNotInDb.push({
                    parliamentIndex: i,
                    name: partyName,
                });
            }
        }
    }
    return partiesNotInDb;
}

module.exports = {
    start: function() {
        const partiesNotInDb = findPartiesNotInDatabase(parliaments, parties);
        if (partiesNotInDb.length > 0) {
            console.log(`Warning: ${partiesNotInDb.length} parties missing from database:`);
            for (let party of partiesNotInDb) {
                const partyName = party.name.split('').reverse().join(''); // Reverse because console is LTR
                console.log(`Parliament #${party.parliamentIndex}:\t${partyName}`);
            }
            return false;
        }
        return true;
    },
};
