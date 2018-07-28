var fs = require('fs');
var SeoCheck = require( './seo.js' );

// demo 1
// 1. read from filepath
// 2. check rule 3, 4, 5
// 3. output 3 console
(async function() {
    SeoCheck.SeoCheck();
    await SeoCheck.setFilePath('test.html');
    SeoCheck.check('3,4,5');
    SeoCheck.setOutputMethond(2);
    console.log(SeoCheck.getOutput());
}());

// demo 2
// 1. read from readable stream
// 2. check rule 3, 4, 5
// 3. output A file (User is able to config the output destination)

// (async function() {
//     SeoCheck.SeoCheck();
//     const stream = fs.createReadStream('./writeable.html');
//     await SeoCheck.setReadableStream(stream);
//     SeoCheck.check('1,2,3,4,5');
//     SeoCheck.setOutputMethond(1, 'outPut.txt');
//     console.log(SeoCheck.getOutput());
// }());
