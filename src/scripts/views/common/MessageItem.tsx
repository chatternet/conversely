import { MessageDisplay } from "../../controllers/messages";
import { FormatIdName } from "./FormatIdName";
import { Card } from "react-bootstrap";

export interface MessageItemProps {
  message: MessageDisplay;
  languageTag: string;
  addContact?: (id: string, name: string) => Promise<void>;
}

function MessageHeader(props: MessageItemProps) {
  return (
    <div className="d-flex align-items-center">
      <span>
        <FormatIdName {...props.message.actor} addContact={props.addContact} />
      </span>
      <small className="text-muted ms-auto">{props.message.date}</small>
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
