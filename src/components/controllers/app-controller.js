import {BoardController} from './../controllers/board-controller';
import {taskFilters, tasksData} from './../data';
import {render} from './../utils';
import {SiteMenu} from './../menu';
import {Statistic} from './../statistic';
import {Search} from './../search';
import {SearchController} from './../controllers/search-controller';
import {Filter} from './../filter';

const ControlId = {
  tasksId: `control__task`,
  statisticId: `control__statistic`,
  newTaskId: `control__new-task`,
};

export class AppController {
  constructor(menuContainer, mainContainer) {
    this._menuContainer = menuContainer;
    this._mainContainer = mainContainer;
    this._siteMenu = new SiteMenu();
    this._search = new Search();
    this._statistics = new Statistic();
    this._filter = new Filter(taskFilters);
  }

  init() {
    render(this._menuContainer, this._siteMenu.getElement());
    render(this._mainContainer, this._search.getElement());
    render(this._mainContainer, this._filter.getElement());
    render(this._mainContainer, this._statistics.getElement());
    this._statistics.getElement().classList.add(`visually-hidden`);

    this.boardController = new BoardController(this._mainContainer);
    this.boardController.show(tasksData());

    this._siteMenu.getElement().addEventListener(`change`, (evt) => this._componentSwitcher(evt));

    this.searchController = new SearchController(this._mainContainer, this._search, this.onSearchBackButtonClick.bind(this), this.boardController._onDataChange.bind(this.boardController), this.boardController.tasks);
    this._search.getElement().addEventListener(`click`, () => this._showSearch());
  }

  _statisticShow() {
    this._statistics.getElement().classList.remove(`visually-hidden`);
  }

  _componentSwitcher(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    switch (evt.target.id) {
      case ControlId.tasksId:
        this._statistics.hide();
        this.searchController.hide();
        this.boardController.show(this.boardController.tasks);
        break;
      case ControlId.statisticId:
        this.boardController.hide();
        this.searchController.hide();
        this._statisticShow();
        break;
      case ControlId.newTaskId:
        this.searchController.hide();
        this.boardController.show(this.boardController.tasks);
        this.boardController.createTask();
        this._siteMenu.getElement().querySelector(`#${ControlId.tasksId}`).checked = true;
        break;
    }
  }
  _showSearch() {
    this._statistics.hide();
    this.boardController.hide();
    this.searchController.show(this.boardController.tasks);
  }
  onSearchBackButtonClick() {
    this._statistics.hide();
    this.searchController.hide();
    this.boardController.show(this.boardController.tasks);
  }
}
