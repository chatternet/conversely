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
    private readonly getIdName: (id: string) => Promise<IdName | undefined>,
    private readonly getObjectDoc: (
      id: string
    ) => Promise<Messages.ObjectDocWithId | undefined>,
    private readonly setMessages: SetState<MessageDisplay[] | undefined>
  ) {}

  private async buildMessageDisplay(
    message: Messages.MessageWithId
  ): Promise<MessageDisplay | undefined> {
    if (!!message.origin) return;

    const objectDoc = await this.getObjectDoc(message.id);
    if (!objectDoc) return;

    let content: string | undefined = undefined;
    if (objectDoc.content && typeof objectDoc.content === "string")
      content = objectDoc.content;
    if (!content) return;

    const date = message.published;

    const actor = await this.getIdName(message.actor);
    if (!actor) return;

    return {
      id: message.id,
      date,
      actor,
      content,
    };
  }

  async more(num: number) {
    let count = 0;
    while (count < num) {
      const message = await this.messageIter.next();
      if (message == null) break;
      this.buildMessageDisplay(message)
        .then((x) => {
          if (x == null) return;
          this.setMessages((prevState) =>
            prevState != null ? [...prevState, x] : [x]
          );
        })
        .catch((x) => console.error(x));
    }
  }
}
