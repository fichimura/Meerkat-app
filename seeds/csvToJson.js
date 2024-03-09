// The netflix_titles.csv is from kaggle
//https://www.kaggle.com/datasets/shivamb/netflix-shows
const fs = require('fs');
const csv = require('csv-parser');

const inputFilePath = 'netflix_titles.csv';
const outputFilePath = 'examples.json';

const rows = [];

fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
        rows.push(row);
    })
    .on('end', () => {
        fs.writeFileSync(outputFilePath, JSON.stringify(rows, null, 2));
        console.log('Conversion completed. JSON file saved at', outputFilePath);
    });
