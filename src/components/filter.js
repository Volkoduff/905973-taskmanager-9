export const getFilterMarkup = (filter) =>
  `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
      ${filter.count === 0 ? `disabled` : ``}
    />
    <label for="filter__all" class="filter__label">
   ${filter.title}
    <span class="filter__all-count">${filter.count}</span></label>`
