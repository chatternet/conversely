import { SetState } from "../../commonutils";
import { ReactNode, CSSProperties } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

export interface AlertItem {
  node: ReactNode;
  key: string;
}

export interface AlertTopProps {
  items: AlertItem[];
  setItems: SetState<AlertItem[]>;
  style: CSSProperties;
}

export function pushAlertTop(node: ReactNode, setState: SetState<AlertItem[]>) {
  const alertItem: AlertItem = {
    node,
    key: crypto.randomUUID(),
  };
  setState((prevState) => [...prevState, alertItem]);
}

export function AlertTop(props: AlertTopProps) {
  return (
    <ToastContainer position="top-center" style={props.style}>
      {props.items.map((x) => (
        <Toast
          className="m-3"
          key={x.key}
          onClose={(e) => {
            e?.preventDefault();
            props.setItems((prevState) =>
              prevState.filter((y) => y.key !== x.key)
            );
          }}
        >
          <Toast.Header>
            <span className="me-auto"></span>
          </Toast.Header>
          <Toast.Body>{x.node}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
