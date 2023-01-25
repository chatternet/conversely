import { SetState, UseState } from "../../commonutils";
import { MessageDisplay } from "../../controllers/messages";
import { CreatePost, CreatePostProps } from "./CreatePost";
import { CustomButton } from "./CustomButtons";
import { ActorNameIcon, ActorNameProps } from "./FormatActorName";
import { TopicName, TopicNameProps } from "./FormatTopicName";
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
  actorNameProps: Omit<ActorNameProps, "id">;
  topicNameProps: Omit<TopicNameProps, "id">;
}

function MessageHeader(props: MessageItemProps) {
  return (
    <div className="d-flex align-items-center">
      <span>
        <ActorNameIcon
          id={props.message.note.attributedTo}
          {...props.actorNameProps}
        />
        {props.message.inReplyTo ? (
          <>
            {" "}
            replying to{" "}
            <ActorNameIcon
              id={props.message.inReplyTo.actorId}
              {...props.actorNameProps}
            />
          </>
        ) : null}
      </span>
    </div>
  );
}

interface MessageFooterProps {
  message: MessageDisplay;
  localActorId: string | undefined;
  canShowParent: boolean;
  showParent: () => Promise<void>;
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
        <CustomButton
          variant="outline-primary"
          onClick={toggleReply}
          className="me-2"
          small
        >
          Reply
        </CustomButton>
      ) : null}
      {props.canShowParent ? (
        <CustomButton
          variant="outline-primary"
          onClick={(event) => {
            event.preventDefault();
            props.showParent().catch((x) => console.error(x));
          }}
          className="me-2"
          small
        >
          Replied from
        </CustomButton>
      ) : null}
      {props.message.note.attributedTo === props.localActorId ? (
        <CustomButton
          variant="outline-danger"
          onClick={deleteMessage}
          className="me-2"
          small
        >
          Delete
        </CustomButton>
      ) : null}
    </div>
  );
}

export interface MessageItemBodyProps {
  content: string;
  actorsId: string[];
  tagsId: string[];
  actorNameProps: Omit<ActorNameProps, "id">;
  topicNameProps: Omit<TopicNameProps, "id">;
}

function MessageItemBody(props: MessageItemBodyProps) {
  return (
    <>
      <ReactMarkdown>{props.content}</ReactMarkdown>
      <small>
        <span className="fw-bold">Topics:</span>
        {props.actorsId.map((x, i) => (
          <span key={x} className="ms-2">
            <ActorNameIcon id={x} {...props.actorNameProps} />
            {i < props.actorsId.length - 1 ? "," : null}
          </span>
        ))}
        {props.tagsId != null && props.tagsId.length > 0 ? "," : null}
        {props.tagsId.map((x, i) => (
          <span key={x} className="ms-2">
            <TopicName id={x} {...props.topicNameProps} />
            {i < props.tagsId.length - 1 ? "," : null}
          </span>
        ))}
      </small>
    </>
  );
}

function MessageItem(props: MessageItemProps & MessageFooterProps) {
  const actorsId = props.message.audienceActorsId;
  const tagsId = props.message.audienceTagsId;
  const messageItemBodyProps = {
    content: props.message.note.content,
    actorsId: actorsId,
    tagsId: tagsId,
    actorNameProps: props.actorNameProps,
    topicNameProps: props.topicNameProps,
  };
  return (
    <Card className="rounded m-3">
      <Card.Header>
        <MessageHeader {...props} />
      </Card.Header>
      <Card.Body className="note-text no-end-margin">
        <MessageItemBody {...messageItemBodyProps} />
      </Card.Body>
      <Card.Footer>
        <MessageFooter {...props} />
      </Card.Footer>
    </Card>
  );
}

function MessageItemReply(props: MessageItemProps) {
  const [showReply, setShowReply]: UseState<boolean> = useState(false);
  const [canShowParent, setCanShowParent]: UseState<boolean> = useState(
    props.message.inReplyTo != null
  );

  const createPostProps = omit(props.createPostProps, "postNote");

  const showParent = async () => {
    if (!props.message.inReplyTo) return;
    const parent = await props.buildParentDisplay(
      props.message.inReplyTo.objectId,
      props.message.note.attributedTo
    );
    if (!parent) return;
    props.setGroup((x) => {
      // don't re-add the parent if it's already in the group
      if (x.findIndex((y) => y.id === parent.id) >= 0) return x;
      return [parent, ...x];
    });
    setCanShowParent(false);
  };

  return (
    <>
      <MessageItem
        {...props}
        showParent={showParent}
        canShowParent={canShowParent}
        setShowReply={setShowReply}
      />
      {showReply ? (
        <>
          <div className="vertical-line-3 my-n3"></div>
          <CreatePost
            {...createPostProps}
            postNote={props.createPostProps.postNote}
            inReplyTo={props.message.note.id}
            defaultTagsId={props.message.audienceTagsId}
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
        <div key={x.id}>
          <MessageItemReply {...props} message={x} setGroup={setGroup} />
          {i < group.length - 1 ? (
            <div className="vertical-line-3 my-n3"></div>
          ) : null}
        </div>
      ))}
    </>
  );
}
