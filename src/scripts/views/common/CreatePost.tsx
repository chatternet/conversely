import { UseState } from "../../commonutils";
import { PushAlertTop } from "../../controllers/interfaces";
import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface CreatePostProps {
  postNote: (note: string, inReplyTo?: string) => Promise<void>;
  pushAlertTop: PushAlertTop;
  inReplyTo?: string;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");

  return (
    <>
      <Card className="rounded m-3">
        <Form onSubmit={() => false}>
          <Form.Control
            as="textarea"
            rows={4}
            value={note}
            placeholder={
              props.inReplyTo ? "Write a reply ..." : "Write a post ..."
            }
            onChange={(e) => {
              setNote(e.target.value);
            }}
            className="border border-0"
          />
        </Form>
        <Card.Footer>
          <div>
            <small>
              <a
                href="#"
                onClick={() => {
                  props
                    .postNote(note, props.inReplyTo)
                    .then(() => setNote(""))
                    .catch((err) => {
                      console.error(err);
                      props.pushAlertTop("Note was not delivered.", "danger");
                    });
                }}
                className="fw-normal bg-primary text-white rounded-pill py-1 px-2 me-2"
              >
                Post {props.inReplyTo ? "reply" : ""}
              </a>
            </small>
          </div>
        </Card.Footer>
      </Card>

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
