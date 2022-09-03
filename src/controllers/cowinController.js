let axios = require("axios");



//1 assignment
const findDistrict = async function (req, res) {
  try {
    let districtid = req.query.district_id;
    let date = req.query.date;
    let options = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtid}&date=${date}`,
    };
    let result = await axios(options);
    let data = result.data;
    res.status(200).send({ msg: data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

//2 assignment
const weather = async function (req, res) {
  try {
    let cityName = [
      "Bengaluru","Mumbai","Delhi","Kolkata","Chennai","London","Moscow"];
    let objCity = [];

    for (let i = 0; i < cityName.length; i++) {
      let firstCity = { city: cityName[i] };
      let resp = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName[i]}&appid=cc9dca07265c6345c137bf7f66203c3f`
      );
      firstCity.temp = resp.data.main.temp;
      objCity.push(firstCity);
    }

    let sorted = objCity.sort(function (a, b) {
      return a.temp - b.temp;});
    console.log(sorted);
    res.status(200).send({ msg: sorted });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

//3 assignment
const memeCreate = async function (req, res) {
  try {
    let memeid = req.query.template_id;
    // let caption = req.query.text0;
    let textFirstfield = req.query.text0;
    let textSecoundfield = req.query.text1;
    let userName = req.query.username;
    let password = req.query.password;

    let options = {
      method: "post",
      url: `https://api.imgflip.com/caption_image?template_id=${memeid}&text0=${textFirstfield}&text1=${textSecoundfield}&username=${userName}&password=${password}`,
    };
    let result = await axios(options);
    console.log(result.data);
    res.status(200).send({ msg: result.data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

// module.exports.getStates = getStates;
// module.exports.getDistricts = getDistricts;
// module.exports.getByPin = getByPin;
// module.exports.getOtp = getOtp;
module.exports.findDistrict = findDistrict;
module.exports.weather = weather;
module.exports.memeCreate = memeCreate;
