import { SetState } from "../../commonutils";
import { ReactNode, CSSProperties } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

export interface MessageTopItem {
  children: ReactNode;
  key: string;
  title?: string;
}

export interface MessageTopProps {
  items: MessageTopItem[];
  setItems: SetState<MessageTopItem[]>;
  style: CSSProperties;
}

export function pushMessageTop(
  node: ReactNode,
  setState: SetState<MessageTopItem[]>,
  title?: string
) {
  const messageItem: MessageTopItem = {
    children: node,
    key: crypto.randomUUID(),
    title,
  };
  setState((prevState) => [...prevState, messageItem]);
}

export function AlertTop(props: MessageTopProps) {
  return (
    <ToastContainer position="top-end" style={props.style}>
      {props.items.map((x) => (
        <Toast
          className="m-3"
          key={x.key}
          autohide
          onClose={(e) => {
            e?.preventDefault();
            props.setItems((prevState) =>
              prevState.filter((y) => y.key !== x.key)
            );
          }}
        >
          <Toast.Header>
            <span className="me-auto fw-bold">
              {x.title ? x.title : "Message"}
            </span>
          </Toast.Header>
          <Toast.Body>{x.children}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
