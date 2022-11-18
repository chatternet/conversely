import { SetState } from "../../commonutils";
import { ErrorState } from "../../controllers/interfaces";
import { Alert } from "react-bootstrap";

export interface ErrorTopProps {
  state: ErrorState;
  setState: SetState<ErrorState | undefined>;
}

export function ErrorTop(props: ErrorTopProps) {
  return props.state ? (
    <Alert
      variant="danger"
      onClose={() => props.setState(undefined)}
      dismissible
      transition={true}
    >
      {props.state.message ? <div>{props.state.message}</div> : null}
    </Alert>
  ) : null;
}
