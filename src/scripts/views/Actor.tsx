import { AlertNotLoggedIn } from "./common/CustomAlerts";
import {
  FormatActorName,
  FormatActorNameProps,
} from "./common/FormatActorName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { Container } from "react-bootstrap";

export type ActorProps = {
  loggedIn: boolean;
  actorId: string;
  FormatActorNameProps: Omit<FormatActorNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Actor(props: ActorProps) {
  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="max-width-md mt-3">
        <span className="lead">
          Feed received from{" "}
          <FormatActorName {...props.FormatActorNameProps} id={props.actorId} />
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
          <AlertNotLoggedIn />
        )}
      </Container>
    </Scaffold>
  );
}
