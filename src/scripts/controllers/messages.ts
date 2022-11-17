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
    private readonly getActor: (
      id: string
    ) => Promise<Messages.Actor | undefined>,
    private readonly getObjectDoc: (
      id: string
    ) => Promise<Messages.ObjectDocWithId | undefined>,
    private readonly setMessages: SetState<MessageDisplay[] | undefined>,
    private readonly messageIdToIdx: Map<string, number> = new Map()
  ) {}

  private async buildMessageDisplay(
    message: Messages.MessageWithId
  ): Promise<MessageDisplay | undefined> {
    if (!!message.origin) return;

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
      if (this.messageIdToIdx.has(message.id)) continue;

      const display = await this.buildMessageDisplay(message);
      if (display == null) return;

      this.setMessages((prevState) => {
        if (prevState == null) {
          this.messageIdToIdx.set(message.id, 0);
          return [display];
        } else {
          this.messageIdToIdx.set(message.id, prevState.length);
          return [...prevState, display];
        }
      });
    }
  }
}
