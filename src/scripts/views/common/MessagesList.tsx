import type { UseState, SetState } from "../../commonutils";
import { IdToName } from "../../controllers/interfaces";
import {
  MessageDisplay,
  MessageDisplayGrouper,
} from "../../controllers/messages";
import { MessageItem, MessageItemProps } from "./MessageItem";
import type { MessageIter, Model } from "chatternet-client-http";
import React, { useEffect, useState, MouseEvent } from "react";
import { Button, Card } from "react-bootstrap";

export interface MessagesListProps {
  loggedIn: boolean;
  actorId: string | undefined;
  pageSize: number;
  allowMore: boolean;
  refreshCount: number;
  buildMessageIter: (actorId?: string) => Promise<MessageIter | undefined>;
  setIdToName: SetState<IdToName>;
  acceptMessage: (
    message: Model.Message,
    allowActorId?: string,
    allowAudienceId?: string
  ) => Promise<boolean>;
  viewMessage: (message: Model.Message) => Promise<void>;
  getMessage: (id: string) => Promise<Model.Message | undefined>;
  getActor: (id: string) => Promise<Model.Actor | undefined>;
  getBody: (id: string) => Promise<Model.Body | undefined>;
  deleteMessage: (messageId: string) => Promise<void>;
  messagesDisplayProps: Omit<MessageItemProps, "message" | "deleteMessage">;
}

export function MessagesList(props: MessagesListProps) {
  const [messages, setMessages]: UseState<MessageDisplay[] | undefined> =
    useState();
  const [messageIter, setMessageIter]: UseState<MessageIter | undefined> =
    useState();
  const [messageDisplayGrouper, setMessageDisplayGrouper]: UseState<
    MessageDisplayGrouper | undefined
  > = useState();
  const [pageSize, setPageSize]: UseState<number> = useState(props.pageSize);

  async function deleteMessage(messageId: string): Promise<void> {
    await props.deleteMessage(messageId);
    setMessages((prevState) => prevState?.filter((x) => x.id != messageId));
  }

  useEffect(() => {
    if (!props.loggedIn) return;
    props
      .buildMessageIter(props.actorId)
      .then(setMessageIter)
      .catch((x) => console.error(x));
  }, [props.loggedIn]);

  useEffect(() => {
    if (!messageIter) return;
    setMessageDisplayGrouper(
      new MessageDisplayGrouper(
        messageIter,
        props.setIdToName,
        (message) => {
          return props.actorId != null
            ? props.acceptMessage(
                message,
                props.actorId,
                `${props.actorId}/followers`
              )
            : props.acceptMessage(message);
        },
        props.viewMessage,
        props.getMessage,
        props.getActor,
        props.getBody,
        setMessages
      )
    );
  }, [messageIter]);

  useEffect(() => {
    if (!messageDisplayGrouper) return;
    messageDisplayGrouper.more(props.pageSize).catch((x) => console.error(x));
  }, [messageDisplayGrouper]);

  // when the refresh count goes up, reset the message iteration
  useEffect(() => {
    if (!props.loggedIn) return;
    setMessageDisplayGrouper(undefined);
    props
      .buildMessageIter(props.actorId)
      .then(setMessageIter)
      .catch((x) => console.error(x));
  }, [props.refreshCount, props.loggedIn]);

  function loadMore(event: React.MouseEvent) {
    event.preventDefault();
    setPageSize((x) => x + props.pageSize);
  }

  return (
    <>
      {messages != null && messages.length > 0 ? (
        <div className="list-group">
          {messages.slice(0, pageSize).map((x) => (
            <MessageItem
              key={x.id}
              message={x}
              deleteMessage={deleteMessage}
              {...props.messagesDisplayProps}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded m-3">
          <Card.Body>
            <Card.Text className="text-secondary text-center">
              No messages to display.
            </Card.Text>
          </Card.Body>
        </Card>
      )}
      {props.allowMore ? (
        <div className="text-center my-3">
          <Button onClick={loadMore}>Load more</Button>
        </div>
      ) : null}
    </>
  );
}
