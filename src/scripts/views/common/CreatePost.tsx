import { UseState } from "../../commonutils";
import { CustomButton } from "./CustomButtons";
import { ReactNode, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
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
            <CustomButton
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
              variant="outline-primary"
              className="me-2"
              small
            >
              Post {props.inReplyTo ? "reply" : ""}
            </CustomButton>
            <CustomButton
              onClick={(event) => {
                event.preventDefault();
                setShowPreview((x) => !x);
              }}
              variant="outline-primary"
              className="me-2"
              small
            >
              {showPreview ? "Edit" : "Preview"}
            </CustomButton>
          </div>
        </Card.Footer>
      </Card>
    </>
  );
}
