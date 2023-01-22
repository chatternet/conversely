import { UseState } from "../commonutils";
import { AlertNotLoggedIn, CustomAlert } from "./common/CustomAlerts";
import { CustomButton } from "./common/CustomButtons";
import {
  FormatActorName,
  FormatActorNameProps,
} from "./common/FormatActorName";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { FormEvent, MouseEvent, useState } from "react";
import { Card, Container, Form, Button, ListGroup } from "react-bootstrap";

export type ContactsProps = {
  localActorId: string | undefined;
  following: Set<string>;
  FormatActorNameProps: Omit<FormatActorNameProps, "id">;
  followDid: (id: string) => Promise<void>;
  unfollowId: (id: string) => Promise<void>;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Contacts(props: ContactsProps) {
  const [didToFollow, setDidToFollow]: UseState<string> = useState("");

  function follow(event: FormEvent) {
    event.preventDefault();
    props
      .followDid(didToFollow)
      .then(() => setDidToFollow(""))
      .catch((x) => console.error(x));
  }

  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="my-3 max-width-md mx-auto">
        {props.localActorId != null ? (
          <>
            <Card className="rounded my-3">
              <Card.Header>Add contact</Card.Header>
              <Card.Body className="no-end-margin">
                <Form onSubmit={follow}>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 me-2">
                      <Form.Control
                        placeholder="Account DID"
                        type="text"
                        value={didToFollow}
                        onChange={(e) => {
                          setDidToFollow(e.target.value);
                        }}
                        className="my-1 font-monospace"
                      />
                    </div>
                    <div>
                      <CustomButton
                        type="submit"
                        variant="outline-primary"
                        small
                      >
                        Add contact
                      </CustomButton>
                    </div>
                  </div>
                </Form>
                <CustomAlert variant="info" className="mt-2">
                  Adding a contact will allow you to receive messages sent and
                  viewed by that contact. Add only trustworthy contacts to avoid
                  unwanted messages.
                </CustomAlert>
              </Card.Body>
            </Card>
            <span className="lead">Contact accounts</span>
            <ListGroup className="my-3">
              {[...props.following].map((x) => (
                <ListGroup.Item key={x}>
                  <div className="d-flex">
                    <div className="me-auto">
                      <FormatActorName id={x} {...props.FormatActorNameProps} />
                    </div>
                    <div>
                      <small>
                        {x !== props.localActorId ? (
                          <a
                            href="#"
                            onClick={(e: MouseEvent) => {
                              e.preventDefault();
                              props
                                .unfollowId(x)
                                .catch((err) => console.error(err));
                            }}
                            className="fw-normal bg-danger text-white rounded-pill mb-2 py-1 px-2"
                          >
                            Unfollow
                          </a>
                        ) : null}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="list-group"></div>
          </>
        ) : (
          <AlertNotLoggedIn />
        )}
      </Container>
    </Scaffold>
  );
}
