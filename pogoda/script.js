const base_url = 'http://api.weatherapi.com/v1'
const key = '56fa909c22c34441901180038252503'
// const url = base_url + '/forecast.json?key=' + key + '&q=Katowice&days=5'
const url = 'http://localhost:5500/weather/data.json'

fetch(url)
.then(data => data.json())
.then(json => {
  
  const forecast_wrapper = document.querySelector('.forecast-wrapper')
  const items = Array.from(forecast_wrapper.children)
  items.forEach((item, index) => {

    const data = json.forecast.forecastday[index]
    
    const image = item.querySelector('img')
    image.src = data.day.condition.icon

    const date = item.querySelector('.date')
    date.innerText = data.date

    const temp = item.querySelector('.temp')
    temp.innerText = data.day.maxtemp_c + '°C'

  })

  const current = document.querySelector('main')

  const image = current.querySelector('img')
  image.src = json.current.condition.icon

  const date = current.querySelector('.date')
  date.innerText = json.current.last_updated

  const temp = current.querySelector('.temp')
  temp.innerText = json.current.temp_c + '°C'

})