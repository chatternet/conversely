import { IdToName } from "../../controllers/interfaces";
import { Jidenticon } from "./Jidenticon";
import { MouseEvent } from "react";

export interface FormatIdNameProps {
  id: string;
  idToName: IdToName;
  bare?: boolean;
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
  const showIsContact = !props.bare && isContact && !!props.addFollowing;
  const showAddContact = !props.bare && !isContact && !!props.addFollowing;

  return (
    <span>
      <span>
        <Jidenticon value={props.id} size="1em" />
      </span>
      <span className="ms-1 fw-bold">{name}</span>
      {showIsContact ? (
        <span className="ms-1">
          <i className="bi bi-person-check-fill"></i>
        </span>
      ) : null}
      {showAddContact ? (
        <span className="ms-1">
          <a href="#" onClick={addFollowing}>
            <i className="bi bi-person-plus-fill"></i>
          </a>
        </span>
      ) : null}
    </span>
  );
}
