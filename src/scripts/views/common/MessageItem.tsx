import { MessageDisplay } from "../../controllers/messages";
import { FormatIdName } from "./FormatIdName";
import { Card } from "react-bootstrap";

function formatDate(dateString: string): string {
  const dateNow = new Date();
  const date = new Date(dateString);
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
  followId?: (id: string) => Promise<void>;
}

function MessageHeader(props: MessageItemProps) {
  return (
    <div className="d-flex align-items-center">
      <span>
        <FormatIdName {...props.message.actor} addContact={props.followId} />
      </span>
      <small className="text-muted ms-auto">
        {formatDate(props.message.date)}
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
