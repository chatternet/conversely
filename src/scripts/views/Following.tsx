import { UseState } from "../commonutils";
import { FormatIdName, FormatIdNameProps } from "./common/FormatIdName";
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
  loggedIn: boolean;
  following: Set<string>;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  followId: (id: string) => Promise<void>;
  unfollowId: (id: string) => Promise<void>;
};

export function Following(props: FollowingProps) {
  const [idToFollow, setIdToFollow]: UseState<string> = useState("");

  function follow(event: FormEvent) {
    event.preventDefault();
    props
      .followId(idToFollow)
      .then(() => setIdToFollow(""))
      .catch((x) => console.error(x));
  }

  function unfollow(event: MouseEvent) {
    event.preventDefault();
  }

  return (
    <Container className="my-3 max-width-md mx-auto">
      {props.loggedIn ? (
        <>
          <Card className="rounded my-3">
            <Card.Header>Follow</Card.Header>
            <Card.Body>
              <Form onSubmit={follow}>
                <Form.Control
                  placeholder="ID to follow"
                  type="text"
                  value={idToFollow}
                  onChange={(e) => {
                    setIdToFollow(e.target.value);
                  }}
                  className="my-1"
                />
                <div className="text-center">
                  <Button type="submit" className="my-1">
                    Follow
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <ListGroup className="my-3">
            {[...props.following].map((x) => (
              <ListGroup.Item key={x}>
                <div className="d-flex">
                  <div className="me-auto">
                    <FormatIdName id={x} {...props.formatIdNameProps} />
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
                    Unfollow
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
        <Alert>Cannot view following list without logging in.</Alert>
      )}
    </Container>
  );
}
