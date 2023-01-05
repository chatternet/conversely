import { SetState, UseState } from "../../commonutils";
import { MessageDisplay } from "../../controllers/messages";
import { CreatePost, CreatePostProps } from "./CreatePost";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { MouseEvent, useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";
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
  createPostProps: CreatePostProps;
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

interface MessageFooterProps {
  message: MessageDisplay;
  localActorId: string | undefined;
  setShowReply: SetState<boolean>;
  deleteMessage: (messageId: string) => Promise<void>;
}

function MessageFooter(props: MessageFooterProps) {
  function deleteMessage(event: MouseEvent) {
    event.preventDefault();
    props.deleteMessage(props.message.id).catch((x) => console.error(x));
  }

  function toggleReply(event: MouseEvent) {
    event.preventDefault();
    props.setShowReply((x) => !x);
  }

  return (
    <div>
      <small>
        <a
          href="#"
          onClick={toggleReply}
          className="fw-normal bg-primary text-white rounded-pill py-1 px-2 me-2"
        >
          Reply
        </a>
      </small>
      {props.message.actorId === props.localActorId ? (
        <a
          href="#"
          onClick={deleteMessage}
          className="fw-normal bg-danger text-white rounded-pill py-1 px-2 me-2"
        >
          Delete
        </a>
      ) : null}
    </div>
  );
}

function MessageNote(props: MessageItemProps & MessageFooterProps) {
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
  const [showReply, setShowReply]: UseState<boolean> = useState(false);

  return (
    <>
      <MessageNote {...props} setShowReply={setShowReply} />
      <Collapse in={showReply}>
        <div>
          <CreatePost {...props.createPostProps} inReplyTo={props.message.id} />
        </div>
      </Collapse>
    </>
  );
}
