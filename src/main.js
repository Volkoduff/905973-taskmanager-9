import {AppController} from './components/controllers/app-controller';

const menuContainer = document.querySelector(`.control`);
const mainContainer = document.querySelector(`.main`);

const appController = new AppController(menuContainer, mainContainer);
appController.init();
