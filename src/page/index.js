import './index.css';
import data from '../../data/data.json';
// импортировал фото, чтобы вебпак проставил нужные имена
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

class TemplateBuilder {

  leaders(data) {
    let templateContent = '';
    const orderArray = [4, 2, 0, 1, 3];
    const selectedItem = data.data.users.find((user) => user.id === data.data.selectedUserId);
    const originalSelectedIndex = data.data.users.indexOf(selectedItem);
    let selectedIndex = originalSelectedIndex;
    orderArray.forEach((item) => {
      // если выбранный участник не окажется в пятерке
      if ((item === 4)&&(selectedIndex > 4 )) {
        data.data.users[4].originalIndex = selectedIndex;
        data.data.users[4] = selectedItem;
        selectedIndex = 4;
      }
      templateContent = templateContent + `<div class="leaders__column ${(item === 4)||(item === 3) ? `leaders__column_small ${(selectedIndex === 3)||(selectedIndex === 4) ? 'leaders__column_choice' : ''}` : `leaders__column_${item === 0 ? 'large' : 'medium'}`}">
                                              <div class="person ${(item === 1)||(item === 3) ? 'person_right-columns' : ''}">
                                                ${(item === 0)||(selectedIndex === item)? `<span class="person__emoji">${item === 0 ? `${data.data.emoji}` : '👍'}</span>` : ''}
                                                <div class="person__photo-container">
                                                  <img class="person__photo" src="${personsPhoto[data.data.users[item].id]}" alt="фото участника">
                                                </div>
                                                <span class="person__name">${data.data.users[item].name}</span>
                                                <span class="person__results">${data.data.users[item].valueText}</span>
                                              </div>
                                              <div class="leaders__base ${(item === 1)||(item === 3) ? 'leaders__base_right-columns' : ''}">
                                                <span class="leaders__number">${(originalSelectedIndex !== selectedIndex)&&(item === 4) ? originalSelectedIndex  : (item + 1) }</span>
                                              </div>
                                            </div>`;
    });
    return `<div class="leaders">
              ${templateContent}
            </div>`
  }
}
const templates = new TemplateBuilder();

function setTheme() {
  favicon.href = `${pageTheme === 'dark' ? darkIcon : lightIcon}`;
  body.classList.add(`theme_${pageTheme}`);
}

window.renderTemplate = function(alias, data) {
  const template = templates[alias](data);
  return `<section class="stories">
            <h1 class="stories__title">${data.data.title}</h1>
            <h2 class="stories__subtitle">${data.data.subtitle}</h2>
            ${template}
          </section>`;
}

setTheme();
body.innerHTML = window.renderTemplate(data[slideNumber - 1].alias, data[slideNumber - 1]);

// необходимо для хот релоуда при изменении js файла
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}
