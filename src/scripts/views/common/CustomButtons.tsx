import { omit } from "lodash-es";
import { Button, ButtonProps } from "react-bootstrap";
import { ButtonVariant } from "react-bootstrap/esm/types";
import { Link } from "react-router-dom";

export interface CustomButtonProps {
  small?: boolean;
}

export function CustomButton(props: ButtonProps & CustomButtonProps) {
  const className =
    props.className +
    " rounded-pill shadow-sm" +
    (props.small ? " py-1 px-2" : "");
  const button = (
    <Button
      {...omit(props, "small")}
      className={className}
      style={{ lineHeight: "inherit", fontSize: "inherit" }}
    >
      {props.children}
    </Button>
  );
  return props.small ? <small>{button}</small> : button;
}

export interface CustomButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  target?: string;
  small?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CustomButtonLink(props: CustomButtonLinkProps) {
  const className =
    props.className +
    " rounded-pill shadow-sm btn" +
    ` btn-${props.variant ?? "primary"}` +
    (props.small ? " py-1 px-2" : "");
  return (
    <small>
      <Link to={props.to} target={props.target}>
        <span className={className} style={props.style}>
          {props.children}
        </span>
      </Link>
    </small>
  );
}
