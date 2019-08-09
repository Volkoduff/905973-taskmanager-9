import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFilterMarkup} from './components/filter.js';
import {getBoardMarkup} from './components/board.js';
import {getTaskEditMarkup} from './components/task-edit.js';
import {getTaskMarkup} from './components/task.js';
import {getLoadMoreButtonMarkup} from './components/load-more-button.js';

const getArrayWithElementsFromMarkup = (markup) => {
  let tempDiv = document.createElement(`div`);
  tempDiv.innerHTML = markup;
  let elements = Array.from(tempDiv.children);
  return elements;
};

const componentRendering = (containerName, markup) => {
  getArrayWithElementsFromMarkup(markup).forEach((element) => containerName.append(element));
};

const multipleComponentRendering = (containerName, markup, multiplyAmount) => {
  for (let i = 0; i <= multiplyAmount; i++) {
    componentRendering(containerName, markup);
  }
};

const menuContainer = document.querySelector(`.control`);
componentRendering(menuContainer, getMenuMarkup());

const mainContainer = document.querySelector(`.main`);
componentRendering(mainContainer, getSearchMarkup());
componentRendering(mainContainer, getFilterMarkup());
componentRendering(mainContainer, getBoardMarkup());

const boardContainer = document.querySelector(`.board`);
componentRendering(boardContainer, getLoadMoreButtonMarkup());

const boardTasks = document.querySelector(`.board__tasks`);
componentRendering(boardTasks, getTaskEditMarkup());
multipleComponentRendering(boardTasks, getTaskMarkup(), 3);
