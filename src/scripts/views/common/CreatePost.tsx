import { UseState } from "../../commonutils";
import { ReactNode, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface CreatePostProps {
  postNote: (note: string, inReplyTo?: string) => Promise<void>;
  pushAlertTop: (message: ReactNode) => void;
  inReplyTo?: string;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");
  const [showPreview, setShowPreview]: UseState<boolean> = useState(false);

  return (
    <>
      <Card className="rounded m-3">
        {showPreview ? (
          <Card.Body
            className="note-text no-end-margin"
            style={{ minHeight: "8em" }}
          >
            <ReactMarkdown>{note}</ReactMarkdown>
          </Card.Body>
        ) : (
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
              className="border border-0 p-3"
            />
          </Form>
        )}
        <Card.Footer>
          <div>
            <small>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  props
                    .postNote(note, props.inReplyTo)
                    .then(() => setNote(""))
                    .catch((err) => {
                      console.error(err);
                      props.pushAlertTop("Note was not delivered.");
                    });
                }}
                className="fw-normal bg-primary text-white rounded-pill py-1 px-2 me-2"
              >
                Post {props.inReplyTo ? "reply" : ""}
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setShowPreview((x) => !x);
                }}
                className="fw-normal bg-secondary text-white rounded-pill py-1 px-2 me-2"
              >
                {showPreview ? "Edit" : "Preview"}
              </a>
            </small>
          </div>
        </Card.Footer>
      </Card>
    </>
  );
}
