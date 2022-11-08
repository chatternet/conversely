import type { IdNameSuffix } from "../../controllers/interfaces";

export interface FormatIdNameSuffixProps {
  idNameSuffix: IdNameSuffix;
  variant?: "light" | "dark";
  plain?: boolean;
}

export function FormatIdNameSuffix(props: FormatIdNameSuffixProps) {
  if (!props.idNameSuffix) return null;
  const variant = props.variant ? props.variant : "light";
  return (
    <span className={props.plain ? "" : `display-name-${variant}`}>
      @{props.idNameSuffix.name}
      {props.idNameSuffix.suffix ? (
        <span>
          &nbsp;
          <small className={`font-monospace display-name-suffix-${variant}`}>
            [{props.idNameSuffix.suffix}]
          </small>
        </span>
      ) : null}
    </span>
  );
}
