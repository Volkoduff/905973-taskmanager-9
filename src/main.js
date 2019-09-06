import {BoardController} from './components/controllers/board-controller';
import {taskFilters, tasksData} from './components/data';
import {render} from './components/utils';
import {SiteMenu} from './components/menu';
import {Statistic} from './components/statistic';
import {Search} from './components/search';
import {Filter} from './components/filter';

const ControlId = {
  tasksId: `control__task`,
  statisticId: `control__statistic`,
  newTaskId: `control__new-task`,
};

const menuContainer = document.querySelector(`.control`);
const mainContainer = document.querySelector(`.main`);
const siteMenu = new SiteMenu();
const search = new Search();
const statistics = new Statistic();

const filter = new Filter(taskFilters);
render(menuContainer, siteMenu.getElement());
render(mainContainer, search.getElement());

render(mainContainer, filter.getElement());
const boardController = new BoardController(mainContainer, tasksData());
boardController.init();

render(mainContainer, statistics.getElement());
statistics.getElement().classList.add(`visually-hidden`);

siteMenu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }
  switch (evt.target.id) {
    case ControlId.tasksId:

      statistics.getElement().classList.add(`visually-hidden`);
      boardController.show();
      break;
    case ControlId.statisticId:
      boardController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
    case ControlId.newTaskId:
      boardController.createTask();
      siteMenu.getElement().querySelector(`#${ControlId.tasksId}`).checked = true;
      break;
  }
});
