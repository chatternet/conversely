import { IdToName } from "../../controllers/interfaces";
import { Jidenticon } from "./Jidenticon";
import { MouseEvent } from "react";
import { Link } from "react-router-dom";

export interface FormatActorNameProps {
  id: string;
  idToName: IdToName;
  localActorId?: string;
  bare?: boolean;
  contacts?: Set<string>;
  addFollowing?: (id: string) => Promise<void>;
}

export function FormatActorName(props: FormatActorNameProps) {
  function addFollowing(event: MouseEvent) {
    event.preventDefault();
    if (props.addFollowing == null) return;
    props.addFollowing(props.id).catch((x) => console.error(x));
  }

  const [did] = props.id.split("/");
  const suffix = did.split("").reverse().slice(0, 8).join("");

  let name = props.idToName.get(props.id);
  name = name != null && name.trim().length > 0 ? name : suffix;

  const isLocal = props.localActorId === props.id;
  const isContact = props.contacts && props.contacts.has(props.id);
  const showIsContact =
    !props.bare && !isLocal && isContact && !!props.addFollowing;
  const showAddContact =
    !props.bare && !isLocal && !isContact && !!props.addFollowing;

  const actorPath = `/actor?did=${did}`;

  return (
    <span className="text-nowrap">
      <span className="me-1">
        <Jidenticon value={props.id} size="1em" />
      </span>
      {props.bare ? (
        <span className="fw-bold">{name}</span>
      ) : (
        <Link to={actorPath}>{name}</Link>
      )}
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
