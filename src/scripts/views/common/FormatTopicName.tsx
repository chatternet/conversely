import { IdToName } from "../../controllers/interfaces";
import { Link } from "react-router-dom";

export interface TopicNameProps {
  id: string;
  idToName: IdToName;
  noLink?: boolean;
  following?: Set<string>;
  style?: React.CSSProperties;
  className?: string;
}

export function TopicName(props: TopicNameProps) {
  const [id] = props.id.split("/");
  const suffix = id.split("").reverse().slice(0, 8).join("");

  let name = props.idToName.get(props.id);
  name = name != null && name.trim().length > 0 ? name : suffix;

  const isFollowed = props.following && props.following.has(props.id);
  const jointClassName = ["text-nowrap", props.className].join(" ");
  const topicPath = `/topic?id=${id}`;

  return (
    <span className={jointClassName} style={props.style}>
      {props.noLink ? name : <Link to={topicPath}>{name}</Link>}
      {isFollowed ? (
        <span className="ms-1">
          <i className="bi bi-check"></i>
        </span>
      ) : null}
    </span>
  );
}
