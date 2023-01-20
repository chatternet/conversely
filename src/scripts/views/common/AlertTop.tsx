import { SetState } from "../../commonutils";
import { AlertTopItem } from "../../controllers/interfaces";
import { Alert } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

export interface AlertTopProps {
  state: AlertTopItem[];
  setState: SetState<AlertTopItem[]>;
}

export function pushAlertTop(
  message: string,
  variant: Variant,
  setState: SetState<AlertTopItem[]>
) {
  const alertTopItem: AlertTopItem = {
    message,
    variant,
    key: crypto.randomUUID(),
  };
  setState((prevState) => {
    if (prevState == null) {
      return [alertTopItem];
    } else if (prevState.findIndex((x) => x.key === alertTopItem.key) >= 0) {
      return prevState;
    } else {
      return [...prevState, alertTopItem];
    }
  });
}

export function AlertTop(props: AlertTopProps) {
  return (
    <>
      {props.state.map((x) => (
        <Alert
          key={x.key}
          variant={x.variant}
          onClose={() => {
            props.setState(props.state.filter((y) => y.message !== x.message));
          }}
          dismissible
          transition={true}
        >
          <div>{x.message}</div>
        </Alert>
      ))}
    </>
  );
}
