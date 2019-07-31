const args = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeToFile = (filePath, body) => {
  fs.writeFile(filePath, body, err => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

const promptOverwrite = (filePath, body) => {
  rl.question('Overwrite existing file? (Y/N)', answer => {
    if (answer === 'Y') {
      writeToFile(filePath, body);
    } else {
      console.log('File has not been overwritten.');
    }
    rl.close();
  });
};

const fetcher = (args) => {
  const src = args[0];
  const filePath = args[1];
  request(src, (error, response, body) => {
    if (fs.existsSync(filePath)) {
      promptOverwrite(filePath, body);
    } else {
      writeToFile(filePath, body);
    }
  });

};

fetcher(args);