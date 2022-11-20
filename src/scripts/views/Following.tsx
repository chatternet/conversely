import { UseState } from "../commonutils";
import { FormEvent, useState } from "react";
import { Alert, Card, Container, Form, Button } from "react-bootstrap";

export type FollowingProps = {
  loggedIn: boolean;
  followId: (id: string) => Promise<void>;
};

export function Following(props: FollowingProps) {
  const [idToFollow, setIdToFollow]: UseState<string> = useState("");

  const follow = (event: FormEvent) => {
    event.preventDefault();
    props
      .followId(idToFollow)
      .then(() => setIdToFollow(""))
      .catch((x) => console.error(x));
  };

  return (
    <Container className="my-3 max-width-md mx-auto">
      {props.loggedIn ? (
        <>
          <Card className="rounded m-3">
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
        </>
      ) : (
        <Alert>Cannot view following list without logging in.</Alert>
      )}
    </Container>
  );
}
