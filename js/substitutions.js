// Tribute to  justin.giancola and the s/keyboard/leopard chrome extension.
// Icon and idea are from www.xkcd.com/1288
chrome.runtime.sendMessage("config", function(response) {
  "use strict";
  // taken from http://stackoverflow.com/questions/17264639/replace-text-but-keep-case
function enforceLength(text, pattern, result) {
  if (text.length > result.length) {  
    result = result.concat(text.substring(result.length, text.length));
  }

  if (pattern.length > text.length) {
    result = result.substring(0, text.length);
  }

  return result;
}

function matchCase(text, pattern){
  var result = '';

  for (var i =0; i < pattern.length; i++){
    var c = text.charAt(i);
    var p = pattern.charAt(i);

    if(p === p.toUpperCase()) {
       result += c.toUpperCase();
    } else {
       result += c.toLowerCase();
    }
  }  
  return text.toUpperCase(); //enforceLength(text, pattern, result);
  }
  var substitute = (function() {
    "use strict";
    var replacements, ignore, i, replacementsObject, original;
    replacements = response;
    replacementsObject = [];
    for (i = replacements.length - 1; i >= 0; i--) {
      original = new RegExp("\\b" + replacements[i][0] + "\\b", "gi");
      replacementsObject.push([original, replacements[i][1]]);
    }
    return function(node) {
      var i;
      var ignore = {
        "STYLE": 0,
        "SCRIPT": 0,
        "NOSCRIPT": 0,
        "IFRAME": 0,
        "OBJECT": 0,
        "INPUT": 0,
        "FORM": 0,
        "TEXTAREA": 0
      };
      if (node.parentElement.tagName in ignore) {
        return;
      }
      for (i = replacementsObject.length - 1; i >= 0; i--) {
        node.nodeValue = node.nodeValue.replace(replacementsObject[i][0], function(match) {
          return matchCase(replacementsObject[i][1], match);
        });
      }
    };
  })();

  var node, iter;
  var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  while ((node = iter.nextNode())) {
    substitute(node);
  }
});
