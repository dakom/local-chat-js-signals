import { Broadcaster } from './broadcaster';
import { ChatWindow } from './chat/window';
import { CONFIG } from './config';
import { LoadingScreen } from './loading';
import style from './main.module.css';
// main container
const main = document.querySelector('#main') as HTMLDivElement;
main.classList.add(style.container);

// quick 'n dirty responsiveness
// everything is in rem, so just scale the root font size
const root = document.querySelector(":root") as HTMLElement;
function updateWindowSize() {
    const { innerWidth } = window;
    const scaleRatio = innerWidth / 1920;

    root.style.fontSize = `${16 * scaleRatio}px`;
}

window.addEventListener('resize', updateWindowSize);
updateWindowSize();

// initial state

const loadingScreen = new LoadingScreen();
main.appendChild(loadingScreen.elem);

loadingScreen.render(async () => {
    loadingScreen.elem.remove();
    const gridElem = document.createElement('div');
    gridElem.classList.add(style.grid);
    main.appendChild(gridElem);

    const broadcaster = new Broadcaster();

    const chatWindows = CONFIG.USERNAMES.map(username => new ChatWindow(username, broadcaster));

    chatWindows.forEach(chatWindow => {
        const elem = document.createElement('div');
        elem.classList.add(style.chatWindow);
        elem.appendChild(chatWindow.elem);
        gridElem.appendChild(elem);
        chatWindow.render();
    });

    if(CONFIG.DEBUG_INITIAL_STATE) {
        broadcaster.send(CONFIG.USERNAMES[1], "Hello, world!");
        chatWindows[1].editText(0, "Hello, world! (edited)");
    }

})