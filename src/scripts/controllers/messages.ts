import type { SetState } from "../commonutils.js";
import { IdToName } from "./interfaces.js";
import type { Model, MessageIter } from "chatternet-client-http";

export interface MessageDisplayNote {
  id: string;
  content: string;
  attributedTo: string;
}

export interface MessageDisplay {
  id: string;
  timestamp: number;
  note: MessageDisplayNote;
  inReplyTo?: MessageDisplayNote;
}

function extractNote(objectDoc: Model.Body): MessageDisplayNote | undefined {
  if (objectDoc.type !== "Note") return;
  if (objectDoc.mediaType !== "text/markdown") return;
  if (!objectDoc.content || typeof objectDoc.content !== "string") return;
  if (!objectDoc.attributedTo || typeof objectDoc.attributedTo !== "string")
    return;
  return {
    id: objectDoc.id,
    content: objectDoc.content,
    attributedTo: objectDoc.attributedTo,
  };
}

export class MessageDisplayGrouper {
  constructor(
    private readonly messageIter: MessageIter,
    private readonly setIdToName: SetState<IdToName>,
    private readonly acceptMessage: (
      message: Model.Message
    ) => Promise<boolean>,
    private readonly viewMessage: (message: Model.Message) => Promise<void>,
    private readonly getMessage: (
      id: string
    ) => Promise<Model.Message | undefined>,
    private readonly getActor: (id: string) => Promise<Model.Actor | undefined>,
    private readonly getBody: (id: string) => Promise<Model.Body | undefined>,
    private readonly setMessages: SetState<MessageDisplay[] | undefined>,
    private readonly seenMessagesId: Set<string> = new Set()
  ) {}

  private async updateActorName(actorId: string): Promise<void> {
    const actor = await this.getActor(actorId);
    if (!actor) return;
    const actorName = actor.name;
    if (!actorName) return;
    // current as of now
    const timestamp = new Date().getTime() * 1e-3;
    this.setIdToName((x) => x.update(actorId, actorName, timestamp));
  }

  private async buildMessageDisplay(
    message: Model.Message,
    referrer?: Model.Message
  ): Promise<MessageDisplay | undefined> {
    if (this.seenMessagesId.has(message.id)) return;
    this.seenMessagesId.add(message.id);

    // check if the received message should be shown
    if (!(await this.acceptMessage(referrer != null ? referrer : message)))
      return;

    if (message.origin) {
      // don't follow multiple indirections
      if (referrer != null) return;
      const origin = await this.getMessage(message.origin);
      if (!origin) return;
      return await this.buildMessageDisplay(origin, message);
    }

    const [objectId] = message.object;
    const objectDoc = await this.getBody(objectId);
    if (!objectDoc) return;

    // display only notes from message actor
    const note = extractNote(objectDoc);
    if (!note) return;
    if (message.actor !== note.attributedTo) return;
    await this.updateActorName(message.actor);

    const inReplyToDoc = objectDoc.inReplyTo
      ? await this.getBody(objectDoc.inReplyTo)
      : undefined;
    const inReplyTo = inReplyToDoc ? extractNote(inReplyToDoc) : undefined;
    if (inReplyTo) await this.updateActorName(inReplyTo.attributedTo);

    const date = message.published;
    const timestamp = new Date(date).getTime() * 1e-3;

    return {
      id: message.id,
      timestamp,
      note,
      inReplyTo,
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
      const display = await this.buildMessageDisplay(message);

      if (display != null) {
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

      // enough display messages are built and all servers are visited
      if (count >= num && this.messageIter.getPageNumber() > 0) break;
    }
  }
}
