import { MessageDisplay } from "../../controllers/messages";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { Card } from "react-bootstrap";

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
  languageTag: string;
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

function MessageNote(props: MessageItemProps) {
  return (
    <Card className="rounded m-3">
      <Card.Header>
        <MessageHeader {...props} />
      </Card.Header>
      <Card.Body>
        <Card.Text>{props.message.content}</Card.Text>
      </Card.Body>
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
