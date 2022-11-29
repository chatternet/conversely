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

  const [did] = props.id.split("/");
  const suffix = did.split("").reverse().slice(0, 8).join("");

  const name = props.name && props.name.trim().length > 0 ? props.name : suffix;

  return (
    <span>
      <span className={props.plain ? "" : "display-name"}>@{name}</span>
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
