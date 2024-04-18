import { Signal } from "signal-polyfill";

export type Username = string;

export class Broadcaster {
    channels: Map<Username, Channel>;

    private diffId:DiffId = 0;

    constructor() {
        this.channels = new Map();
    }

    createChannel(username: string) {
        this.channels.set(username, new Channel());
    }

    send(username: Username, text: string) {
        const diffId = this.diffId++;
        for(const channel of this.channels.values()) {
            channel.send(username, text, diffId);
        }
    }

    remove(id: DiffId) {
        const diffId = this.diffId++;
        for(const channel of this.channels.values()) {
            channel.remove(id, diffId);
        }
    }

    edit(id: DiffId, text: string) {
        const diffId = this.diffId++;
        for(const channel of this.channels.values()) {
            channel.edit(id, text, diffId);
        }
    }
}

type ChannelDiffs = DiffWithId[];

export type DiffId = number;

type Diff = {
    kind: "push",
    username: Username,
    text: string,
} | {
    kind: "remove",
    removeId: DiffId 
} | {
    kind: "edit",
    editId: DiffId,
    text: string
}

type DiffWithId = Diff & {
    id: DiffId
}

export class Channel {
    public readonly signal: Signal.State<ChannelDiffs>;
    public renderedId: DiffId = -1;

    constructor() {
        this.signal = new Signal.State<ChannelDiffs>([])
    }

    pushDiff(diff: Diff, id: DiffId) {
        // cull the already rendered diffs
        const diffs = this.signal.get().filter(diff => diff.id > this.renderedId);
        diffs.push({...diff, id});
        this.signal.set(diffs);
    }

    send(username: Username, text: string, id: DiffId) {
        this.pushDiff({
            kind: "push",
            username,
            text,
        }, id);
    }

    remove(removeId: DiffId, id: DiffId) {
        this.pushDiff({
            kind: "remove",
            removeId,
        }, id);
    }

    edit(editId: DiffId, text: string, id: DiffId) {
        this.pushDiff({
            kind: "edit",
            editId,
            text,
        }, id);
    }
}