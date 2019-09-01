export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = `beforeend`) => {
  switch (place) {
    case `afterbegin`:
      container.prepend(element);
      break;
    case `beforeend`:
      container.append(element);
      break;
    case `beforebegin`:
      container.insertAdjacentHTML(`beforebegin`, element);
      break;
    case `afterend`:
      container.insertAdjacentHTML(`afterend`, element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
