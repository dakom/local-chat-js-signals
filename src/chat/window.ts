import { Signal } from "signal-polyfill";
import { Broadcaster, DiffId, Username} from "../broadcaster";
import { Display } from "./display";
import { Input } from "./input";
import style from "./window.module.css"
import { effect } from "../polyfill";
import { EditModal } from "./edit";

type EditModalState = {id: DiffId, text: string};
const nullEditModalState = {id: -1, text: ""};

export class ChatWindow {
    public readonly elem: HTMLDivElement;
    public display: Display;
    private editModalState:Signal.State<EditModalState>;
    private input: Input;

    constructor(public readonly username: Username, private broadcaster: Broadcaster) {
        this.elem = document.createElement('div');
        this.elem.classList.add(style.container);

        broadcaster.createChannel(username);

        this.editModalState = new Signal.State(nullEditModalState);
        this.display = new Display(username, broadcaster, this.editText)
        this.input = new Input(username, broadcaster);
    }

    editText = (id: DiffId, text: string) => {
        this.editModalState.set({id, text});
    }

    render() {

        this.elem.innerHTML = `
            <div class="${style.username}">${this.username}</div>
            <div id="display" class="${style.display}"></div>
            <div id="input" class="${style.input}"></div>
            <div id="modal" class="${style.modal}"></div>
        `;


        this.elem.querySelector("#display")!.appendChild(this.display.elem);
        this.display.render();

        this.elem.querySelector("#input")!.appendChild(this.input.elem);
        this.input.render();

        const modalElem = this.elem.querySelector("#modal")!;
        let editModal: EditModal | undefined; 

        effect(() => {
            const state = this.editModalState.get();

            if(state.id === nullEditModalState.id && editModal !== undefined) {
                editModal.destroy();
                editModal = undefined;
                modalElem.classList.remove(style.showModal);
            } else if(state.id !== nullEditModalState.id && editModal === undefined) {
                editModal = new EditModal(
                    state.text, 
                    (text) => {
                        this.broadcaster.edit(state.id, text);
                        this.editModalState.set(nullEditModalState);
                    },
                    () => {
                        this.editModalState.set(nullEditModalState);
                    }
                );
                modalElem.appendChild(editModal.elem);
                modalElem.classList.add(style.showModal);
                editModal.render();
            }
        })
    }
}