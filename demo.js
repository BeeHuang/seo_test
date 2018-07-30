var fs = require('fs');
var SeoCheck = require( './seo.js' );



// demo 1
// 1. read from filepath
// 2. set StringLimitCount = 3
// 2. check rule 3, 4, 5 and with one error rule 10
// 3. output 3 console
(async function() {
    const seoCheck = new SeoCheck();
    await seoCheck.setFilePath('test.html');
    seoCheck.setStrongLimitCount(3);
    seoCheck.check('3,4,5,10');
    seoCheck.setOutputMethond(3);
    console.log(seoCheck.getOutput());
}());

// demo 2
// 1. read from readable stream
// 2. check rule 1,2,3, 4, 5
// 3. output A file (User is able to config the output destination)

// (async function() {
//     const seoCheck = new SeoCheck();
//     const stream = fs.createReadStream('./writeable.html');
//     await seoCheck.setReadableStream(stream);
//     seoCheck.check('1,2,3,4,5');
//     seoCheck.setOutputMethond(1, 'outPut.txt');
//     console.log(seoCheck.getOutput());
// }());
