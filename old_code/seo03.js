const cheerio = require('cheerio')
var fs = require('fs');

function SeoCheck() {
  var output = null;
  var $ = null;
  this.setFilePath = async function setFilePath(filePath) {
    return new Promise(function(resolve, reject) {
      $ = cheerio.load(fs.readFileSync(filePath, "utf8"));
      resolve('success');
    });
  };
  this.setReadableStream = function setReadableStream(stream) {
    return new Promise(function(resolve, reject) {
        function streamToString(stream, cb) {
          const chunks = [];
          stream.on('data', (chunk) => {
            chunks.push(chunk.toString());
          });
          stream.on('end', () => {
            cb(chunks.join(''));
          });
        };
        streamToString(stream, (data) => {
          $ = cheerio.load(data);
          resolve('success');
        });
    });
  };
  this.hasAttribute = function hasAttribute(element, attribute) {
    var count = 1;
    $(element).each(function (i, elem) {
      if(!elem['attribs'][attribute]) {
        var $this = $(this);
        console.log((count++) +' error: '+ $.html($this));
      }
    });
  };

  this.rule1 = function rule1() {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    console.log('--- Start 1. Detect if any <img /> tag without alt attribute ---');
    this.hasAttribute('img', 'alt');
    console.log('--- End 1. Detect if any <img /> tag without alt attribute ---')
  };

  this.rule2 = function rule2() {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    console.log('--- Start 2. Detect if any <a /> tag without rel attribute ---');
    this.hasAttribute('a', 'rel');
    console.log('--- End 2. Detect if any <a /> tag without rel attribute ---');
  };

  this.rule3 = function rule3() {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    console.log('--- Start 3.1 Detect if header doesn’t have <title> tag ---');
    var titles = $('head title');
    if(titles.length == 0) {
      console.log('error: header doesn’t have <title> tag');
    }
    console.log('--- End 3.1 Detect if header doesn’t have <title> tag ---');

    console.log('--- Start 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---');
    console.log('--- Start 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag');
    var metaKeys = ['descriptions', 'keywords'];
    var mapMetaKeys = new Map();
    metaKeys.forEach(function(key){
      mapMetaKeys.set(key, false);
    });
    $('head meta').each(function (i, elem) {
      if(mapMetaKeys.has(elem['attribs']['name'])) {
        mapMetaKeys.set(elem['attribs']['name'], true);
      }
    });
    mapMetaKeys.forEach(function(exist, key){
      if(!exist) {
        console.log('error: header doesn’t have <meta name="'+key+'" ... /> tag')
      }
    });
    console.log('--- End 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---');
    console.log('--- End 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag');
  };

  var strongLimitCount = 15;
  this.rule4 = function rule4() {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    console.log('--- Start 4 Detect if there’re more than '+strongLimitCount+' <strong> tag in HTML ('+strongLimitCount+' is a value should be configurable by user) ');
    if($('strong').length < strongLimitCount) {
      console.log('error: there’re more than '+strongLimitCount+' <strong> tag in HTML');
    }
    console.log('--- End 4 Detect if there’re more than '+strongLimitCount+' <strong> tag in HTML ('+strongLimitCount+' is a value should be configurable by user) ');
  };

  var H1_LIMIT_COUNT = 1;
  this.rule5 = function rule5() {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    console.log('--- Start 5 Detect if a HTML have more than one <H1> tag. ---');
    if($('H1').length > H1_LIMIT_COUNT) {
      console.log('error: HTML have more than one <H1> tag.');
    }
    console.log('--- End 5 Detect if a HTML have more than one <H1> tag. ---');
  };
  this.rule = function rule(number) {
    if(number == 1) {
      this.rule1();
    } else if (number == 2) {
      this.rule2();
    } else if (number == 3) {
      this.rule3();
    } else if (number == 4) {
      this.rule4();
    } else if (number == 5) {
      this.rule5();
    };
  };
  //ex: inputCheckRules = 1,2,3
  this.check = async function check(inputCheckRules = '') {
    if(!$) {
      console.log('please use setfilePath or setReadableStream');
      return;
    }
    output = '';
    const existRules = new Set(['1', '2', '3', '4', '5']);
    var inputCheckRulesArray = inputCheckRules.split(',');
    const setCheckRules = new Set();
    var checkRules = [];

    inputCheckRulesArray.forEach(function(rule) {
      if(existRules.has(rule)) {
        setCheckRules.add(rule);
      } else {
        output += 'input error: rule='+rule+' not exist, rule has 1, 2, 3, 4, 5, example input is 1,2 for using rule 1 and 2\n';
      }
    });
    setCheckRules.forEach(function(ruleNumber) {
        this.rule(ruleNumber);
    }, this);
  }
}



(async function() {
    var seoCheck = new SeoCheck();
    // await seoCheck.setFilePath('test.html');
    const stream = fs.createReadStream('./writeable.html');
    await seoCheck.setReadableStream(stream);
    seoCheck.check('3,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,83,4,5,7,8');
}());
