import type { UseState } from "../../commonutils";
import type { Message, IdNameSuffix } from "../../controllers/interfaces";
import { FormatIdNameSuffix } from "./FormatNameSuffix";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

interface MessageDisplayProps {
  message: Message;
  languageTag: string;
  getIdNameSuffix: (id: string) => Promise<IdNameSuffix>;
}

function MessageHeader(props: MessageDisplayProps) {
  const [idNameSuffix, setNameSuffix]: UseState<IdNameSuffix | undefined> =
    useState();

  useEffect(() => {
    props
      .getIdNameSuffix(props.message.actor)
      .then(setNameSuffix)
      .catch((err) => console.error(err));
  }, [props.message]);

  const date = props.message.published;

  return (
    <div className="d-flex align-items-center">
      {idNameSuffix ? <FormatIdNameSuffix {...{ idNameSuffix }} /> : null}
      <small className="text-muted ms-auto">{date}</small>
    </div>
  );
}

function NoteDisplay(props: MessageDisplayProps) {
  const message = props.message;
  const contentString = message.object[0];
  return contentString ? (
    <Card className="rounded m-3">
      <Card.Header>
        <MessageHeader {...props} />
      </Card.Header>
      <Card.Body>
        <Card.Text>{contentString}</Card.Text>
      </Card.Body>
    </Card>
  ) : null;
}

function MessageDisplay(props: MessageDisplayProps) {
  return (
    <>
      <NoteDisplay {...props} />
    </>
  );
}

export interface MessagesProps {
  messages: Map<string, Message> | undefined;
  messagesDisplayProps: Omit<MessageDisplayProps, "message">;
}

export function Messages(props: MessagesProps) {
  const numPerPage = 50;
  const [numPages, setNumPages]: UseState<number> = useState(1);
  const [noMorePages, setNoMorePages]: UseState<boolean> = useState(true);

  useEffect(() => {
    setNoMorePages(
      !props.messages || numPages * numPerPage >= props.messages.size
    );
  }, [props.messages, numPages]);

  return (
    <>
      <div className="list-group">
        {(props.messages ? Array.from(props.messages.values()) : [])
          .sort((x, y) => (x.published > y.published ? -1 : +1))
          .slice(0, numPages * numPerPage)
          .map((x) => (
            <MessageDisplay
              key={x.id}
              message={x}
              {...props.messagesDisplayProps}
            />
          ))}
      </div>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => setNumPages((n) => (n ? n : 0) + 1)}
          disabled={noMorePages}
        >
          Load more
        </Button>
      </div>
    </>
  );
}
