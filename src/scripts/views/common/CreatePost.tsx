import { UseState } from "../../commonutils";
import { CustomButton } from "./CustomButtons";
import { ReactNode, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface CreatePostProps {
  postNote: (
    note: string,
    toSelf?: boolean,
    tags?: string[],
    inReplyTo?: string
  ) => Promise<void>;
  pushAlertTop: (message: ReactNode) => void;
  inReplyTo?: string;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");
  const [toSelf, setToSelf]: UseState<boolean> = useState(true);
  const [tags, setTags]: UseState<string> = useState("");
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
            <hr className="m-0" />
            <div className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="To followers,"
                className="text-nowrap ms-3"
                checked={toSelf}
                onChange={(e) => {
                  setToSelf(e.target.checked);
                }}
              />
              <Form.Control
                as="textarea"
                rows={1}
                value={tags}
                placeholder={"add topics separated by spaces"}
                spellCheck="false"
                onChange={(e) => {
                  setTags(e.target.value);
                }}
                className="border border-0"
              />
            </div>
          </Form>
        )}
        <Card.Footer>
          <div>
            <CustomButton
              onClick={(event) => {
                event.preventDefault();
                props
                  .postNote(
                    note,
                    toSelf,
                    tags
                      .split(" ")
                      .map((x) => x.trim())
                      .filter((x) => !!x),
                    props.inReplyTo
                  )
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
