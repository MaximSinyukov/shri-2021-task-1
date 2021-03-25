import './index.css';
import data from '../data/data.json';

// импортировал фото, чтобы вебпак проставил нужные пути
import darkIcon from '../images/favicon_dark.ico';
import lightIcon from '../images/favicon_light.ico';
import personPhoto1 from '../images/1.jpg';
import personPhoto2 from '../images/2.jpg';
import personPhoto3 from '../images/3.jpg';
import personPhoto4 from '../images/4.jpg';
import personPhoto5 from '../images/5.jpg';
import personPhoto6 from '../images/6.jpg';
import personPhoto7 from '../images/7.jpg';
import personPhoto8 from '../images/8.jpg';
import personPhoto9 from '../images/9.jpg';
import personPhoto10 from '../images/10.jpg';
import personPhoto11 from '../images/11.jpg';
import personPhoto12 from '../images/12.jpg';

const body = document.querySelector('.page');
const favicon = document.querySelector('#favicon');
// считывание параметров строки
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const slideNumber = urlParams.get('slide') || 1;
const pageTheme = urlParams.get('theme') || 'dark';

// собрал фото в объекте для вызова в циклах
const personsPhoto = {
  1: personPhoto1,
  2: personPhoto2,
  3: personPhoto3,
  4: personPhoto4,
  5: personPhoto5,
  6: personPhoto6,
  7: personPhoto7,
  8: personPhoto8,
  9: personPhoto9,
  10: personPhoto10,
  11: personPhoto11,
  12: personPhoto12,
}

//класс, который содержит функции шаблонов
class TemplateBuilder {
  ////////////////////////////////////////////////////////////////////////////////CHART///////////////////////////////////////////////////////
  chart(data) {
    let contentResults = '';
    let contentLeaders = '';

    const maxValue = data.values.reduce((prev, item) => {
      return prev > item.value ? prev : item.value;
    }, 0);

    data.values.forEach((value, i) => {
      if ((i > 3)&&(i < 13)) {
        contentResults = contentResults +
          `<div class="chart__column-container ${value.active ? 'chart__column-container_active' : ''}">
            <h3 class="chart__column-value">${value.value > 0 ? value.value : ''}</h3>
            <div class="chart__column" style="--chart-column-height: calc(${value.value} / ${maxValue});"></div>
            <h4 class="chart__column-name">${value.title}</h4>
          </div>`;
      }
    });

    data.users.forEach((user, i) => {
      if (i < 2) {
        contentLeaders = contentLeaders +
          `<div class="chart__person">
            <div class="chart__photo-container">
              <img class="chart__person-photo" src="${personsPhoto[user.id]}" alt="фото участника">
            </div>
            <div class="chart__data-container">
              <h3 class="chart__person-name">${user.name}</h3>
              <h4 class="chart__person-results">${user.valueText}</h4>
            </div>
          </div>`;
      }
    });

    return `<div class="chart">
              <div class="chart__results">
                ${contentResults}
              </div>
              <div class="chart__leaders">
                ${contentLeaders}
              </div>
            </div>`;
  }

  ////////////////////////////////////////////////////////////////////////////////VOTE///////////////////////////////////////////////////////
  vote(data) {
    let templateContent = '';
    let startOffset = data.offset - 8 || 0;
    let endOffset = data.offset || 8;
    data.users.forEach((user, i) => {
      if ((i < endOffset)&&(i >= startOffset)) {
      templateContent = templateContent +
        `<li class="vote__card ${i > endOffset - 3 ? 'vote__card_portrait' : ''} ${data.selectedUserId === user.id ? 'vote__card_selected' : ''}"    data-action="update" data-params='{ \"alias\": \"leaders\", \"data\": { \"selectedUserId\": ${user.id} }}'>
          <div class="person">
            <div class="person__photo-container">
              <img class="person__photo" src="${personsPhoto[user.id]}" alt="фото участника">
            </div>
            <span class="person__name">${user.name}</span>
          </div>
        </li>`;
      }
    });

    return `<div class="vote">
              <button type="button" class="vote__button vote__button_up" data-action="update" data-params='{ \"alias\": \"vote\", \"data\": { \"offset\": ${endOffset - 2} }}' ${endOffset - 2 < 8 ? 'disabled' : ''}></button>
              <button type="button" class="vote__button vote__button_down" data-action="update" data-params='{ \"alias\": \"vote\", \"data\": { \"offset\": ${endOffset + 2} }}'  ${endOffset + 2 > data.users.length ? 'disabled' : ''}></button>
              <ul class="vote__cards-container">
                ${templateContent}
              </ul>
            </div>`;
  }

  ////////////////////////////////////////////////////////////////////////////////LEADERS///////////////////////////////////////////////////////
  leaders(data) {
    let templateContent = '';
    const orderArray = [4, 2, 0, 1, 3];
    const selectedItem = data.users.find((user) => user.id === data.selectedUserId);
    const originalSelectedIndex = data.users.indexOf(selectedItem);
    let selectedIndex = originalSelectedIndex;

    orderArray.forEach((user) => {
      // если выбранный участник не окажется в пятерке
      if ((user === 4)&&(selectedIndex > 4 )) {
        data.users[4].originalIndex = selectedIndex;
        data.users[4] = selectedItem;
        selectedIndex = 4;
      }
      templateContent = templateContent +
      `<div class="leaders__column ${(user === 4)||(user === 3) ? `leaders__column_small ${(selectedIndex === user)&&((selectedIndex === 3)||(selectedIndex === 4)) ? 'leaders__column_choice' : ''}` : `leaders__column_${user === 0 ? 'large' : 'medium'}`}  ${(user === 1) ? 'leaders__column_medium_right-column' : ''}">
        <div class="person ${(user === 1)||(user === 3) ? 'person_right-columns' : ''}">
          ${(user === 0)||(selectedIndex === user)? `<span class="person__emoji">${user === 0 ? `${data.emoji}` : '👍'}</span>` : ''}
          <div class="person__photo-container">
            <img class="person__photo" src="${personsPhoto[data.users[user].id]}" alt="фото участника">
          </div>
          <span class="person__name">${data.users[user].name}</span>
          <span class="person__results">${data.users[user].valueText}</span>
        </div>
        <div class="leaders__base ${(user === 1)||(user === 3) ? 'leaders__base_right-columns' : ''}">
          <span class="leaders__number">${(originalSelectedIndex !== selectedIndex)&&(user === 4) ? originalSelectedIndex  : (user + 1) }</span>
        </div>
      </div>`;
    });

    return `<div class="leaders">
              ${templateContent}
            </div>`
  }

  ////////////////////////////////////////////////////////////////////////////////ACTIVITY///////////////////////////////////////////////////////
  activity(data) {
    let mapContent = '';
    //у меня немного по-другому строится сетка в css, горизонтальное заполнение идет слева направо и сверху вниз, а вертикальное наоборот
    for(let i = 0; i < 168; i++) {
      let valueLandscape = 0, valuePortrait = 0, landscapeDay = 0, landscapeHour = 0, portraitDay = 0, portraitHour = 0;
      const daysArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      if (i % 2 === 0) {
        landscapeDay = Math.floor(i / 24);
        landscapeHour = i % 24;
        //складываем 2 часа в горизонтальной
        valueLandscape = data.data[daysArray[landscapeDay]][landscapeHour] + data.data[daysArray[landscapeDay]][landscapeHour + 1];
      }

      portraitDay = i % 7;
      portraitHour = Math.floor(i / 7);
      valuePortrait = data.data[daysArray[portraitDay]][portraitHour];
      //по два элемента с картинкой для разных ориентаций
      mapContent = mapContent +
        `<div class="activity__cell">
          <div class="activity__image activity__image_${valueLandscape === 0 ? 'min' : (valueLandscape < 3 ? 'mid' : (valueLandscape < 5 ? 'max' : 'extra'))}"></div>
          <div class="activity__image activity__image_${valuePortrait === 0 ? 'min' : (valuePortrait < 3 ? 'mid' : (valuePortrait < 5 ? 'max' : 'extra'))}"></div>
        </div>`;
    }
    return `<div class="activity">
              <div class="activity__map">
                ${mapContent}
              </div>
              <ul class="activity__pointers">
                <li class="activity__gap">
                  <div class="activity__ingot">
                    <span class="activity__time-gap"></span>
                    <span class="activity__time-gap"></span>
                    <span class="activity__time-gap"></span>
                  </div>
                  <h3 class="activity__title">2 часа</h3>
                  <h3 class="activity__title">1 час</h3>
                </li>
                <li class="activity__gap">
                  <div class="activity__ingot activity__ingot_grey-dark"></div>
                  <h3 class="activity__title">0</h3>
                </li>
                <li class="activity__gap">
                  <div class="activity__ingot activity__ingot_grey-light"></div>
                  <h3 class="activity__title">1 — 2</h3>
                </li>
                <li class="activity__gap">
                  <div class="activity__ingot activity__ingot_gold-low"></div>
                  <h3 class="activity__title">3 — 4</h3>
                </li>
                <li class="activity__gap">
                  <div class="activity__ingot activity__ingot_gold"></div>
                  <h3 class="activity__title">5 — 6</h3>
                </li>
              </ul>
            </div>`;
  }

  ////////////////////////////////////////////////////////////////////////////////DIAGRAM///////////////////////////////////////////////////////
  diagram(data) {
    let donutContent = '';
    let descriptionContent = '';

    const circleLength = data.categories.reduce((prev, item) => {
      return prev + parseInt(item.valueText);
    }, 0);

    data.categories.reduce((prev, item, i) => {
      descriptionContent = descriptionContent +
        `<li class="diagram__list-line">
          <div class="diagram__line-color"></div>
          <span class="diagram__main-text">${item.title}</span>
          <span class="diagram__additional-text">${item.differenceText.slice(0, 1)}${parseInt(item.differenceText.slice(1))}</span>
          <span class="diagram__additional-text">${parseInt(item.valueText)}</span>
        </li>`;

      const currentValue = parseInt(item.valueText);
      //356 т.к. 4 пробела по 1 градусу
      const segmentLength = currentValue * 356 / circleLength;
      //центрируем первый сегмент сверху
      if (i === 0 ) {
        prev = prev + (segmentLength / 2);
      }
      donutContent = donutContent + `<circle class="diagram__donut-segment" stroke-dasharray="${segmentLength} ${360 - segmentLength}" stroke-dashoffset="${prev}"></circle>`;
      //находим отправную точку для следующей окружности с учетом пробела в градус
      return prev = prev - segmentLength - 1;
    }, 90);

    return `<div class="diagram">
              <div class="diagram__chart">
                <h3 class="diagram__donut-title">${data.totalText}</h3>
                <h4 class="diagram__donut-subtitle">${data.differenceText}</h4>
                <svg viewBox="0 0 135 135" class="diagram__donut">

                  <defs>
                    <radialGradient id="light-gold" cx="49.84%" cy="49.84%" r="58%">
                      <stop offset="81.25%" stop-color="rgba(255, 184, 0, 0.56)"/>
                      <stop offset="100%" stop-color="rgba(255, 239, 153, 0.32)"/>
                    </radialGradient>
                    <radialGradient id="light-gold-low" cx="49.84%" cy="49.84%" r="66%">
                      <stop offset="81.25%" stop-color="rgba(255, 184, 0, 0.24)"/>
                      <stop offset="100%" stop-color="rgba(255, 239, 153, 0.12)"/>
                    </radialGradient>
                    <radialGradient id="light-grey-light" cx="49.84%" cy="49.84%" r="67%">
                      <stop offset="82.81%" stop-color="rgba(166, 166, 166, 0.1725)"/>
                      <stop offset="92.19%" stop-color="rgba(203, 203, 203, 0.05)"/>
                    </radialGradient>
                    <radialGradient id="light-grey-dark" cx="49.84%" cy="49.84%" r="68%">
                      <stop offset="82.81%" stop-color="rgba(191, 191, 191, 0.345)"/>
                      <stop offset="92.19%" stop-color="rgba(228, 228, 228, 0.1)"/>
                    </radialGradient>

                    <radialGradient id="dark-gold" cx="49.84%" cy="50.16%" r="56%">
                      <stop offset="71.88%" stop-color="rgba(255, 163, 0, 0.8)"/>
                      <stop offset="100%" stop-color="rgba(91, 58, 0, 0.8)"/>
                    </radialGradient>
                    <radialGradient id="dark-gold-low" cx="49.84%" cy="50.16%" r="70%">
                      <stop offset="72.92%" stop-color="rgba(99, 63, 0, 0.8)"/>
                      <stop offset="100%" stop-color="rgba(15, 9, 0, 0.9)"/>
                    </radialGradient>
                    <radialGradient id="dark-grey-light" cx="49.84%" cy="50.16%" r="60%">
                      <stop offset="71.88%" stop-color="rgba(155, 155, 155, 0.5)"/>
                      <stop offset="100%" stop-color="rgba(56, 41, 0, 0.5)"/>
                    </radialGradient>
                    <radialGradient id="dark-grey-dark" cx="49.84%" cy="50.16%" r="60%">
                      <stop offset="71.88%" stop-color="rgba(77, 77, 77, 0.5)"/>
                      <stop offset="100%" stop-color="rgba(56, 41, 0, 0.5)"/>
                    </radialGradient>
                  </defs>
                  ${donutContent}
                </svg>
              </div>
              <ul class="diagram__list">
                ${descriptionContent}
              </ul>
            </div>`;
  }
}
const templates = new TemplateBuilder();

function setTheme() {
  favicon.href = `${pageTheme === 'dark' ? darkIcon : lightIcon}`;
  body.classList.add(`theme_${pageTheme}`);
}

window.renderTemplate = function(alias, data) {
  const template = templates[alias](data);
  return `<section class="stories" data-action="empty">
            <h1 class="stories__title">${data.title}</h1>
            <h2 class="stories__subtitle">${data.subtitle}</h2>
            ${template}
          </section>`;
}

/////////////////////////////////////////////////////////////// необходимо для разработки, закомментить перед финальной сборкой
//вызовы функций при загрузке страницы
setTheme();
body.innerHTML = window.renderTemplate(data[slideNumber - 1].alias, data[slideNumber - 1].data);

// необходимо для хот релоуда при изменении js файла
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}
///////////////////////////////////////////////////////////////
