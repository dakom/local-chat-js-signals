import { Broadcaster, Channel, DiffId, Username } from "../broadcaster";
import { effect } from "../polyfill";
import style from "./display.module.css"

export class Display {
    public readonly elem: HTMLDivElement;
    private channel: Channel;
    messageElems: Map<DiffId, HTMLDivElement> = new Map();

    constructor(private username: Username, private broadcaster: Broadcaster, private openEditModal: (id: DiffId, text: string) => void){
        this.elem = document.createElement('div');
        this.elem.classList.add(style.container);
        this.channel = broadcaster.channels.get(username)!;
    }

    render() {
        effect(() => {
            const diffs = this.channel.signal.get();
            for(const diff of diffs) {
                switch(diff.kind) {
                    case "push": {
                        const messageElem = document.createElement('div');
                        messageElem.classList.add(style.message);
                        if(diff.username === this.username) {
                            messageElem.innerHTML = `
                                <div class="${style.myUsername}">${diff.username}:</div> 
                                <div class="${style.text}">${diff.text}</div>
                                <div class="${style.editAndDelete}">
                                    <div class="${style.edit}">[EDIT]</div>
                                    <div class="${style.delete}">[DELETE]</div>
                                </div>
                            `;

                            const editAndDelete = messageElem.querySelector(`.${style.editAndDelete}`)! as HTMLDivElement;
                            const editElem = editAndDelete.querySelector(`.${style.edit}`)! as HTMLDivElement;
                            const deleteElem = editAndDelete.querySelector(`.${style.delete}`)! as HTMLDivElement;

                            messageElem.addEventListener("mouseenter", () => {
                                editAndDelete.classList.add(style.show);
                            })
                            messageElem.addEventListener("mouseleave", () => {
                                editAndDelete.classList.remove(style.show);
                            })

                            deleteElem.addEventListener("click", () => {
                                this.broadcaster.remove(diff.id);
                            })

                            editElem.addEventListener("click", () => {
                                const currentText = messageElem.querySelector(`.${style.text}`)!.textContent!;
                                this.openEditModal(diff.id, currentText);
                            })

                        } else {
                            messageElem.innerHTML = `
                                <div class="${style.otherUsername}">${diff.username}:</div> 
                                <div class="${style.text}">${diff.text}</div>
                            `;
                        }
                        this.messageElems.set(diff.id, messageElem);
                        this.elem.appendChild(messageElem);
                        break;
                    }

                    case "remove": {
                        this.messageElems.get(diff.removeId)!.remove();
                        this.messageElems.delete(diff.removeId);
                        break;
                    }

                    case "edit": {
                        const messageElem = this.messageElems.get(diff.editId)!;
                        const textElem = messageElem.querySelector(`.${style.text}`)! as HTMLDivElement;
                        textElem.textContent = diff.text;
                        break;
                    }
                    default: break;
                }

                this.channel.renderedId = diff.id;
            }

        })
    }
}