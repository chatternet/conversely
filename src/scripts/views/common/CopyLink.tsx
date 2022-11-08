import { UseState } from "../../commonutils";
import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export interface CopyLinkProps {
  value: string;
  altText?: string;
}

export function CopyLink(props: CopyLinkProps) {
  // TODO: what was this for again?
  const [showTooltip, _setShowTooltip]: UseState<boolean> = useState(false);

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        trigger="focus"
        overlay={
          <Tooltip id="button-tooltip" show={showTooltip}>
            Copied!
          </Tooltip>
        }
      >
        <a
          href="#"
          className="me-3 text-decoration-none d-flex align-items-center"
          onClick={() => {
            navigator.clipboard.writeText(props.value);
          }}
        >
          <i className="bi bi-clipboard-check"></i>
          &nbsp;
          <span className="text-truncate">
            {props.altText ? props.altText : props.value}
          </span>
        </a>
      </OverlayTrigger>
    </>
  );
}
