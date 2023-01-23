import { CreatePost, CreatePostProps } from "./common/CreatePost";
import { AlertNotLoggedIn } from "./common/CustomAlerts";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { Container } from "react-bootstrap";

export type FeedProps = {
  loggedIn: boolean;
  createPostProps: CreatePostProps;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Feed(props: FeedProps) {
  return (
    <Scaffold {...props.scaffoldProps}>
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
          <AlertNotLoggedIn />
        )}
      </Container>
    </Scaffold>
  );
}
