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
  const hasName = name != null && name.trim().length > 0;

  const isFollowed = props.following && props.following.has(props.id);
  const jointClassName = ["text-nowrap", props.className].join(" ");
  const topicPath = `/topic?id=${id}`;

  const content = hasName ? (
    `#${name}`
  ) : (
    <span className="font-monospace">#id:{suffix}</span>
  );

  // TODO: re-add link when working
  // {props.noLink ? content : <Link to={topicPath}>{content}</Link>}

  return (
    <span className={jointClassName} style={props.style}>
      {content}
      {isFollowed ? (
        <span className="ms-1">
          <i className="bi bi-check"></i>
        </span>
      ) : null}
    </span>
  );
}
