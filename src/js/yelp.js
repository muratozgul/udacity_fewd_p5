/**
 * Returns an object that wraps data and helper methods
 * to interact with Yelp API
 * @returns {Object} - yelpApi helper object
 */
function yelpAPI() {
  var api = {};

  // Get keys from apiKeys.js
  api.auth = apiKeys();
  api.auth.signatureMethod = "HMAC-SHA1";

  /**
   * Returns a random string
   * @param {Number} length - Length of the requested random string
   * @param {string} chars - Pool of characters to generate from
   * @returns {string} - Random string
   */
  api.randomString = function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

  /**
   * Returns an url to query yelp API
   * @param {string} term - Type of places to filter
   * @param {string} location - Location like: "Mountain View"
   * @param {Number} limit - Number of results to be returned
   * @returns {string} - Search url
   */
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

  /**
   * Sends an AJAX request to Yelp Search API
   * @param {string} searchUrl - Target url for AJAX request
   * @callback - On succesful response, called with response data as argument
   */
  api.search = function(searchUrl, callback){

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
      method: 'GET',
      parameters: parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    var requestTimer = setTimeout(function(){
      callback(new JsonpTimeoutError("Failed to load data: Server Response Timeout"));
    }, 8000);

    $.ajax({
      url: message.action,
      data: parameterMap,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(data, textStats, XMLHttpRequest) {
        clearTimeout(requestTimer);
        callback(null, data);
      }
    });
  };

  /**
   * Sends an AJAX request to Yelp Business API
   * @param {string} businessId - Yelp business id to request detailed data
   * @callback - On succesful response, called with response data as argument
   */
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

    var requestTimer = setTimeout(function(){
      callback(new JsonpTimeoutError("Failed to load data: Server Response Timeout"));
    }, 8000);
    
    $.ajax({
      url: url,
      data: parameterMap,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(data, textStats, XMLHttpRequest) {
        clearTimeout(requestTimer);
        callback(null, data);
      }
    });

  };

  return api;
}

function JsonpTimeoutError(message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
JsonpTimeoutError.prototype = Object.create(Error.prototype);
JsonpTimeoutError.prototype.name = "JsonpTimeoutError";