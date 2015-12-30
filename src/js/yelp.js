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

  api.searchUrlBuilder = function(term, location, limit) {
    term = term || "Movie Theater";
    location = location || "Mountain View, CA";
    limit = limit || 5;

    var url = "https://api.yelp.com/v2/search/?";
    url += "term=" + term;
    url += "&location=" + location;
    url += "&limit=" + limit;

    return url;
  };

  api.search = function(searchUrl, callback){
    searchUrl = searchUrl || api.defaultURL;

    console.log(searchUrl);

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
      action: searchUrl,
      method : 'GET',
      parameters : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    $.ajax({
      url: message.action,
      data: parameterMap,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(data, textStats, XMLHttpRequest) {
        callback(data);
      }
    });
  };

  api.business = function(businessId, callback){
    var url = "https://api.yelp.com/v2/business/" + businessId;

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
      action: url,
      method : 'GET',
      parameters : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    $.ajax({
      url: url,
      data: parameterMap,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(data, textStats, XMLHttpRequest) {
        callback(data);
      }
    });

  };

  return api;
}