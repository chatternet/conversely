import type { UseState } from "../../commonutils";
import type { Message, IdNameSuffix } from "../../controllers/interfaces";
import { FormatIdNameSuffix } from "./FormatNameSuffix";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

export interface MessageItemProps {
  message: Message;
  languageTag: string;
  getIdNameSuffix: (id: string) => Promise<IdNameSuffix>;
}

function MessageHeader(props: MessageItemProps) {
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

function MessageNote(props: MessageItemProps) {
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

export function MessageItem(props: MessageItemProps) {
  return (
    <>
      <MessageNote {...props} />
    </>
  );
}
