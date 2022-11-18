import type { UseState } from "../../commonutils";
import {
  MessageDisplay,
  MessageDisplayGrouper,
} from "../../controllers/messages";
import { MessageItem, MessageItemProps } from "./MessageItem";
import type {
  ObjectDocWithId,
  MessageIter,
  Messages,
} from "chatternet-client-http";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

export interface MessagesListProps {
  loggedIn: boolean;
  pageSize: number;
  allowMore: boolean;
  refreshCount: number;
  buildMessageIter: () => Promise<MessageIter | undefined>;
  getActor: (id: string) => Promise<Messages.Actor | undefined>;
  getObjectDoc: (id: string) => Promise<ObjectDocWithId | undefined>;
  messagesDisplayProps: Omit<MessageItemProps, "message">;
}

export function MessagesList(props: MessagesListProps) {
  const [messages, setMessages]: UseState<MessageDisplay[] | undefined> =
    useState();
  const [messageIter, setMessageIter]: UseState<MessageIter | undefined> =
    useState();
  const [messageDisplayGrouper, setMessageDisplayGrouper]: UseState<
    MessageDisplayGrouper | undefined
  > = useState();

  useEffect(() => {
    if (!props.loggedIn) return;
    props
      .buildMessageIter()
      .then(setMessageIter)
      .catch((x) => console.error(x));
  }, [props.loggedIn]);

  useEffect(() => {
    if (!messageIter) return;
    setMessageDisplayGrouper(
      new MessageDisplayGrouper(
        messageIter,
        props.getActor,
        props.getObjectDoc,
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
    setMessages(undefined);
    setMessageDisplayGrouper(undefined);
    props
      .buildMessageIter()
      .then(setMessageIter)
      .catch((x) => console.error(x));
  }, [props.refreshCount, props.loggedIn]);

  return (
    <>
      {messages != null && messages.length > 0 ? (
        <div className="list-group">
          {messages.map((x) => (
            <MessageItem
              key={x.id}
              message={x}
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
        <div className="d-flex justify-content-center">
          <Button>Load more</Button>
        </div>
      ) : null}
    </>
  );
}
