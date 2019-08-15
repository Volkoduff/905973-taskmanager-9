export const getFilterMarkup = (filter) =>
  `<section class="main__filter filter container">
  ${filter.map((el) =>
    `<input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked
        ${el.count === 0 ? `disabled` : ``}
      />
      <label for="filter__all" class="filter__label">
     ${el.title}
      <span class="filter__all-count">${el.count}</span></label
  >`).join(``)}

</section>`;
