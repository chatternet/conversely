import { UseState } from "../commonutils";
import {
  FormatActorName,
  FormatActorNameProps,
} from "./common/FormatActorName";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { FormEvent, MouseEvent, useState } from "react";
import {
  Alert,
  Card,
  Container,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";

export type FollowingProps = {
  localActorId: string | undefined;
  following: Set<string>;
  FormatActorNameProps: Omit<FormatActorNameProps, "id">;
  followDid: (id: string) => Promise<void>;
  unfollowId: (id: string) => Promise<void>;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Following(props: FollowingProps) {
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
              <Card.Header>Follow</Card.Header>
              <Card.Body>
                <Form onSubmit={follow}>
                  <Form.Control
                    placeholder="DID to follow"
                    type="text"
                    value={didToFollow}
                    onChange={(e) => {
                      setDidToFollow(e.target.value);
                    }}
                    className="my-1 font-monospace"
                  />
                  <div className="text-center">
                    <Button type="submit" className="my-1">
                      Follow
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <span className="lead">Accounts you are following</span>
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
          <Alert>Cannot view following list without logging in.</Alert>
        )}
      </Container>
    </Scaffold>
  );
}
