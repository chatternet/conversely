import { IdToName } from "../../controllers/interfaces";
import { Jidenticon } from "./Jidenticon";
import { Link } from "react-router-dom";

export interface ActorNameProps {
  id: string;
  idToName: IdToName;
  noLink?: boolean;
  contacts?: Set<string>;
  style?: React.CSSProperties;
  className?: string;
}

export function ActorName(props: ActorNameProps) {
  const [did] = props.id.split("/");
  const suffix = did.split("").reverse().slice(0, 8).join("");

  let name = props.idToName.get(props.id);
  name = name != null && name.trim().length > 0 ? name : suffix;

  const isContact = props.contacts && props.contacts.has(props.id);
  const jointClassName = ["text-nowrap", props.className].join(" ");
  const actorPath = `/actor?did=${did}`;

  return (
    <span className={jointClassName} style={props.style}>
      {props.noLink ? name : <Link to={actorPath}>{name}</Link>}
      {isContact ? (
        <span className="ms-1">
          <i className="bi bi-person-fill"></i>
        </span>
      ) : null}
    </span>
  );
}

export function ActorNameIcon(props: ActorNameProps) {
  const { className, style, ...otherProps } = props;
  const jointClassName = ["text-nowrap", props.className].join(" ");
  return (
    <span className={jointClassName}>
      <span className="me-1">
        <Jidenticon value={otherProps.id} size="1.25em" className="border" />
      </span>
      <ActorName {...otherProps} />
    </span>
  );
}
