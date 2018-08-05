<template>
  <div class="app" :class="{'weather-day': forecastTimeDay === true, 'weather-night': forecastTimeDay === false}">
    <div class="weather-box">
        <div class="top-wrapper" :class="{'view-day': forecastTimeDay === true, 'view-night': forecastTimeDay === false}">
          <div class="top-wrapper-search">
            <div class="search-mode-box">
              <div class="search">
                <input type="text" name="searchFor" class="search-input" :model="searchFor" placeholder="Type City Name">
                <input type="button" class="search-btn">
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
                        @click="changeViewTemp"
                >
                <input type="button" value="C" class="temp-c" data-temp="celsius"
                        :class="{'active-temp': viewTemp === 'celsius', 'inactive-temp': viewTemp === 'fahren'}"
                        @click="changeViewTemp"
                >
              </div>
            </div>
            <div class="forecast-time">
              <div class="forecast-box" 
                    @click="changeForecastTime" 
                    :class="{'day-time': forecastTimeDay === false, 'night-time': forecastTimeDay === true}"
                    title="Forecast Time"
              ></div>
            </div>
          </div>
        </div>
        <div class="bottom-wrapper">
          <div v-if="forecastTimeDay === true && viewMode === 'standart'" class="weather-info" v-for="(index, day) in daysInfo" 
                :data-day="index.day" 
                :key="day" 
                @click="displayDayInfo"
                :class="{'active-info': viewDayInfo === index.day}"
          >
            <div class="day-title" :data-day="index.day">
              <h3 :data-day="index.day">{{ index.day }}</h3>
            </div>
            <div class="day-icon" :data-day="index.day">
              <div :class="index.icon" :data-day="index.day"></div>
            </div>
            <div class="day-temp" :data-day="index.day">
              <h3 :data-day="index.day">{{ index.temp }}<sup>&#9675;</sup></h3>
            </div>
          </div>

          <div v-if="forecastTimeDay === false && viewMode === 'standart'" class="weather-info" v-for="(index, day) in nightsInfo" 
                :data-day="index.day" 
                :key="day" 
                @click="displayDayInfo"
                :class="{'active-info': viewDayInfo === index.day}"
          >
            <div class="day-title" :data-day="index.day">
              <h3 :data-day="index.day">{{ index.day }}</h3>
            </div>
            <div class="day-icon" :data-day="index.day">
              <div :class="index.icon" :data-day="index.day"></div>
            </div>
            <div class="day-temp" :data-day="index.day">
              <h3 :data-day="index.day">{{ index.temp }}<sup>&#9675;</sup></h3>
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
      forecastTimeDay: true,
      searchFor: '',
      viewMode: 'standart',
      viewTemp: 'celsius',
      daysInfo: [
        {day: "Mon", temp: "21", icon: "sunny"},
        {day: "Tue", temp: "19", icon: "sunny"},
        {day: "Wed", temp: "25", icon: "sunny-cloud"},
        {day: "Thu", temp: "27", icon: "sunny"},
        {day: "Fri", temp: "23", icon: "sunny-cloud"},
        {day: "Sat", temp: "21.5", icon: "sunny"}
      ],
      nightsInfo: [
        {day: "Mon", temp: "10", icon: "rain"},
        {day: "Tue", temp: "13", icon: "rain"},
        {day: "Wed", temp: "16", icon: "cloud-night"},
        {day: "Thu", temp: "15.5", icon: "storm"},
        {day: "Fri", temp: "11", icon: "snowing"},
        {day: "Sat", temp: "11.5", icon: "cloud-night"}
      ],
      viewDayInfo: '',
    }
  },
  methods: {
    changeForecastTime(){
      this.forecastTimeDay = !this.forecastTimeDay;
    },
    changeViewMode(event){
      this.viewMode = event.target.dataset.mode;
    },
    changeViewTemp(event){
      this.viewTemp = event.target.dataset.temp;
    },
    displayDayInfo(event){
      this.viewDayInfo = event.target.dataset.day;
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

.weather-day {
  background: linear-gradient(#2b69a2, #13a1a0);
}
.weather-night {
  background: linear-gradient(#00223e, #1e5b70);
}

/*  */
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

/* search, mode, temp BOX */
.search-mode-box {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
  .search-mode-box > div {
    margin: 0 5px;
  }

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
  .search-input:focus {
    border: 1px solid #00223e;
  }

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
  .search-btn:active {
    background-size: 65%;
  }

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
  max-width: 150px;
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
  .weather-info:hover h3 {
    color: rgb(255, 50, 0);
  }

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
}

h3 {
  margin: 0;
  padding: 0;
}

.active-info {
  background-color: #fff;
  box-shadow: 0 0 15px rgba(255, 50, 0, 0.3);
}
/* Weather icons DAY*/
.sunny {
  background: url(./assets/weather-icons-day/sunny.png) no-repeat center;
  background-size: cover;
}
.sunny-cloud {
  background: url(./assets/weather-icons-day/sunnycloud.png) no-repeat center;
  background-size: cover;
}
/* Weather icons NIGHT */
.rain {
  background: url(./assets/weather-icons-night/rain.png) no-repeat center;
  background-size: cover;
}
.cloud-night {
  background: url(./assets/weather-icons-night/cloudnight.png) no-repeat center;
  background-size: cover;
}
.storm {
  background: url(./assets/weather-icons-night/storm.png) no-repeat center;
  background-size: cover;
}
.snowing {
  background: url(./assets/weather-icons-night/snowing.png) no-repeat center;
  background-size: cover;
}

/* Query media */
@media (max-width: 600px){
  .top-wrapper-search {
    grid-template-columns: auto 1fr 50px;
  }
  .day-icon > div {
    width: 50px;
    height: 50px;
  }
  h3 {
    font-size: 1em;
  }
}
</style>