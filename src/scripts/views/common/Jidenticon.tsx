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
    jdenticon.update(icon.current, props.value);
  }, [props.value]);
  return (
    <svg
      data-jdenticon-value={props.value}
      height={size}
      ref={icon}
      width={size}
      style={{
        backgroundColor: "white",
        borderRadius: "50%",
      }}
    />
  );
}
