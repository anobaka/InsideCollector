const fs = require('fs'),
  http = require('http'),
  https = require('https');
const path = require('path');
const env = process.env.ENV || 'dev';

// This method will be refactoring.
function generateSdk(swaggerJsonUrl, outputDir) {
  console.log(`Generating SDK: ${swaggerJsonUrl}`);
  // console.log(`outputFile: ${outputFile}`);
  // const dir = outputFile.substring(0, outputFile.lastIndexOf(path.sep) + 1);
  // console.log(`dir: ${dir}`)
  const requestInvoker = swaggerJsonUrl.startsWith('http://') ? http : https;
  const constantUrl = `${new URL(swaggerJsonUrl).origin}/api/constant`;
  requestInvoker.get(constantUrl, (response) => {
    if (response.statusCode == 200) {
      const jsonFilename = path.join(outputDir, './constants.ts');
      const file = fs.createWriteStream(jsonFilename);
      const stream = response.pipe(file);
      stream.on('finish', () => {
        console.log(`Constants generated: ${constantUrl}`);
      });
    }
  });
}

let host = 'http://localhost:5077';
generateSdk(`${host}/internal-doc/swagger/v1/swagger.json`, __dirname);
