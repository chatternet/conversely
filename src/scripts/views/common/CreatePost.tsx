import { SetState } from "../../commonutils";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export interface CreatePostProps {
  postMessage: (message: string) => Promise<void>;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postMessage) return null;

  const [message, setMessage]: [string, SetState<string>] = useState("");

  return (
    <Container>
      <Form onSubmit={() => false}>
        <div className="mb-2">
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            placeholder="Share a message ..."
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </div>
        <div className="d-flex align-items-center">
          <Button
            onClick={() => {
              props
                .postMessage(message)
                .catch((err) => console.error(err))
                .then(() => setMessage(""));
            }}
          >
            Share
          </Button>
        </div>
      </Form>
    </Container>
  );
}
