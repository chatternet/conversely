import type { UseState } from "../../commonutils";
import type { Message } from "../../controllers/interfaces";
import { MessageItem, MessageItemProps } from "./MessageItem";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";

export interface MessagesListProps {
  numDisplay: number;
  allowMore: boolean;
  messagesDisplayProps: Omit<MessageItemProps, "message">;
}

export function MessagesList(props: MessagesListProps) {
  // .sort((x, y) => (x.published > y.published ? -1 : +1))
  const [messages, _setMessages]: UseState<Message[] | undefined> = useState();
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
        <div className="text-secondary text-center">
          No messages to display.
        </div>
      )}
      {props.allowMore ? (
        <div className="d-flex justify-content-center">
          <Button>Load more</Button>
        </div>
      ) : null}
    </>
  );
}
