import { UseState } from "../../commonutils";
import { PushAlertTop } from "../../controllers/interfaces";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface CreatePostProps {
  postNote: (note: string) => Promise<void>;
  pushAlertTop: PushAlertTop;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");

  return (
    <>
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
          <div className="text-center">
            <Button
              onClick={() => {
                props
                  .postNote(note)
                  .then(() => setNote(""))
                  .catch((err) => {
                    console.error(err);
                    props.pushAlertTop("Post was not delivered.", "danger");
                  });
              }}
            >
              Share
            </Button>
          </div>
        </Form>
      </Container>
      {!!note ? (
        <Card className="rounded m-3">
          <Card.Header>Preview</Card.Header>
          <Card.Body className="note-text">
            <ReactMarkdown>{note}</ReactMarkdown>
          </Card.Body>
        </Card>
      ) : null}
    </>
  );
}
