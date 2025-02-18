import './styles/jass.css'; 

const searchForm = document.getElementById('search-form') as HTMLFormElement | null;
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
const todayContainer = document.getElementById('today') as HTMLDivElement | null;
const forecastContainer = document.getElementById('forecast') as HTMLDivElement | null;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement | null;
const heading = document.getElementById('search-title') as HTMLHeadingElement | null;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement | null;
const tempEl = document.getElementById('temp') as HTMLParagraphElement | null;
const windEl = document.getElementById('wind') as HTMLParagraphElement | null;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement | null;

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: cityName }),
    });

    console.log('API Response:', response);

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const weatherData = await response.json();
    console.log('✅ Received Weather Data:', weatherData);

    // Since the API is returning an object, no need to check for an array
    if (!weatherData || typeof weatherData !== 'object') {
      throw new Error('⚠️ Weather data is missing or not in expected format!');
    }

    console.log("👉 Current Weather:", weatherData);

    renderCurrentWeather(weatherData); // Pass the object directly
  } catch (error) {
    console.error(error);
  }
};



const fetchSearchHistory = async () => {
  try {
    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const deleteCityFromHistory = async (id: string) => {
  try {
    const response = await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting city: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const renderCurrentWeather = (currentWeather: any): void => {
  if (!heading || !weatherIcon || !tempEl || !windEl || !humidityEl) return;

  const { city, tempF, description, humidity, windSpeed, date } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', description);
  weatherIcon.setAttribute('class', 'weather-img');

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]): void => {
  if (!forecastContainer) return;

  const headingCol = document.createElement('div');
  const headingEl = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  headingEl.textContent = '5-Day Forecast:';
  headingCol.append(headingEl);

  forecastContainer.innerHTML = '';
  forecastContainer.append(headingCol);

  forecast.forEach(renderForecastCard);
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async () => {
  if (!searchHistoryContainer) return;

  const historyList = await fetchSearchHistory();

  searchHistoryContainer.innerHTML = '';

  if (!historyList || historyList.length === 0) {
    searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    return;
  }

  historyList.reverse().forEach((city: any) => {
    const historyItem = buildHistoryListItem(city);
    searchHistoryContainer.append(historyItem);
  });
};

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

const createHistoryButton = (city: string): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;
  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');
  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = document.createElement('div');
  historyDiv.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};


const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();
  if (!searchInput || !searchInput.value.trim()) return;

  const search = searchInput.value.trim();
  fetchWeather(search).then(() => getAndRenderHistory());
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.history-btn')) {
    fetchWeather(target.textContent || '').then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityData = target.getAttribute('data-city');
  if (!cityData) return;

  const cityID = JSON.parse(cityData).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

const getAndRenderHistory = () => fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();




