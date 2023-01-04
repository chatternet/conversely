import { MessageDisplay } from "../../controllers/messages";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { MouseEvent } from "react";
import { Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

function formatTimestamp(timestamp: number): string {
  const dateNow = new Date();
  const date = new Date(timestamp * 1e3);
  if (
    date.getFullYear() === dateNow.getFullYear() &&
    date.getMonth() === dateNow.getMonth() &&
    date.getDate() === dateNow.getDate()
  ) {
    return date.toLocaleTimeString();
  } else {
    return date.toLocaleDateString();
  }
}

export interface MessageItemProps {
  message: MessageDisplay;
  localActorId: string | undefined;
  languageTag: string;
  deleteMessage: (messageId: string) => Promise<void>;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
}

function MessageHeader(props: MessageItemProps) {
  return (
    <div className="d-flex align-items-center">
      <span>
        <FormatIdName id={props.message.actorId} {...props.formatIdNameProps} />
      </span>
      <small className="text-muted ms-auto">
        {formatTimestamp(props.message.timestamp)}
      </small>
    </div>
  );
}

function MessageFooter(props: MessageItemProps) {
  function deleteMessage(event: MouseEvent) {
    event.preventDefault();
    props.deleteMessage(props.message.id).catch((x) => console.error(x));
  }

  return (
    <>
      {props.message.actorId === props.localActorId ? (
        <small>
          <a
            href="#"
            onClick={deleteMessage}
            className="fw-normal bg-danger text-white rounded-pill py-1 px-2"
          >
            Delete
          </a>
        </small>
      ) : null}
    </>
  );
}

function MessageNote(props: MessageItemProps) {
  return (
    <Card className="rounded m-3">
      <Card.Header>
        <MessageHeader {...props} />
      </Card.Header>
      <Card.Body className="note-text">
        <ReactMarkdown>{props.message.content}</ReactMarkdown>
      </Card.Body>
      <Card.Footer>
        <MessageFooter {...props} />
      </Card.Footer>
    </Card>
  );
}

export function MessageItem(props: MessageItemProps) {
  return (
    <>
      <MessageNote {...props} />
    </>
  );
}
