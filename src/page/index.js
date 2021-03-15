import './index.css';
import data from '../../data/data.json';
import darkIcon from '../images/favicon_dark.ico';
import lightIcon from '../images/favicon_light.ico';

const body = document.querySelector('.page');
const favicon = document.querySelector('#favicon');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const slideNumber = urlParams.get('slide') || 1;
const pageTheme = urlParams.get('theme') || 'dark';

const choiceEmoji = '👍';

function setTheme() {
  favicon.href = `${pageTheme === 'dark' ? darkIcon : lightIcon}`;
  body.classList.add(`theme_${pageTheme}`);
}

window.renderTemplate = function(alias, data) {
  return `<section class="stories">
            <h1 class="stories__title">${data.data.title}</h1>
            <h2 class="stories__subtitle">${data.data.subtitle}</h2>
          </section>`;
}

setTheme();
body.innerHTML = window.renderTemplate(data[slideNumber - 1].alias, data[slideNumber - 1]);

// необходимо для хот релоуда при изменении js файла
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}
