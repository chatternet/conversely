import { UseState } from "../../commonutils";
import { PushAlertTop } from "../../controllers/interfaces";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export interface CreatePostProps {
  postNote: (note: string) => Promise<void>;
  pushAlertTop: PushAlertTop;
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
                  props.pushAlertTop("Post was not delivered.", "danger");
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
