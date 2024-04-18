import style from "./loading.module.css";
import { CONFIG } from "./config";

export class LoadingScreen {
    public readonly elem: HTMLDivElement;

    constructor() {
        this.elem = document.createElement('div');
        this.elem.classList.add(style.container);
    }

    render(onStart: () => void) {
        this.elem.innerHTML = `
            <div id="start" class="${style.button}">Start</div>
            <a class="${style.github}" href="https://github.com/dakom/local-chat-js-signals">
                <img class="${style.githubImage}" src="image/github-mark.svg">
                <div class="${style.githubText}">github repo</div>
            </a>
        `

        const clickHandler = () => {
            onStart();
        }

        // wait for user to press start to create audio context and begin mixer etc.
        // since some devices require user interaction to create audio context
        this.elem.querySelector("#start")!.addEventListener('click', clickHandler)

        if(CONFIG.DEBUG_AUTO_START) {
            // effect won't be seen if we set immediately
            queueMicrotask(clickHandler);
        }
    }
}