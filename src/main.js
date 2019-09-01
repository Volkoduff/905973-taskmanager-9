import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getFilterWrapMarkup} from './components/filter-wrap';
import {getFilterMarkup} from './components/filter';
import {BoardController} from './components/controllers/board-controller';
import {taskFilters, tasksData} from './components/data';

const componentRendering = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const filterRender = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, data
    .map(getFilterMarkup)
    .join(``));
};

const menuContainer = document.querySelector(`.control`);
componentRendering(menuContainer, getMenuMarkup());

const mainContainer = document.querySelector(`.main`);
componentRendering(mainContainer, getSearchMarkup());
componentRendering(mainContainer, getFilterWrapMarkup());

const mainFilterContainer = document.querySelector(`.main__filter`);
filterRender(mainFilterContainer, taskFilters);

const boardController = new BoardController(mainContainer, tasksData());
boardController.init();
