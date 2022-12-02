import type { SetState } from "../commonutils.js";
import { IdToName } from "./interfaces.js";
import type { Messages, MessageIter } from "chatternet-client-http";

export interface MessageDisplay {
  id: string;
  timestamp: number;
  actorId: string;
  content: string;
}

export class MessageDisplayGrouper {
  constructor(
    private readonly messageIter: MessageIter,
    private readonly setIdToName: SetState<IdToName>,
    private readonly acceptMessage: (
      message: Messages.MessageWithId
    ) => Promise<boolean>,
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
    indirect?: Messages.MessageWithId
  ): Promise<MessageDisplay | undefined> {
    if (this.seenMessagesId.has(message.id)) return;
    this.seenMessagesId.add(message.id);

    // check if the received message should be shown
    if (!(await this.acceptMessage(indirect != null ? indirect : message)))
      return;

    if (message.origin) {
      // don't follow multiple indirections
      if (indirect != null) return;
      const origin = await this.getMessage(message.origin);
      if (!origin) return;
      return await this.buildMessageDisplay(origin, message);
    }

    const [objectId] = message.object;
    const objectDoc = await this.getObjectDoc(objectId);
    if (!objectDoc) return;

    let content: string | undefined = undefined;
    if (objectDoc.content && typeof objectDoc.content === "string")
      content = objectDoc.content;
    if (!content) return;

    const date = message.published;
    const timestamp = new Date(date).getTime() * 1e-3;

    const actor = await this.getActor(message.actor);
    if (!actor) return;
    if (actor.name)
      this.setIdToName((x) => x.update(actor.id, actor.name, timestamp));

    return {
      id: message.id,
      timestamp,
      actorId: actor.id,
      content,
    };
  }

  /**
   * Add at least `num` display messages to the messages state, if this many
   * messages can be retrieved from the local store and servers.
   *
   * Will typically add more than `num` as it will iterate through a full page
   * from the local store and each server. This is to ensure that the final
   * sort order doesn't change when asking for more subsequently.
   *
   * @param num try to build at least this many display messages
   */
  async more(num: number) {
    let count = 0;
    for await (const message of this.messageIter.messages()) {
      // enough display messages are built and all servers are visited
      if (count >= num && this.messageIter.getNumCycles() > 0) break;

      const display = await this.buildMessageDisplay(message);
      if (display == null) continue;

      this.setMessages((prevState) => {
        prevState = prevState == null ? [] : prevState;

        // don't show the same message multiple times
        const idx = prevState.findIndex((x) => x.id === display.id);
        if (idx >= 0) return prevState;

        // trigger side effects for viewed messages
        this.viewMessage(message).catch((x) => console.error(x));
        // count towards list size
        count += 1;

        // rebuild the list
        const newState = [...prevState, display];
        newState.sort((a, b) => b.timestamp - a.timestamp);
        return newState;
      });
    }
  }
}
