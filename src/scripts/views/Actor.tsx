import { FormatIdName, FormatIdNameProps } from "./common/FormatIdName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { Alert, Container } from "react-bootstrap";

export type ActorProps = {
  loggedIn: boolean;
  actorId: string;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Actor(props: ActorProps) {
  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="max-width-md mt-3">
        <span className="lead">
          Feed received from{" "}
          <FormatIdName {...props.formatIdNameProps} id={props.actorId} />
        </span>
        {props.loggedIn ? (
          <>
            <div className="my-3">
              <MessagesList
                {...props.messagesListProps}
                pageSize={16}
                allowMore={true}
                actorId={props.actorId}
              />
            </div>
          </>
        ) : (
          <Alert>Cannot view actor without logging in.</Alert>
        )}
      </Container>
    </Scaffold>
  );
}
