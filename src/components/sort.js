import {AbstractComponent} from './abstract-component';

export class Sort extends AbstractComponent {
  getTemplate() {
    return `<div class="board__filter-list">
        <a href="#" data-sort-type="default" class="board__filter">SORT BY DEFAULT</a>
        <a href="#" data-sort-type="date-up" class="board__filter">SORT BY DATE up</a>
        <a href="#" data-sort-type="date-down" class="board__filter">SORT BY DATE down</a>
  </div>`;
  }
}
