export interface FormatIdNameProps {
  id: string;
  name: string;
}

export function FormatIdName(props: FormatIdNameProps) {
  return <span className="display-name">@{props.name}</span>;
}
