export interface FormatIdNameProps {
  id: string;
  name: string;
  plain?: boolean;
}

export function FormatIdName(props: FormatIdNameProps) {
  return (
    <span className={props.plain ? "" : "display-name"}>@{props.name}</span>
  );
}
