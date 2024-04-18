# [Play Here](https://dakom.github.io/local-chat-js-signals)

Local chat w/ [JS Signals](https://github.com/tc39/proposal-signals)

It's not really _chat_, i.e. no text is sent over the internet, just local between the windows

Supports editing and deleting messages (by hovering over the message in the author's window)

Test case here is for the following, on top of lossy signals:

1. No missed updates
2. Efficient
    - Only affects the exact dom element being targetted
    - Culls seen updates from memory over time
3. No diffing
4. Vanilla ts

The overall idea is that the signal contains an array of diffs to apply.
There's no guarantee _when_ the user will get the signal - but when they do, it's guaranteed to be a correct state.
Then, after the diffs are applied, it can wipe them out from the queue (by way of filtering them out of the next batch)

To support multiple users, each one gets their own copy of this signal, complete with their own tracking mechanism.
Broadasting a message sends a message out to all the users

For exploration and debugging - all the diffs are logged in the console