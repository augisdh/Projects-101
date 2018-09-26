<template>
  <div class="app" :class="{'weather-day': forecastTimeDay === true, 'weather-night': forecastTimeDay === false}">
    <div class="weather-box">
        <div class="top-wrapper" :class="{'view-day': forecastTimeDay === true, 'view-night': forecastTimeDay === false}">
          <div class="top-wrapper-search">
            <div class="forecast-hour">
              <div class="hour-select-img" 
                  title="Select forecast time"
                  @click="showTime = !showTime">
                <ul :class="{'active-time': showTime === true}">
                  <li v-if="forecastTimeDay === true" 
                      v-for="(index, time) in weatherTimeDay" 
                      :key="time"
                      :id="time"
                      @click="changeTimeSelected">
                    {{ index }}
                  </li>
                  <li v-if="forecastTimeDay === false" 
                      v-for="(index, time) in weatherTimeNight" 
                      :key="time"
                      :id="time"
                      @click="changeTimeSelected">
                    {{ index }}
                  </li>                  
                </ul>
              </div>
            </div>
            <div class="search-mode-box">
              <div class="search">
                <input type="text" name="searchFor" class="search-input" v-model="searchFor" placeholder="Type City Name">
                <input type="button" class="search-btn" @click="loadJson()">
              </div>
              <div class="mode-box">
                <div class="mode-bg" :class="{'active-mode': viewMode === 'standart', 'inactive-mode': viewMode === 'trip'}">
                  <input type="button" class="mode-standart" data-mode="standart" @click="changeViewMode">
                </div>
                <div class="mode-bg" :class="{'active-mode': viewMode === 'trip', 'inactive-mode': viewMode === 'standart'}">
                  <input type="button" class="mode-trip" data-mode="trip" @click="changeViewMode">
                </div>
              </div>
              <div class="temp-box">
                <input type="button" value="F" class="temp-f" data-temp="fahren"
                        :class="{'active-temp': viewTemp === 'fahren', 'inactive-temp': viewTemp === 'celsius'}"
                        @click="changeViewTemp">
                <input type="button" value="C" class="temp-c" data-temp="celsius"
                        :class="{'active-temp': viewTemp === 'celsius', 'inactive-temp': viewTemp === 'fahren'}"
                        @click="changeViewTemp">
              </div>
            </div>
            <div class="forecast-time">
              <div class="forecast-box" 
                    @click="changeForecastTime" 
                    :class="{'day-time': forecastTimeDay === false, 'night-time': forecastTimeDay === true}"
                    title="Forecast Time">
              </div>
            </div>
          </div>
          <div class="forecast-info">
            <div class="forecast-city">
              <h4>{{ cityForecast.city }}, {{ cityForecast.country }}</h4>
            </div>
            <div class="forecast-day">
              <h4>{{ viewDayDate + viewDayDateExtend }}, {{ viewMonthDay }} <sup>th</sup> {{ viewMonth }}</h4>
            </div>
          </div>
          <div class="forecast-time-img" v-if="viewMode === 'standart'">
            <div class="forecast-time-box">
                <!-- IF DAY -->
                <h4 v-if="forecastTimeDay === true && viewTemp === 'celsius' && weatherInfoDay[daySelected].length > 1">
                  Time: {{ weatherTimeDay[timeSelected] }}, {{ weatherInfoDay[daySelected][timeSelected + 1].weather[1].celsius }}<sup>&#9675;</sup>C
                </h4>
                <h4 v-if="forecastTimeDay === true && viewTemp === 'fahren' && weatherInfoDay[daySelected].length > 1">
                  Time: {{ weatherTimeDay[timeSelected] }}, {{ weatherInfoDay[daySelected][timeSelected + 1].weather[2].fahren }}<sup>&#9675;</sup>C
                </h4>
                <img v-if="forecastTimeDay === true && weatherInfoDay[daySelected].length > 1" :src="weatherIconUrl + weatherInfoDay[daySelected][timeSelected + 1].weather[0].icon + '.png'" alt="">
                <!-- IF NIGHT -->
                <h4 v-if="forecastTimeDay === false && viewTemp === 'celsius' && weatherInfoNight[daySelected].length > 1">
                  Time: {{ weatherTimeNight[timeSelected] }}, {{ weatherInfoNight[daySelected][timeSelected + 1].weather[1].celsius }}<sup>&#9675;</sup>C
                </h4>
                <h4 v-if="forecastTimeDay === false && viewTemp === 'fahren' && weatherInfoNight[daySelected].length > 1">
                  Time: {{ weatherTimeNight[timeSelected] }}, {{ weatherInfoNight[daySelected][timeSelected + 1].weather[2].fahren }}<sup>&#9675;</sup>C
                </h4>
                <img v-if="forecastTimeDay === false && weatherInfoNight[daySelected].length > 1" :src="weatherIconUrl + weatherInfoNight[daySelected][timeSelected + 1].weather[0].icon + '.png'" alt="">
            </div>
          </div>
        </div>
        <div class="bottom-wrapper">
          <div v-if="forecastTimeDay === true && viewMode === 'standart' && weatherInfoDay[day].length > 1" class="weather-info" v-for="(index, day) in weatherInfoDay" 
                :data-day="index[0]" 
                :key="day" 
                @click="displayDayInfo"
                :class="{'active-info': viewDayDate === index[0]}"
                :id="day">
            <div class="day-title" :data-day="index[0]" :id="day">
              <h3 :data-day="index[0]" :id="day">{{ index[0] }}</h3>
            </div>
            <div class="day-icon" :data-day="index[0]" :id="day">
              <div :id="day" :data-day="index[0]">
                <img v-if="daySelected === day" :id="day" :data-day="index[0]" :src="weatherIconUrl + index[timeSelected + 1].weather[0].icon + '.png'" alt="">
                <img v-if="daySelected !== day" :id="day" :data-day="index[0]" :src="weatherIconUrl + index[1].weather[0].icon + '.png'" alt="">
              </div>
            </div>
            <div v-if="daySelected === day" class="day-temp" :data-day="index[0]" :id="day">
              <h3 v-if="viewTemp === 'celsius'" :data-day="index[0]" :id="day">{{ index[timeSelected + 1].weather[1].celsius }}<sup>&#9675;</sup>C</h3>
              <h3 v-if="viewTemp === 'fahren'" :data-day="index[0]" :id="day">{{ index[timeSelected + 1].weather[2].fahren }}<sup>&#9675;</sup>F</h3>
            </div>
            <div v-if="daySelected !== day" class="day-temp" :data-day="index[0]" :id="day">
              <h3 v-if="viewTemp === 'celsius'" :data-day="index[0]" :id="day">{{ index[1].weather[1].celsius }}<sup>&#9675;</sup>C</h3>
              <h3 v-if="viewTemp === 'fahren'" :data-day="index[0]" :id="day">{{ index[1].weather[2].fahren }}<sup>&#9675;</sup>F</h3>
            </div>
          </div>

          <div v-if="forecastTimeDay === false && viewMode === 'standart' && weatherInfoNight[day].length > 1" class="weather-info" v-for="(index, day) in weatherInfoNight" 
                :data-day="index[0]" 
                :key="day" 
                @click="displayDayInfo"
                :class="{'active-info': viewDayDate === index[0]}"
                :id="day">
            <div class="day-title" :data-day="index[0]" :id="day">
              <h3 :data-day="index[0]" :id="day">{{ index[0] }}</h3>
            </div>
            <div class="day-icon" :data-day="index[0]" :id="day">
              <div :class="index.icon" :data-day="index[0]" :id="day">
                <img v-if="daySelected === day" :id="day" :data-day="index[0]" :src="weatherIconUrl + index[timeSelected + 1].weather[0].icon + '.png'" alt="">
                <img v-if="daySelected !== day" :id="day" :data-day="index[0]" :src="weatherIconUrl + index[1].weather[0].icon + '.png'" alt="">
              </div>
            </div>
            <div v-if="daySelected === day" class="day-temp" :data-day="index[0]" :id="day">
              <h3 v-if="viewTemp === 'celsius'" :data-day="index[0]" :id="day">{{ index[timeSelected + 1].weather[1].celsius }}<sup :data-day="index[0]">&#9675;</sup>C</h3>
              <h3 v-if="viewTemp === 'fahren'" :data-day="index[0]" :id="day">{{ index[timeSelected + 1].weather[2].fahren }}<sup :data-day="index[0]">&#9675;</sup>F</h3>
            </div>
            <div v-if="daySelected !== day" class="day-temp" :data-day="index[0]" :id="day">
              <h3 v-if="viewTemp === 'celsius'" :data-day="index[0]" :id="day">{{ index[1].weather[1].celsius }}<sup :data-day="index[0]">&#9675;</sup>C</h3>
              <h3 v-if="viewTemp === 'fahren'" :data-day="index[0]" :id="day">{{ index[1].weather[2].fahren }}<sup :data-day="index[0]">&#9675;</sup>F</h3>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      forecastTimeDay: null,
      searchFor: '',
      viewMode: 'standart',
      viewTemp: 'celsius',
      weatherInfoDay: [
        [],
        [],
        [],
        [],
        [],
        []
      ],
      weatherInfoNight: [
        [],
        [],
        [],
        [],
        [],
        []
      ],
      weatherTimeDay: [],
      weatherTimeNight: [],
      timeSelected: 0,
      showTime: false,
      daysDisplay: [],
      viewDayDate: "",
      viewDayDateExtend: "",
      viewMonthDay: 0,
      viewMonth: "",
      daySelected: 0,
      weatherLocation: {latitude: null, longitude: null},
      cityForecast: {country: "", city: ""},
      weatherIconUrl: "http://openweathermap.org/img/w/",
    }
  },
  created: function(){
    this.lookupTime();
    this.getLocation();
  },
  methods: {
    changeForecastTime(){
      this.forecastTimeDay = !this.forecastTimeDay;
      this.timeSelected = 0;
      this.lookupDay();
      this.getMonthDay();
      this.getMonth();
      this.saveTimeWeather(this.weatherInfoDay, this.weatherInfoNight);
    },
    changeViewMode(event){
      this.viewMode = event.target.dataset.mode;
    },
    changeViewTemp(event){
      this.viewTemp = event.target.dataset.temp;
    },
    displayDayInfo(event){
      this.timeSelected = 0;
      this.viewDayDate = event.target.dataset.day;
      this.daySelected = Number(event.target.id);
      this.getDayDateExt();
      this.getMonthDay();
      this.getMonth();
      this.saveTimeWeather(this.weatherInfoDay, this.weatherInfoNight);
    },
    lookupTime(){
      let currentTime = new Date();
      let currentHour = currentTime.getHours();
      (currentHour >= 6 && currentHour < 18) ? this.forecastTimeDay = true : this.forecastTimeDay = false;
    },
    lookupDay(){
      if(this.forecastTimeDay){
        if(this.weatherInfoDay[0].length > 1 && this.viewDayDate === ""){
          this.viewDayDate = this.weatherInfoDay[0][0];
        } else if(this.weatherInfoDay[this.daySelected].length < 2){
          this.daySelected += 1;
          this.viewDayDate = this.weatherInfoDay[1][0];
        } else {
          this.viewDayDate = this.weatherInfoDay[this.daySelected][0];
        }
      } else {
        if(this.weatherInfoNight[0].length > 1 && this.viewDayDate === ""){
          this.viewDayDate = this.weatherInfoNight[0][0];
        } else if(this.weatherInfoNight[this.daySelected].length < 2){
          this.daySelected += 1;
          this.viewDayDate = this.weatherInfoNight[1][0];
        } else {
          this.viewDayDate = this.weatherInfoNight[this.daySelected][0];
        }
      }

      this.getDayDateExt();
    },
    getDayDateExt(){
      const dateExtensions = ["day", "sday", "nesday", "rsday", "urday"];

      if(this.viewDayDate === 'Mon' || this.viewDayDate === 'Fri' || this.viewDayDate === 'Sun'){
        this.viewDayDateExtend = dateExtensions[0];
      } else if(this.viewDayDate === 'Tue'){
        this.viewDayDateExtend = dateExtensions[1];
      } else if(this.viewDayDate === 'Wed'){
        this.viewDayDateExtend = dateExtensions[2];
      } else if(this.viewDayDate === 'Thu'){
        this.viewDayDateExtend = dateExtensions[3];
      } else if(this.viewDayDate === 'Sat'){
        this.viewDayDateExtend = dateExtensions[4];
      }
    },
    getMonthDay(){
      let monthDay = 0;
      let objDate = "";

      (this.forecastTimeDay) ? objDate = Number(this.weatherInfoDay[this.daySelected][1].dt_txt.split("").splice(8,2).join("")) : objDate = Number(this.weatherInfoNight[this.daySelected][1].dt_txt.split("").splice(8,2).join(""));
      this.viewMonthDay = objDate;
    },
    getMonth(){
      const yearMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let objMonth = Number(this.weatherInfoNight[this.daySelected][1].dt_txt.split("").splice(5,2).join(""));
      this.viewMonth = yearMonths[objMonth - 1];
    },
    getLocation(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          this.weatherLocation.latitude = position.coords.latitude;
          this.weatherLocation.longitude = position.coords.longitude;
          this.loadJson();
        });
      } else {
        console.log("Geolocation is not supported");
      }
    },
    convertToCelsius(obj){
      let celsius = 0;

      for(let index in obj.list){
        let kelvinTemp = obj.list[index].main.temp;
        let addTo = obj.list[index].weather;

        celsius = Math.round(kelvinTemp - 273.15);
        addTo.push({"celsius":celsius})
      }
    },
    convertToFahren(obj){
      let fahren = 0;

      for(let index in obj.list){
        let kelvinTemp = obj.list[index].main.temp;
        let addTo = obj.list[index].weather;

        fahren = Math.round(kelvinTemp * 9/5 - 459.67);
        addTo.push({"fahren":fahren})
      }
    },
    removeAndSaveWeekDays(weekDaysArray){
      const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      let currentDate = new Date();
      let currentWeekDay = currentDate.getDay();
      let increase = -1;

      for(let i = 0; i < this.weatherInfoDay.length; i++){
        if(currentWeekDay + i < 7){
          this.weatherInfoDay[i].splice(0, this.weatherInfoDay.length, weekDays[currentWeekDay + i]);
          this.weatherInfoNight[i].splice(0, this.weatherInfoNight.length, weekDays[currentWeekDay + i]);      
        } else if (currentWeekDay + i >= 7){
          increase += 1;
          this.weatherInfoDay[i].splice(0, this.weatherInfoDay.length, weekDays[increase]);
          this.weatherInfoNight[i].splice(0, this.weatherInfoNight.length, weekDays[increase]); 
        }
      }
    },
    changeTimeSelected(event){
      this.timeSelected = Number(event.target.id);
    },
    saveTimeWeather(dayArray, nightArray){
      this.weatherTimeDay.splice(0, this.weatherTimeDay.length);
      this.weatherTimeNight.splice(0, this.weatherTimeNight.length);
        
      for(let i in dayArray){
        if(dayArray[this.daySelected][i] !== undefined && dayArray[this.daySelected][i].dt_txt !== undefined){
          let dayTime = [...dayArray[this.daySelected][i].dt_txt].splice(11, 8).join("");
          this.weatherTimeDay.push(dayTime);
        }
      }

      for(let i in nightArray){
        if(nightArray[this.daySelected][i] !== undefined && nightArray[this.daySelected][i].dt_txt !== undefined){
          let nightTime = [...nightArray[this.daySelected][i].dt_txt].splice(11, 8).join("");
          this.weatherTimeNight.push(nightTime);
        }
      }
    },
    saveWeatherInfo(obj){
      let months = [];
      let days = [];

      (months.length > 0) ? months.splice(0, months.length) : months;
      (days.length > 0) ? days.splice(0, days.length) : days;

      let currentDate = new Date();
      let currentYear = currentDate.getFullYear().toString();
      let currentMonth = currentDate.getMonth() + 1;
      let currentDay = currentDate.getDate();

      // Next 5 days DATE set //
      let secondDate = new Date(currentDate);
      let thirdDate = new Date(currentDate);
      let fourthDate = new Date(currentDate);
      let fifthDate = new Date(currentDate);
      let sixthDate = new Date(currentDate);

      secondDate.setDate(currentDate.getDate() + 1);
      thirdDate.setDate(currentDate.getDate() + 2);
      fourthDate.setDate(currentDate.getDate() + 3);
      fifthDate.setDate(currentDate.getDate() + 4);
      sixthDate.setDate(currentDate.getDate() + 5);

      let secondYear = secondDate.getFullYear().toString();
      let thirdYear = thirdDate.getFullYear().toString();
      let fourthYear = fourthDate.getFullYear().toString();
      let fifthYear = fifthDate.getFullYear().toString();
      let sixthYear = sixthDate.getFullYear().toString();

      let secondMonth = secondDate.getMonth() + 1;
      let thirdMonth = thirdDate.getMonth() + 1;
      let fourthMonth = fourthDate.getMonth() + 1;
      let fifthMonth = fifthDate.getMonth() + 1;
      let sixthMonth = sixthDate.getMonth() + 1;

      months.push(currentMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, sixthMonth);

      let secondDay = secondDate.getDate();
      let thirdDay = thirdDate.getDate();
      let fourthDay = fourthDate.getDate();
      let fifthDay = fifthDate.getDate();
      let sixthDay = sixthDate.getDate();

      days.push(currentDay, secondDay, thirdDay, fourthDay, fifthDay, sixthDay);
      // End of next 5 days Date set //

      for(let month in months){
        (months[month] >= 1 && months[month] <= 9) ? months[month] = "0" + months[month] : months[month];
      }

      for(let day in days){
        (days[day] >= 1 && days[day] <= 9) ? days[day] = "0" + days[day] : days[day];
      }

      currentMonth = months[0].toString();
      secondMonth = months[1].toString();
      thirdMonth = months[2].toString();
      fourthMonth = months[3].toString();
      fifthMonth = months[4].toString();
      sixthMonth = months[5].toString();

      let todayDateCheck = currentYear + "-" + currentMonth + "-" + days[0];
      let secondDateCheck = secondYear + "-" + secondMonth + "-" + days[1];
      let thirdDateCheck = thirdYear + "-" + thirdMonth + "-" + days[2];
      let fourthDateCheck = fourthYear + "-" + fourthMonth + "-" + days[3];
      let fifthDateCheck = fifthYear + "-" + fifthMonth + "-" + days[4];
      let sixthDateCheck = sixthYear + "-" + sixthMonth + "-" + days[5];

      let objListLength = obj.list.length;

      this.removeAndSaveWeekDays();

      for(let i = 0; i < objListLength; i++){
        let objListDate = [...obj.list[i].dt_txt].splice(0,10).join("");
        let objListTime = [...obj.list[i].dt_txt].splice(11,8).join("");

        obj.list[i].weather.push({"time": objListTime});

        if(objListDate === todayDateCheck){ // current Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[0].push(obj.list[i]);
          } else {
            this.weatherInfoDay[0].push(obj.list[i]);
          }
        } else if(objListDate === secondDateCheck){ // second Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[1].push(obj.list[i]);
          } else {
            this.weatherInfoDay[1].push(obj.list[i]);
          }
        } else if(objListDate === thirdDateCheck){ // third Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[2].push(obj.list[i]);
          } else {
            this.weatherInfoDay[2].push(obj.list[i]);
          }
        } else if(objListDate === fourthDateCheck){ // fourth Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[3].push(obj.list[i]);
          } else {
            this.weatherInfoDay[3].push(obj.list[i]);
          }
        } else if(objListDate === fifthDateCheck){ // fifth Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[4].push(obj.list[i]);
          } else {
            this.weatherInfoDay[4].push(obj.list[i]);
          }
        } else if(objListDate === sixthDateCheck){ // sixth Day
          if(objListTime >= "18:00:00" || objListTime < "06:00:00"){
            this.weatherInfoNight[5].push(obj.list[i]);
          } else {
            this.weatherInfoDay[5].push(obj.list[i]);
          }
        }
      }

      this.lookupDay();
      this.lookupTime();
      this.getMonthDay();
      this.getMonth();
      this.saveTimeWeather(this.weatherInfoDay, this.weatherInfoNight);
    },
    loadJson(){
      let getApi = "";
      let obj;
      const searchLocation = `https://api.openweathermap.org/data/2.5/forecast?q=${this.searchFor}&APPID=9547e3e67a04019bbfd370d8e64047bb`;
      const autoLocation = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.weatherLocation.latitude}&lon=${this.weatherLocation.longitude}&APPID=9547e3e67a04019bbfd370d8e64047bb`;
      
      (this.searchFor.length !== 0) ? getApi = searchLocation : getApi = autoLocation;
      
      fetch(getApi)
        .then(res => res.json())
          .then(data => obj = data)
            .then(() => {
              this.cityForecast.country = obj.city.country;
              this.cityForecast.city = obj.city.name;
              this.convertToCelsius(obj);
              this.convertToFahren(obj);
              this.saveWeatherInfo(obj);
            })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.weather-day {background: linear-gradient(#2b69a2, #13a1a0);}
.weather-night {background: linear-gradient(#00223e, #1e5b70);}

.weather-box {
  max-width: 900px;
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 175px;
  box-shadow: 0 0 200px rgba(0, 0, 0, 0.3);
}

.top-wrapper {
  grid-column: 1;
  grid-row: 1;
  height: 550px;
}

.bottom-wrapper {
  grid-column: 1;
  grid-row: 2;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: row;
}

/* inside .top-wrapper */
.top-wrapper-search {
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  grid-template-rows: 50px;
}

.forecast-info {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.forecast-time-img {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}
  .forecast-time-box {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
  }
    .forecast-time-box h4 {
      font-size: 1em;
      color: #f2f2f2;
      margin: 0;
    }
    .forecast-time-box img {
      width: 70px;
    }
/* forecast hour styling */
.forecast-hour {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hour-select-img {
  width: 35px;
  height: 35px;
  background: url(./assets/forecast-time-images/select-time.png) no-repeat center;
  background-size: cover;
  cursor: pointer;
}
  .hour-select-img > ul {
    display: none;
    list-style: none;
    padding: 0;
  }
    .hour-select-img > ul > li {
      color: #f2f2f2;
      padding: 5px 0 0 0;
    }
    .hour-select-img > ul > li:first-child {
      color: #f2f2f2;
      margin: 35px 0 0 0;
    }

/* search, mode, temp BOX */
.search-mode-box {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
  .search-mode-box > div {margin: 0 5px;}

.search {
  max-width: 215px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  width: 175px;
  height: 30px;
  border: none;
  border-radius: 100px;
  padding-left: 10px;
  outline: none;
}
  .search-input:focus {border: 1px solid #00223e;}

.search-btn {
  width: 35px;
  height: 35px;
  background: url(./assets/search-box/search.svg) no-repeat center;
  background-size: 75%;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background-size 100ms;
}
  .search-btn:active {background-size: 65%;}

.mode-box,
.temp-box {
  width: 70px;
  height: 35px;
  background-color: #fff;
  border-radius: 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.mode-bg {
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  border: none;
}
  .mode-bg > input {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .mode-standart {
    background: url(./assets/search-box/standart.png) no-repeat center;
    background-size: 70%;
  }
  .mode-trip {
    background: url(./assets/search-box/trip.png) no-repeat center;
    background-size: 100%;
  }

.temp-box > input {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 18px;
}

/* Trip mode && Temp mode (active --inactive) classes */
.active-mode,
.active-temp {
  background-color: #00223e;
  color: #fff;
  transition: background-color 250ms;
}
.inactive-mode,
.inactive-temp {
  background-color: #fff;
  color: #00223e;
  transition: background-color 250ms;
}

/* forecast time BOX */
.forecast-time {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forecast-box {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

.day-time {
  background: url(./assets/forecast-time-images/day-time.png) no-repeat center;
  background-size: cover;
  transform: rotate(180deg);
  transition: transform 250ms;
}
.night-time {
  background: url(./assets/forecast-time-images/night-time.png) no-repeat center;
  background-size: cover;
  transform: rotate(0deg);
  transition: transform 250ms;
}

/* forecast time styling */
.forecast-day,
.forecast-city {
  margin-top: 5px;
  display: flex;
  align-self: center;
}

.forecast-day > h4,
.forecast-city > h4 {
  text-align: center;
  color: #fff;
  margin: 0;
}

/* background view (day and night) images */
.view-day {
  background: url(./assets/view-background/background-day.png) no-repeat center;
  background-size: cover;
  transition: background 250ms;
}
.view-night {
  background: url(./assets/view-background/background-night.png) no-repeat center;
  background-size: cover;
  transition: background 250ms;
}
/*------------------------------------------*/
/* inside .bottom-wrapper */
.weather-info {
  max-width: 180px;
  min-width: 80px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
  .weather-info:hover {
    background-color: #fff;
    box-shadow: 0 0 15px rgba(255, 50, 0, 0.3);
  }
  .weather-info:hover h3 {color: rgb(255, 50, 0);}

.day-title,
.day-icon,
.day-temp {
  display: flex;
  justify-content: center;
  margin: 5px 0;
}

.day-icon > div {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center; 
}
  .day-icon > div > img {
    width: 100%;
    height: 100%;
  }

h3 {
  margin: 0;
  padding: 0;
}

.hour-select-img > .active-time {
  display: block;
}
.active-info {
  background-color: #fff;
  box-shadow: 0 0 15px rgba(255, 50, 0, 0.3);
}

/* Query media */
@media (max-height: 725px){
  .app {height: 725px;}
}

@media (max-width: 600px){
  .day-icon > div {
    width: 50px;
    height: 50px;
  }
  h3 {font-size: 1em;}
}
</style>
