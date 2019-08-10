import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getFilterMarkup} from './components/filter';
import {getBoardMarkup} from './components/board';
import {getTaskEditMarkup} from './components/task-edit';
import {getTaskMarkup} from './components/task';
import {getLoadMoreButtonMarkup} from './components/load-more-button';

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
