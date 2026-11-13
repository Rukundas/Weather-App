import './page.css';
import Chart from 'chart.js/auto';

const ZipCode = document.getElementById("zip");
const message = document.getElementById('one');
const apiKey = 'N9LYJR5W9M6MDMUZ5P37AR4UC';
const button = document.getElementById('search');
const iconBox = document.getElementById('icon');
let chart;

function getEmoji(icon){
    if(icon.includes('thunder')) return '⛈️';
    if(icon.includes('rain') || icon.includes('showers')) return '⛈️';
    if(icon.includes('snow')) return '❄️';
    if(icon.includes('gog')) return '🌫️';
    if(icon.includes('wind')) return '💨';
    if(icon.includes('partly')) return '⛅';
    if(icon.includes('cloudy')) return '☁️';
    if(icon.includes('clear')) return '☀️';
    return '🌡️'
}

function drawChart(days) {
    const week = days.slice(0,7);

    if(chart) chart.destroy();
    chart = new Chart(document.getElementById('chart'),{
        type:'line',
        data: {
            labels: week.map(d => d.datetime),
            datasets: [{
                label: 'Max temp (°C)',
                data: week.map(d => d.tempmax),
                boarderColor: 'tomato',
                tension: 0.3,
            },{
                label: 'Min temp (°C)',
                data: week.map(d => d.tempmin),
                boarderColor: 'steelblue',
                tension: 0.3,
            },
        ],
        },
    });
}

async function getWeatherData() {

    const location = ZipCode.value.trim();
    if(!location) {
        message.textContent = 'Please enter a valid country or city.';
        return;
    }
    message.textContent = 'Loading....';
    try{

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=${apiKey}&unitGroup=metric&contentType=json`);
    if(!response.ok){
        throw new Error(`Request failed with ${response.status}`);
    }

    const data = await response.json();
    const current = data.currentConditions;
    message.textContent = `The Weather in ${data.resolvedAddress} is ${current.conditions} with a temperature of ${current.temp} degrees Celsius.`;
    iconBox.textContent = getEmoji(current.icon);
    drawChart(data.days);
    
} catch (error) {
    console.error(error);
    message.textContent= 'Error occured while fetching weather data. Please check the zip code and try again later.';
    iconBox.textContent = '';
}
};

function results() {
    const container = document.getElementById('one');

    ZipCode.addEventListener('input', () => {
        if (ZipCode.validity.valid) {
            container.textContent = '';
        } else if (ZipCode.validity.valueMissing) {
            container.textContent = 'Please enter a country or city.';
        } else {
            container.textContent = 'Please enter a valid country or city.';
        };
    });

    button.addEventListener("click", (event) => {
        event.preventDefault();
        getWeatherData();
    });

    ZipCode.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getWeatherData();
        }
        });
};
results();