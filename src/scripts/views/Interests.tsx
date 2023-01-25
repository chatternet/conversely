import { UseState } from "../commonutils";
import { AlertNotLoggedIn } from "./common/CustomAlerts";
import { CustomButton } from "./common/CustomButtons";
import { TopicName, TopicNameProps } from "./common/FormatTopicName";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import React, { MouseEvent, useState } from "react";
import { Card, Container, Form, ListGroup } from "react-bootstrap";

export type InterestsProps = {
  loggedIn: boolean;
  following: Set<string>;
  formatTopicNameProps: Omit<TopicNameProps, "id">;
  addInterest: (tag: string) => Promise<void>;
  unfollowId: (id: string) => Promise<void>;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Interests(props: InterestsProps) {
  const [tag, setTag]: UseState<string> = useState("");

  function follow(event: React.FormEvent) {
    event.preventDefault();
    props
      .addInterest(tag)
      .then(() => setTag(""))
      .catch((x) => console.error(x));
  }

  const interestsId = [...props.following].filter(
    (x) => !x.startsWith("did:key:")
  );
  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="my-3 max-width-md mx-auto">
        {props.loggedIn != null ? (
          <>
            <Card className="rounded my-3">
              <Card.Header>Add interest</Card.Header>
              <Card.Body className="no-end-margin">
                <Form onSubmit={follow}>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 me-2">
                      <Form.Control
                        placeholder="Topic name"
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          setTag(e.target.value);
                        }}
                        className="my-1"
                      />
                    </div>
                    <div>
                      <CustomButton type="submit" variant="primary" small>
                        Add interest
                      </CustomButton>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <span className="lead">Followed interests</span>
            <ListGroup className="my-3">
              {interestsId.map((x) => (
                <ListGroup.Item key={x}>
                  <div className="d-flex">
                    <div className="me-auto">
                      <TopicName id={x} {...props.formatTopicNameProps} />
                    </div>
                    <div>
                      <small>
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
                          Remove interest
                        </a>
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
