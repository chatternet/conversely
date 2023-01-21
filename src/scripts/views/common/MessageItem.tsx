import { SetState, UseState } from "../../commonutils";
import { MessageDisplay } from "../../controllers/messages";
import { CreatePost, CreatePostProps } from "./CreatePost";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { omit } from "lodash-es";
import { MouseEvent, useState } from "react";
import { Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export interface MessageItemProps {
  message: MessageDisplay;
  localActorId: string | undefined;
  setGroup: SetState<MessageDisplay[]>;
  deleteMessage: (messageId: string) => Promise<void>;
  buildParentDisplay: (
    bodyId: string,
    actorId: string
  ) => Promise<MessageDisplay | undefined>;
  createPostProps: CreatePostProps;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
}

interface MessageHeaderProps {
  showParent: () => Promise<void>;
}

function MessageHeader(props: MessageItemProps & MessageHeaderProps) {
  return (
    <div className="d-flex align-items-center">
      <span>
        <FormatIdName
          id={props.message.note.attributedTo}
          {...props.formatIdNameProps}
        />
        {props.message.inReplyTo ? (
          <>
            {" "}
            replying to{" "}
            <FormatIdName
              id={props.message.inReplyTo.actorId}
              {...props.formatIdNameProps}
            />
          </>
        ) : null}
      </span>
      <span className="ms-auto">
        {props.message.inReplyTo != null ? (
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              props.showParent().catch((x) => console.error(x));
            }}
            className="ps-2"
          >
            Show parent
          </a>
        ) : null}
      </span>
    </div>
  );
}

interface MessageFooterProps {
  message: MessageDisplay;
  localActorId: string | undefined;
  deleteMessage: (messageId: string) => Promise<void>;
  setShowReply?: SetState<boolean>;
}

function MessageFooter(props: MessageFooterProps) {
  function deleteMessage(event: MouseEvent) {
    event.preventDefault();
    props.deleteMessage(props.message.id).catch((x) => console.error(x));
  }

  function toggleReply(event: MouseEvent) {
    event.preventDefault();
    if (!!props.setShowReply) props.setShowReply((x) => !x);
  }

  return (
    <div>
      {props.setShowReply ? (
        <small>
          <a
            href="#"
            onClick={toggleReply}
            className="fw-normal bg-primary text-white rounded-pill py-1 px-2 me-2"
          >
            Reply
          </a>
        </small>
      ) : null}
      {props.message.note.attributedTo === props.localActorId ? (
        <a
          href="#"
          onClick={deleteMessage}
          className="fw-normal bg-danger text-white rounded-pill py-1 px-2 me-2"
        >
          Delete
        </a>
      ) : null}
    </div>
  );
}

function MessageItem(
  props: MessageItemProps & MessageFooterProps & MessageHeaderProps
) {
  return (
    <Card className="rounded m-3">
      <Card.Header>
        <MessageHeader {...props} />
      </Card.Header>
      <Card.Body className="note-text no-end-margin">
        <ReactMarkdown>{props.message.note.content}</ReactMarkdown>
      </Card.Body>
      <Card.Footer>
        <MessageFooter {...props} />
      </Card.Footer>
    </Card>
  );
}

function MessageItemReply(props: MessageItemProps) {
  const [showReply, setShowReply]: UseState<boolean> = useState(false);
  const [parentShown, setParentShown]: UseState<boolean> = useState(false);

  async function postNote(note: string, inReplyTo?: string): Promise<void> {
    setShowReply(false);
    return props.createPostProps.postNote(note, inReplyTo);
  }

  const createPostProps = omit(props.createPostProps, "postNote");

  async function showParent(objectId: string, actorId: string) {
    if (!props.message.inReplyTo) return;
    const parent = await props.buildParentDisplay(objectId, actorId);
    if (!parent) return;
    props.setGroup((x) => [parent, ...x]);
  }

  return (
    <>
      <MessageItem
        {...props}
        showParent={async () => {
          if (parentShown) return;
          if (props.message.inReplyTo == null) return;
          await showParent(
            props.message.inReplyTo.objectId,
            props.message.note.attributedTo
          );
          setParentShown(true);
        }}
        setShowReply={setShowReply}
      />
      {showReply ? (
        <>
          <div className="vertical-line-2 my-n3"></div>
          <CreatePost
            {...createPostProps}
            postNote={postNote}
            inReplyTo={props.message.note.id}
          />
        </>
      ) : null}
    </>
  );
}

export function MessageItemGroup(props: Omit<MessageItemProps, "setGroup">) {
  const [group, setGroup]: UseState<MessageDisplay[]> = useState([
    props.message,
  ]);

  return (
    <>
      {group.map((x, i) => (
        <>
          <MessageItemReply
            key={x.id}
            {...props}
            message={x}
            setGroup={setGroup}
          />
          {i < group.length - 1 ? (
            <div className="vertical-line-2 my-n3"></div>
          ) : null}
        </>
      ))}
    </>
  );
}
