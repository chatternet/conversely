import { CreatePost, CreatePostProps } from "./common/CreatePost";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Alert, Container } from "react-bootstrap";

export type FeedProps = {
  loggedIn: boolean;
  createPostProps: CreatePostProps;
  messagesListProps: Omit<MessagesListProps, "numDisplay" | "allowMore">;
};

export function Feed(props: FeedProps) {
  return (
    <Container className="max-width-md mt-3">
      {props.loggedIn ? (
        <>
          <CreatePost {...props.createPostProps} />
          <MessagesList
            numDisplay={32}
            allowMore={true}
            {...props.messagesListProps}
          />
        </>
      ) : (
        <Alert>Cannot access feed without logging in.</Alert>
      )}
    </Container>
  );
}
