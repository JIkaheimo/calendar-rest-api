const axios = require('axios');
const data = require('./testdata.json');

data.forEach(obj => {
  axios.post(`https://calendar-rest-api.herokuapp.com/api/events`, obj);
});
