const cheerio = require('cheerio')
var fs = require('fs');

module.exports = exports = class SeoCheck {
  constructor() {
    this.output = '';
    this.outputMethod = 3;//default Console method
    this.$ = null;
    this.filePath = null;
    this.strongLimitCount = 15;
    this.H1_LIMIT_COUNT = 1;
  }
  async setFilePath(filePath) {
    var object = this;
    return new Promise(function(resolve, reject) {
      object.$ = cheerio.load(fs.readFileSync(filePath, "utf8"));
      resolve('success');
    });
  };
  async setReadableStream(stream) {
    var object = this;
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
          object.$ = cheerio.load(data);
          resolve('success');
        });
    });
  };
  hasAttribute(element, attribute) {
    var count = 1;
    var output = this.output;
    var object = this;
    object.$(element).each(function (i, elem) {
      if(!elem['attribs'][attribute]) {
        var $this = object.$(this);
        object.output += (count++) +' error: '+ object.$.html($this)+'\n';
      }
    });
  };

  rule1() {
    if(!this.$) {
      this.output ='please use setfilePath or setReadableStream';
      return;
    }
    this.output +='--- Start 1. Detect if any <img /> tag without alt attribute ---\n';
    this.hasAttribute('img', 'alt');
    this.output +='--- End 1. Detect if any <img /> tag without alt attribute ---\n';
  };

  rule2() {
    if(!this.$) {
      this.output ='please use setfilePath or setReadableStream\n';
      return;
    }
    this.output +='--- Start 2. Detect if any <a /> tag without rel attribute ---\n';
    this.hasAttribute('a', 'rel');
    this.output +='--- End 2. Detect if any <a /> tag without rel attribute ---\n';
  };

  rule3() {
    if(!this.$) {
      this.output +='please use setfilePath or setReadableStream\n';
      return;
    }
    this.output +='--- Start 3.1 Detect if header doesn’t have <title> tag ---\n';
    var titles = this.$('head title');
    if(titles.length == 0) {
      this.output +='error: header doesn’t have <title> tag\n';
    }
    this.output +='--- End 3.1 Detect if header doesn’t have <title> tag ---\n';

    this.output +='--- Start 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---\n';
    this.output +='--- Start 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag --- \n';

    //Ex: Checking <meta name=“robots” /> existing or not?!
    // add robots to metKes
    var metaKeys = ['descriptions', 'keywords'];
    var mapMetaKeys = new Map();
    metaKeys.forEach(function(key){
      mapMetaKeys.set(key, false);
    });
    this.$('head meta').each(function (i, elem) {
      if(mapMetaKeys.has(elem['attribs']['name'])) {
        mapMetaKeys.set(elem['attribs']['name'], true);
      }
    });
    var object = this;
    mapMetaKeys.forEach(function(exist, key){
      if(!exist) {
        object.output +='error: header doesn’t have <meta name="'+key+'" ... /> tag\n';
      }
    });
    this.output +='--- End 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---\n';
    this.output +='--- End 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag ---\n';
  };

  setStrongLimitCount(strongLimitCount) {
    if(!Number.isInteger(strongLimitCount)) {
      throw Error('strongLimitCount need integer');
    }
    if(strongLimitCount < 0) {
      throw Error('strongLimitCount need >= 0');
    }
    this.strongLimitCount = strongLimitCount;
  };

  rule4() {
    if(!this.$) {
      this.output +='please use setfilePath or setReadableStream\n';
      return;
    }
    this.output +='--- Start 4 Detect if there’re more than '+this.strongLimitCount+' <strong> tag in HTML \n';
    if(this.$('strong').length < this.strongLimitCount) {
      this.output +='error: there’re more than '+ this.strongLimitCount+' <strong> tag in HTML\n';
    }
    this.output +='--- End 4 Detect if there’re more than '+ this.strongLimitCount+' <strong> tag in HTML \n';
  };

  rule5() {
    if(!this.$) {
      this.output +='please use setfilePath or setReadableStream\n';
      return;
    }
    this.output +='--- Start 5 Detect if a HTML have more than one <H1> tag. ---\n';
    if(this.$('H1').length > this.H1_LIMIT_COUNT) {
      this.output +='error: HTML have more than one <H1> tag.\n';
    }
    this.output +='--- End 5 Detect if a HTML have more than one <H1> tag. ---\n';
  };

  rule(number) {
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

  check(inputCheckRules = '') {
    if(!this.$) {
      this.output ='please use setfilePath or setReadableStream\n';
      return;
    }
    this.output = '';

    const existRules = new Set(['1', '2', '3', '4', '5']);
    var inputCheckRulesArray = inputCheckRules.split(',');
    const setCheckRules = new Set();
    var checkRules = [];
    var object = this;
    inputCheckRulesArray.forEach(function(rule) {
      if(existRules.has(rule)) {
        setCheckRules.add(rule);
      } else {
        object.output += 'input error: rule='+rule+' not exist, rule has 1, 2, 3, 4, 5, example input is 1,2 for using rule 1 and 2\n';
      }
    });

    this.output += 'check rules: ';
    setCheckRules.forEach(function(checkRule) {
      object.output += checkRule +', ';
    });
    this.output = this.output.substring(0, this.output.length -2);
    this.output += '\n';
    setCheckRules.forEach(function(ruleNumber) {
        object.rule(ruleNumber);
    });
  };
  setOutputMethond(method, filePath = '') {
    const existOutputMethond = new Set([1, 2, 3]);
    if(existOutputMethond.has(method)) {
      if((method == 2 || method == 3) && filePath) {
        throw Error('Output 2(Node Writable Stream) or 3(Console), can not use filePath');
      }
      if(method == 1 && !filePath) {
        throw Error('filePath is Emtpy');
      } else {
        this.filePath = filePath;
        this.outputMethod = method;
      }
    }
  };
  getOutput() {
    if(!this.output) {
      return 'no output';
    }
    if (this.outputMethod == 1) {
      //TODO: check filePath is legal
      fs.writeFile(this.filePath, this.output, function(err) {
        if(err) {
          throw Error('create file error='+err);
          return ;
        }
      });
      return 'success';
    } else if (this.outputMethod == 2) {
      return 'this metod need discuss';
    } else if (this.outputMethod == 3) {
      console.log(this.output);
      return 'success';
    }
  };
};
