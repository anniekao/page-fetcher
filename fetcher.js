const args = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const promptCreateFile = (filePath, body) => {
  rl.question("Create file? (Y/N)", answer => {
    if (answer === "Y") {
      writeToFile(filePath, body);
    } else {
      console.log("File has not been created. Terminating...");
    }
    rl.close();
  });
}

const writeToFile = (filePath, body) => {
  fs.writeFile(filePath, body, err => {
    if (err) throw err;
    const size = fs.statSync(filePath).size;
    console.log(`Downloaded and saved ${size} bytes to ${filePath}`);
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
    if (response && response.statusCode > 200 || response && response.statusCode < 200) {
      console.log('Status code: ', response.statusCode);
      console.log('Terminating...');
      process.exit();
    } else if (error) {
      console.log('Error! ', error);
      console.log('Terminating...');
      process.exit();
    } else if (fs.existsSync(filePath)) {
      promptOverwrite(filePath, body);
    } else {
      promptCreateFile(filePath, body);
    }
  });

};

fetcher(args);

