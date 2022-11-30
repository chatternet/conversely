import { IdToName } from "../../controllers/interfaces";
import { MouseEvent } from "react";

export interface FormatIdNameProps {
  id: string;
  idToName: IdToName;
  plain?: boolean;
  contacts?: Set<string>;
  addFollowing?: (id: string) => Promise<void>;
}

export function FormatIdName(props: FormatIdNameProps) {
  function addFollowing(event: MouseEvent) {
    event.preventDefault();
    if (props.addFollowing == null) return;
    props.addFollowing(props.id).catch((x) => console.error(x));
  }

  const [did] = props.id.split("/");
  const suffix = did.split("").reverse().slice(0, 8).join("");

  let name = props.idToName.get(props.id);
  name = name != null && name.trim().length > 0 ? name : suffix;

  const isContact = props.contacts && props.contacts.has(props.id);

  return (
    <span>
      <span className={props.plain ? "" : "display-name"}>@{name}</span>
      {!props.plain && isContact ? (
        <span className="display-name ms-1">
          <i className="bi bi-person-check-fill"></i>
        </span>
      ) : null}
      {!props.plain &&
      props.contacts != null &&
      !isContact &&
      props.addFollowing ? (
        <span className="display-name ms-1">
          <a href="#" onClick={addFollowing}>
            <i className="bi bi-person-plus-fill"></i>
          </a>
        </span>
      ) : null}
    </span>
  );
}
