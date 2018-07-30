const cheerio = require('cheerio')
var fs = require('fs');

module.exports = {
  SeoCheck : function (){
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
    var output = null;
    var outputMethod = 3;//default Console method
    var $ = null;
    var filePath = null;
    var strongLimitCount = 15;
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
          output = (count++) +' error: '+ $.html($this);
        }
      });
    };

    this.rule1 = function rule1() {
      if(!$) {
        this.output +='please use setfilePath or setReadableStream\n';
        return;
      }
      this.output +='--- Start 1. Detect if any <img /> tag without alt attribute ---\n';
      this.hasAttribute('img', 'alt');
      this.output +='--- End 1. Detect if any <img /> tag without alt attribute ---\n';
    };

    this.rule2 = function rule2() {
      if(!$) {
        this.output +='please use setfilePath or setReadableStream\n';
        return;
      }
      this.output +='--- Start 2. Detect if any <a /> tag without rel attribute ---\n';
      this.hasAttribute('a', 'rel');
      this.output +='--- End 2. Detect if any <a /> tag without rel attribute ---\n';
    };

    this.rule3 = function rule3() {
      if(!$) {
        this.output +='please use setfilePath or setReadableStream\n';
        return;
      }
      this.output +='--- Start 3.1 Detect if header doesn’t have <title> tag ---\n';
      var titles = $('head title');
      if(titles.length == 0) {
        this.output +='error: header doesn’t have <title> tag\n';
      }
      this.output +='--- End 3.1 Detect if header doesn’t have <title> tag ---\n';

      this.output +='--- Start 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---\n';
      this.output +='--- Start 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag --- \n';
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
          this.output +='error: header doesn’t have <meta name="'+key+'" ... /> tag\n';
        }
      });
      this.output +='--- End 3.2 Detect if header doesn’t have <meta name=“descriptions” ... /> tag ---\n';
      this.output +='--- End 3.3 Detect if header doesn’t have <meta name=“keywords” ... /> tag ---\n';
    };
    this.setStrongLimitCount = function setStrongLimitCount(strongLimitCount) {
      if(!Number.isInteger(strongLimitCount)) {
        throw Error('strongLimitCount need integer');
      }
      if(strongLimitCount < 0) {
        throw Error('strongLimitCount need >= 0');
      }
      this.strongLimitCount = strongLimitCount;
    };
    this.rule4 = function rule4() {
      if(!$) {
        this.output +='please use setfilePath or setReadableStream\n';
        return;
      }
      console.log('strongLimitCount='+strongLimitCount);
      this.output +='--- Start 4 Detect if there’re more than '+this.strongLimitCount+' <strong> tag in HTML \n';
      if($('strong').length < this.strongLimitCount) {
        this.output +='error: there’re more than '+ this.strongLimitCount+' <strong> tag in HTML\n';
      }
      this.output +='--- End 4 Detect if there’re more than '+ this.strongLimitCount+' <strong> tag in HTML \n';
    };

    var H1_LIMIT_COUNT = 1;
    this.rule5 = function rule5() {
      if(!$) {
        this.output +='please use setfilePath or setReadableStream\n';
        return;
      }
      this.output +='--- Start 5 Detect if a HTML have more than one <H1> tag. ---\n';
      if($('H1').length > H1_LIMIT_COUNT) {
        this.output +='error: HTML have more than one <H1> tag.\n';
      }
      this.output +='--- End 5 Detect if a HTML have more than one <H1> tag. ---\n';
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
        this.output ='please use setfilePath or setReadableStream\n';
        return;
      }
      this.output = '';

      const existRules = new Set(['1', '2', '3', '4', '5']);
      var inputCheckRulesArray = inputCheckRules.split(',');
      const setCheckRules = new Set();
      var checkRules = [];

      inputCheckRulesArray.forEach(function(rule) {
        if(existRules.has(rule)) {
          setCheckRules.add(rule);
        } else {
          this.output += 'input error: rule='+rule+' not exist, rule has 1, 2, 3, 4, 5, example input is 1,2 for using rule 1 and 2\n';
        }
      }, this);

      this.output += 'check rules: ';
      setCheckRules.forEach(function(checkRule) {
        this.output += checkRule +', ';
      }, this);
      this.output = this.output.substring(0, this.output.length -2);
      this.output += '\n';
      setCheckRules.forEach(function(ruleNumber) {
          this.rule(ruleNumber);
      }, this);
    }
    this.setOutputMethond = function(method, filePath = '') {
      const existOutputMethond = new Set([1, 2, 3]);
      if(existOutputMethond.has(method)) {
        if((method == 2 || method == 3) && filePath) {
          throw Error('Output 2(Node Writable Stream) or 3(Console), can not use filePath');
        }
        if(method == 1 && !filePath) {
          throw Error('filePath is Emtpy');
        } else {
          this.filePath = filePath;
          outputMethod = method;
        }
      }
    };
    this.getOutput = function() {
      console.log('filePath='+this.filePath);
      if (outputMethod == 1) {
        fs.writeFile(filePath, output, function(err) {
          if(err) {
            throw Error('create file error='+err);
            return ;
          }
        });
        return 'success';
      } else if (outputMethod == 2) {
        return 'this metod need discuss';
      } else if (outputMethod == 3) {
        if(output) {
          console.log(output);
        }
        return 'success';
      }
    };
  }
}
