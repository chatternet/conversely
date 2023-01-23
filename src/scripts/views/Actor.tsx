import { AlertAddAccount, AlertNotLoggedIn } from "./common/CustomAlerts";
import { CustomButton } from "./common/CustomButtons";
import { ActorNameIcon, ActorNameProps } from "./common/FormatActorName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { MouseEvent } from "react";
import { Container } from "react-bootstrap";

export type ActorProps = {
  loggedIn: boolean;
  actorId: string;
  FormatActorNameProps: Omit<ActorNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  scaffoldProps: Omit<ScaffoldProps, "children">;
  addContact: (actorId: string) => Promise<void>;
};

export function Actor(props: ActorProps) {
  function addContact(event: MouseEvent) {
    event.preventDefault();
    props.addContact(props.actorId).catch((err) => console.error(err));
  }
  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="max-width-md mt-3">
        <div className="d-flex mb-3">
          <span className="lead me-auto">
            <ActorNameIcon {...props.FormatActorNameProps} id={props.actorId} />
          </span>{" "}
          <CustomButton variant="primary" small onClick={addContact}>
            Add contact
          </CustomButton>
        </div>
        <div className="mb-3">
          <AlertAddAccount />
        </div>
        <p>
          <span className="lead">Feed received from account</span>
        </p>
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
