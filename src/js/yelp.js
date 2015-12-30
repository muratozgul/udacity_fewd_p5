function yelpAPI() {
  var api = {};

  // apiKeys.js
  api.auth = apiKeys();
  api.auth.signatureMethod = "HMAC-SHA1";

  api.defaultURL = "https://api.yelp.com/v2/search/?term=Movie Theater&location=Mountain View, CA&limit=5";

  api.randomString = function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

  api.search = function(searchParams, callback){
    var accessor = {
      consumerSecret : api.auth.consumerSecret,
      tokenSecret : api.auth.tokenSecret
    };

    parameters = [];
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', api.auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', api.auth.consumerSecret]);
    parameters.push(['oauth_token', api.auth.token]);
    parameters.push(['oauth_signature_method', api.auth.signatureMethod]);

    var message = {
      //action : 'http://api.yelp.com/v2/business/bay-to-breakers-12k-san-francisco',
      action: api.defaultURL,
      method : 'GET',
      parameters : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    console.log(parameterMap);

    $.ajax({
      url: message.action,
      data: parameterMap,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(data, textStats, XMLHttpRequest) {
        console.log(data);
        $(".js-apiResult").text(JSON.stringify(data));
      }
    });

    // $.ajax({
    //   type: 'GET',
    //   url: api.defaultURL,
    //   async: false,
    //   jsonpCallback: 'jsonCallback',
    //   contentType: "application/json",
    //   dataType: 'jsonp',
    //   success: function(json) {
    //     console.dir(json);
    //   },
    //   error: function(e) {
    //     console.log(e.message);
    //   }
    // });

  };

  return api;
}