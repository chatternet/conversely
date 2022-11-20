import { MouseEvent } from "react";

export interface FormatIdNameProps {
  id: string;
  name: string;
  plain?: boolean;
  addContact?: (id: string) => Promise<void>;
}

export function FormatIdName(props: FormatIdNameProps) {
  function addContact(event: MouseEvent) {
    event.preventDefault();
    if (props.addContact == null) return;
    props.addContact(props.id).catch((x) => console.error(x));
  }

  return (
    <span>
      <span className={props.plain ? "" : "display-name"}>@{props.name}</span>
      {props.addContact ? (
        <span>
          {" "}
          <a
            href="#"
            onClick={addContact}
            className={props.plain ? "" : "display-name"}
          >
            <i className="bi bi-person-plus-fill"></i>
          </a>
        </span>
      ) : null}
    </span>
  );
}
