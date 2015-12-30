## Mountain View Restaurants
Used Yelp API to show restaurants around Mountan View, CA.

##### Enter your Yelp API keys
src/js/apiKeys.js    

```js
function apiKeys(){
  // Enter your OAuth information here
  return {
    consumerKey: "****",
    consumerSecret: "****",
    token: "****",
    tokenSecret: "****"
  }
}
```

For generating your own keys take a look at [here](https://www.yelp.com/developers/documentation/v2/overview)

Application will not be able to fetch restaurants data to populate the app if these keys are not provided!

##### Open src/index.html 
Double click src/index.html to open the application

No need for npm install or to run any grunt tasks