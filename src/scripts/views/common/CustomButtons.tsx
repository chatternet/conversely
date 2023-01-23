import { omit } from "lodash-es";
import { Button, ButtonProps } from "react-bootstrap";

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
