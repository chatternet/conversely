import { Alert, AlertProps } from "react-bootstrap";

export function CustomAlert(props: AlertProps) {
  return (
    <Alert {...props}>
      <div className="d-flex align-items-center">
        <div className="me-2">
          {props.variant === "danger" ? (
            <i className="bi bi-exclamation-triangle-fill fs-4"></i>
          ) : (
            <i className="bi bi-info-circle-fill fs-4"></i>
          )}
        </div>
        <div className="ms-2">{props.children}</div>
      </div>
    </Alert>
  );
}

export function AlertPasswordField() {
  return (
    <CustomAlert variant="info">
      The password field is optional. If you do not use a password, anyone with
      access to your device can use your account.
    </CustomAlert>
  );
}

export function AlertNotLoggedIn() {
  return (
    <CustomAlert variant="danger">
      Page cannot be loaded because there is no logged-in account.
    </CustomAlert>
  );
}
