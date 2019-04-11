/**
 * Scrape the Knessets website for data regarding the various Knessets in history.
 * This creates a file called `parliaments.json`, which contains an ordered array of objects,
 * each representing a Knesset from Israels history.
 * This tool gathers data only about the names of the parties in each Knesset, how many votes they had,
 * how many mandates they had, and how many seats they had in the end.
 */

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');

const firstKnesset = 0;
const lastKnesset = 20;
let currentIndex = 0;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const parliaments = [];

    for (let i = firstKnesset; i < lastKnesset; ++i) {
        currentIndex = i;
        const scrapeUrl = `https://m.knesset.gov.il/About/History/Pages/FactionHistory${i+1}.aspx`;
        const selector = {};
        selector.contentContainer = '.GeneralRightSection';
        selector.contentTable = selector.contentContainer + ' .ms-rtestate-field table[dir="ltr"]';
        selector.data    = selector.contentTable + ' td';
        selector.headers = selector.contentTable + ' th';
        
        console.log(`[${i+1}/${lastKnesset}]: Now scraping ${scrapeUrl}`);
        await page.goto(scrapeUrl);
        let tableCells     = await page.$$eval(selector.data,    (tds) => tds.map((td) => td.innerHTML));
        const tableHeaders = await page.$$eval(selector.headers, (ths) => ths.map((th) => th.innerHTML));
        
        // Ideally, there shouldn't be any header cells in `tableCells`
        // However, some pages don't put the header in a `<th>` tag, instead putting it in a `<td>`
        // If there are not enough in `tableHeaders`, the difference is inside `tableCells`; which we must remove
        const expectedHeaderCells = 4;
        const taintedCells = expectedHeaderCells - tableHeaders.length;
        tableCells = tableCells.splice(taintedCells); // Remove headers
        while (tableCells.length % 4 != 0) { // Remove comments section if exists
            tableCells.pop();
        }

        for (let j = 0; j < tableCells.length; ++j) {
            if (j % 4 == 3) {
                // In a name field
                const parts = tableCells[j].split('>');
                if (parts[0] != tableCells[j]) { // There are HTML tags inside
                    tableCells[j] = parts[1].split('<')[0];
                }
            }
        }

        const parliament = {};
        parliament.parties = {};
        for (let j = 0; j < tableCells.length; j += 4) {
            const endSeats = tableCells[j + 0];
            const mandates = tableCells[j + 1];
            const votersPercent = tableCells[j + 2];
            const name = tableCells[j + 3].trim().replace('”', '"');

            if (!name.startsWith('ח"כ יחיד')) {
                // Single ח"כ is not a party. Add only if a party.

                parliament.parties[name] = {
                    votersPercent: Number(votersPercent != '-' ? votersPercent : 0),
                    mandates:      Number(mandates      != '-' ? mandates      : 0),
                    endSeats:      Number(endSeats      != '-' ? endSeats      : 0),
                };
            }
        }
        parliaments.push(parliament);
    }
    
    fs.writeFileSync('parliaments.json', JSON.stringify(parliaments, null, 4));
})().then(() => {
    console.log('All done!');
}).catch((err) => {
    console.log('Error on knesset index #', currentIndex);
    console.log(err);
});
