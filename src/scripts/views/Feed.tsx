import { CreatePost, CreatePostProps } from "./common/CreatePost";
import { Messages, MessagesProps } from "./common/Messages";
import { Alert, Container } from "react-bootstrap";

export type FeedProps = {
  loggedIn: boolean;
  createPostProps: CreatePostProps;
  messagesProps: MessagesProps;
};

export function Feed(props: FeedProps) {
  return (
    <Container className="max-width-md mt-3">
      {props.loggedIn ? (
        <>
          <CreatePost {...props.createPostProps} />
          <Messages {...props.messagesProps} />
        </>
      ) : (
        <Alert>Cannot access feed without logging in.</Alert>
      )}
    </Container>
  );
}
