import { DiffId } from "../broadcaster";
import style from "./edit.module.css"

export class EditModal {
    public readonly elem: HTMLDivElement;

    constructor(private text: string, private save: (text: string) => void, private cancel: () => void) {
        this.elem = document.createElement('div');
        this.elem.classList.add(style.container);
    }

    render() {
        this.elem.innerHTML = `
            <div class="${style.title}">Edit Message</div>
            <textarea id="textarea" class="${style.textarea}">${this.text}</textarea>
            <div class="${style.buttons}">
                <div id="save" class="${style.button} ${style.save}">Save</div>
                <div id="cancel" class="${style.button} ${style.cancel}">Cancel</div>
            </div>
        `;

        const textarea = this.elem.querySelector(`#textarea`) as HTMLTextAreaElement;
        const saveElem = this.elem.querySelector(`#save`) as HTMLDivElement;
        const cancelElem = this.elem.querySelector(`#cancel`) as HTMLDivElement;

        saveElem.addEventListener('click', () => {
            this.save(textarea.value);
        })

        cancelElem.addEventListener('click', () => {
            this.cancel(); 
        })
    }

    destroy() {
        this.elem.remove();
    }
}