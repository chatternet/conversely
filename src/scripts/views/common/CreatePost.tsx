import { UseState } from "../../commonutils";
import { CustomButton } from "./CustomButtons";
import { TagList, TagListProps } from "./TagList";
import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface CreatePostProps {
  postNote: (
    note: string,
    toSelf?: boolean,
    tags?: string[],
    inReplyTo?: string
  ) => Promise<void>;
  pushAlertTop: (message: ReactNode) => void;
  tagIdToName: (id: string) => string | undefined;
  inReplyTo?: string;
  defaultTagsId?: string[];
  tagListProps: Omit<TagListProps, "tagsId" | "setTagsId">;
}

export function CreatePost(props: CreatePostProps) {
  if (!props.postNote) return null;

  const [note, setNote]: UseState<string> = useState("");
  const [remaining, setRemaining]: UseState<string> = useState("");
  const [toSelf, setToSelf]: UseState<boolean> = useState(true);
  const [tagsId, setTagsId]: UseState<string[]> = useState(new Array());
  const [showPreview, setShowPreview]: UseState<boolean> = useState(false);

  function updateNote(value: string) {
    const remainingFraction = 1 - value.length / 1024;
    if (remainingFraction < 0.1)
      setRemaining(`${(remainingFraction * 100).toFixed(0)}%`);
    else setRemaining("");
    if (remainingFraction <= 0) return;
    setNote(value);
  }

  useEffect(() => {
    if (props.defaultTagsId == null || props.defaultTagsId.length <= 0) return;
    setTagsId(props.defaultTagsId);
  }, [props.defaultTagsId]);

  const tags = tagsId
    .map((x) => props.tagIdToName(x))
    .filter((x) => x != null) as string[];

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
          <div>
            <Form.Control
              as="textarea"
              rows={4}
              value={note}
              placeholder={
                props.inReplyTo ? "Write a reply ..." : "Write a post ..."
              }
              onChange={(e) => {
                updateNote(e.target.value);
              }}
              className="border border-0 p-3"
            />
            <hr className="m-0" />
            <small>
              <div className="d-flex align-items-center">
                <Form.Check
                  inline
                  type="checkbox"
                  label="to followers"
                  className="text-nowrap m-0 ms-3"
                  checked={toSelf}
                  onChange={(e) => {
                    setToSelf(e.target.checked);
                  }}
                />
                <TagList
                  tagsId={tagsId}
                  setTagsId={setTagsId}
                  {...props.tagListProps}
                />
              </div>
            </small>
          </div>
        )}
        <Card.Footer>
          <div className="d-flex align-items-center">
            <span className="me-auto">
              <CustomButton
                onClick={(event) => {
                  event.preventDefault();
                  props
                    .postNote(note, toSelf, tags, props.inReplyTo)
                    .catch((err) => {
                      console.error(err);
                      props.pushAlertTop("Note was not delivered.");
                    })
                    .then(() => setNote(""));
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
            </span>
            <small className="text-secondary">
              {!!remaining ? <>remaining: {remaining}</> : null}
            </small>
          </div>
        </Card.Footer>
      </Card>
    </>
  );
}
