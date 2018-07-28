$ = cheerio.load(testHtml);
function hasAttribute(element, attribute) {
  var count = 1;
  $(element).each(function (i, elem) {
    if(!elem['attribs'][attribute]) {
      var $this = $(this);
      console.log((count++) +' error: '+ $.html($this));
    }
  });
}
function rule1() {
  console.log('--- Start 1. Detect if any <img /> tag without alt attribute ---');
  hasAttribute('img', 'alt');
  console.log('--- End 1. Detect if any <img /> tag without alt attribute ---')
}
// rule1();
function rule2() {
  console.log('--- Start 2. Detect if any <a /> tag without rel attribute ---');
  hasAttribute('a', 'rel');
  console.log('--- End 2. Detect if any <a /> tag without rel attribute ---');
}
// rule2();


// 3. In <head> tag
// i. Detect if header doesn’t have <title> tag
// ii. Detect if header doesn’t have <meta name=“descriptions” ... /> tag
// iii. Detect if header doesn’t have <meta name=“keywords” ... /> tag
function rule3() {
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
}
// rule3();

var strongLimitCount = 15;
function rule4() {
  console.log('--- Start 4 Detect if there’re more than '+strongLimitCount+' <strong> tag in HTML ('+strongLimitCount+' is a value should be configurable by user) ');
  if($('strong').length < strongLimitCount) {
    console.log('error: there’re more than '+strongLimitCount+' <strong> tag in HTML');
  }
  console.log('--- End 4 Detect if there’re more than '+strongLimitCount+' <strong> tag in HTML ('+strongLimitCount+' is a value should be configurable by user) ');
}
// rule4();

// console.log($('H1').length);
var H1_LIMIT_COUNT = 1;
function rule5() {
  console.log('--- Start 5 Detect if a HTML have more than one <H1> tag. ---');
  if($('H1').length > H1_LIMIT_COUNT) {
    console.log('error: HTML have more than one <H1> tag.');
  }
  console.log('--- End 5 Detect if a HTML have more than one <H1> tag. ---');
}
rule5();
