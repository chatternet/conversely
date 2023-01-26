/**
 * from https://github.com/jmcudd/react-jdenticon
 */
import * as jdenticon from "jdenticon";
import { useRef, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export interface JidenticonProps {
  value: string;
  size?: string;
  className?: string;
}

export function Jidenticon(props: JidenticonProps) {
  const size = props.size ? props.size : "100%";
  const icon = useRef(null);
  useEffect(() => {
    if (icon.current == null) return;
    jdenticon.configure({
      lightness: {
        color: [0.2, 0.5],
        grayscale: [0.2, 0.5],
      },
      saturation: {
        color: 0.67,
        grayscale: 0.1,
      },
      backColor: "#fff",
    });
    jdenticon.update(icon.current, props.value);
  }, [props.value]);
  const [id] = props.value.split("/");
  const suffix = id.split("").reverse().slice(0, 8).join("");
  const tooltip = (
    <Tooltip id={id}>
      <small className="font-monospace">{suffix}</small>
    </Tooltip>
  );
  return (
    <OverlayTrigger
      overlay={tooltip}
      trigger={["hover", "focus", "click"]}
      delay={{ show: 300, hide: 400 }}
    >
      <svg
        data-jdenticon-value={props.value}
        height={size}
        ref={icon}
        width={size}
        className={props.className}
        style={{
          borderRadius: "50%",
        }}
      />
    </OverlayTrigger>
  );
}
