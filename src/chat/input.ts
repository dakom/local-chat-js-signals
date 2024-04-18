import { Broadcaster, Username } from "../broadcaster";
import style from "./input.module.css"

export class Input {
    public readonly elem: HTMLDivElement;

    constructor(private username: Username, private broadcaster: Broadcaster) {
        this.elem = document.createElement('div');
        this.elem.classList.add(style.container);
    }


    render() {
        this.elem.innerHTML = `
            <input id="text" type="text" class=${style.input} placeholder="Type a message...">
            <div id="send" class=${style.button}><div>Send</div></button>
        `

        const input = this.elem.querySelector("#text") as HTMLInputElement;
        const submitButton = this.elem.querySelector("#send") as HTMLDivElement;

        const submit = () => {
            const text = input.value;
            input.value = '';
            this.broadcaster.send(this.username, text);
        }

        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                submit();
            }
        })

        submitButton.addEventListener('click', submit);
    }
}