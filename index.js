var SeoCheck = require( './seo.js' );
var fs = require('fs');

(async function() {
    SeoCheck.SeoCheck();
    console.log(SeoCheck)
    SeoCheck.setOutputMethond(1, 'testOutput01.txt');
    // await SeoCheck.setFilePath('test.html');
    const stream = fs.createReadStream('./writeable.html');
    await SeoCheck.setReadableStream(stream);
    SeoCheck.check('3,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,8');
    console.log(SeoCheck.getOutput());
}());
