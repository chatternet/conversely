import { CreatePost, CreatePostProps } from "./common/CreatePost";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Alert, Container } from "react-bootstrap";

export type FeedProps = {
  loggedIn: boolean;
  createPostProps: CreatePostProps;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
};

export function Feed(props: FeedProps) {
  return (
    <Container className="max-width-md mt-3">
      {props.loggedIn ? (
        <>
          <CreatePost {...props.createPostProps} />
          <div className="my-3">
            <MessagesList
              pageSize={16}
              allowMore={true}
              {...props.messagesListProps}
            />
          </div>
        </>
      ) : (
        <Alert>Cannot access feed without logging in.</Alert>
      )}
    </Container>
  );
}
