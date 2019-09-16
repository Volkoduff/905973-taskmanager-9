import {BoardController} from './../controllers/board-controller';
import {tasksData} from './../data';
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
    this._filter = new Filter();
  }

  init() {
    render(this._menuContainer, this._siteMenu.getElement());
    render(this._mainContainer, this._search.getElement());

    this._filter.init(tasksData());
    render(this._mainContainer, this._filter.getElement());

    this.boardController = new BoardController(this._mainContainer);
    this.boardController.show(tasksData());

    this._siteMenu.getElement().addEventListener(`change`, (evt) => this._componentSwitcher(evt));

    this.searchController = new SearchController(this._mainContainer, this._search, this.onSearchBackButtonClick.bind(this), this.boardController._onDataChange.bind(this.boardController), this.boardController.tasks);
    this._search.getElement().addEventListener(`click`, () => this._showSearch());

    this.statistics = new Statistic(this.boardController.tasks);
    render(this._mainContainer, this.statistics.getElement());
    this.statistics.getElement().classList.add(`visually-hidden`);
  }

  _statisticShow() {
    this.statistics.getElement().classList.remove(`visually-hidden`);
  }

  _componentSwitcher(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    switch (evt.target.id) {
      case ControlId.tasksId:
        this.statistics.hide();
        this.searchController.hide();
        this.boardController.show(this.boardController.tasks);
        break;
      case ControlId.statisticId:
        this.boardController.hide();
        this.searchController.hide();
        this._statisticShow();
        this.statistics.init(this.boardController.tasks);
        break;
      case ControlId.newTaskId:
        this.statistics.hide();
        this.searchController.hide();
        this.boardController.show(this.boardController.tasks);
        this.boardController.createTask();
        this._siteMenu.getElement().querySelector(`#${ControlId.tasksId}`).checked = true;
        break;
    }
  }
  _showSearch() {
    this.statistics.hide();
    this.boardController.hide();
    this.searchController.show(this.boardController.tasks);
  }
  onSearchBackButtonClick() {
    this.statistics.hide();
    this.searchController.hide();
    this.boardController.show(this.boardController.tasks);
  }
}
