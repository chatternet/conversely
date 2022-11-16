import { SetState, UseState } from "../../commonutils";
import { ErrorState } from "../../controllers/interfaces";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export interface CreatePostProps {
  postNote: (note: string) => Promise<void>;
  setErrorState: SetState<ErrorState | undefined>;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");

  return (
    <Container>
      <Form onSubmit={() => false}>
        <div className="mb-2">
          <Form.Control
            as="textarea"
            rows={4}
            value={note}
            placeholder="Share a note ..."
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
        <div className="d-flex align-items-center">
          <Button
            onClick={() => {
              props
                .postNote(note)
                .catch((err) => {
                  console.error(err);
                  props.setErrorState({
                    title: "Create Post",
                    message: "Post was not sent to servers.",
                    display: true,
                  });
                })
                .then(() => setNote(""));
            }}
          >
            Share
          </Button>
        </div>
      </Form>
    </Container>
  );
}
