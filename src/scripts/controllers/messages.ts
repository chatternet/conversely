import type { SetState } from "../commonutils.js";
import type { IdName, Messages, MessageIter } from "chatternet-client-http";

export interface MessageDisplay {
  id: string;
  date: string;
  actor: IdName;
  content: string;
}

export class MessageDisplayGrouper {
  constructor(
    private readonly messageIter: MessageIter,
    private readonly viewMessage: (
      message: Messages.MessageWithId
    ) => Promise<void>,
    private readonly getMessage: (
      id: string
    ) => Promise<Messages.MessageWithId | undefined>,
    private readonly getActor: (
      id: string
    ) => Promise<Messages.Actor | undefined>,
    private readonly getObjectDoc: (
      id: string
    ) => Promise<Messages.ObjectDocWithId | undefined>,
    private readonly setMessages: SetState<MessageDisplay[] | undefined>,
    private readonly seenMessagesId: Set<string> = new Set()
  ) {}

  private async buildMessageDisplay(
    message: Messages.MessageWithId,
    depth: number = 0
  ): Promise<MessageDisplay | undefined> {
    if (this.seenMessagesId.has(message.id)) return;
    this.seenMessagesId.add(message.id);

    if (message.origin) {
      if (depth > 0) return;
      const origin = await this.getMessage(message.origin);
      if (!origin) return;
      return await this.buildMessageDisplay(origin, depth + 1);
    }

    const [objectId] = message.object;
    const objectDoc = await this.getObjectDoc(objectId);
    if (!objectDoc) return;

    let content: string | undefined = undefined;
    if (objectDoc.content && typeof objectDoc.content === "string")
      content = objectDoc.content;
    if (!content) return;

    const date = message.published;

    const actor = await this.getActor(message.actor);
    if (!actor) return;

    // TODO: add flag in display to indicate if flag is from inbox
    // - calculate inbox: store following and contacts separately
    // - if actor is contact and audience is in following, flag as inbox message
    // - view only inbox messages

    return {
      id: message.id,
      date,
      actor: { id: actor.id, name: actor.name },
      content,
    };
  }

  async more(num: number) {
    let count = 0;
    while (count < num) {
      const message = await this.messageIter.next();
      if (message == null) break;

      const display = await this.buildMessageDisplay(message);
      if (display == null) continue;

      this.setMessages((prevState) => {
        if (prevState == null) {
          return [display];
        } else {
          const idx = prevState.findIndex((x) => x.id === display.id);
          // TODO: want to show how many views a displayed message has
          if (idx >= 0) return prevState;
          // at this stage the message will be viewed (and isn't already in list)
          this.viewMessage(message).then(() => {
            console.debug("viewed: %s (%s): %s", message.id, message.origin, message.object);
          }).catch((x) => console.error(x));
          return [...prevState, display];
        }
      });
    }
  }
}
