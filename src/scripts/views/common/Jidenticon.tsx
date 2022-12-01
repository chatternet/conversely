/**
 * from https://github.com/jmcudd/react-jdenticon
 */
import * as jdenticon from "jdenticon";
import { useRef, useEffect } from "react";

export interface JidenticonProps {
  value: string;
  size?: string;
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
  return (
    <svg
      data-jdenticon-value={props.value}
      height={size}
      ref={icon}
      width={size}
      style={{
        borderRadius: "50%",
      }}
    />
  );
}
