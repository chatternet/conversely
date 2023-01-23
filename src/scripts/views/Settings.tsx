import { UseState, clearState } from "../commonutils";
import { AlertPasswordField } from "./common/CustomAlerts";
import { CustomButton } from "./common/CustomButtons";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { FormEvent, useState } from "react";
import { Card, Container, Form } from "react-bootstrap";

export interface SettingsProps {
  loggedIn: boolean;
  changeDisplayName(newDisplayName: string): Promise<void>;
  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void>;
  clearAll: () => Promise<void>;
  scaffoldProps: Omit<ScaffoldProps, "children">;
}

export function Settings(props: SettingsProps) {
  const [displayName, setDisplayName]: UseState<string> = useState("");
  const [oldPassword, setOldPassword]: UseState<string> = useState("");
  const [newPassword, setNewPassword]: UseState<string> = useState("");
  const [confirmPassword, setConfirmPassword]: UseState<string> = useState("");

  const deleteAll = (event: FormEvent) => {
    event.preventDefault();
    props
      .clearAll()
      .then(clearState)
      .catch((err) => console.error(err));
  };

  const changeDisplayName = (event: FormEvent) => {
    event.preventDefault();
    props
      .changeDisplayName(displayName)
      .then(() => setDisplayName(""))
      .catch((err) => console.error(err));
  };

  const changePassword = (event: FormEvent) => {
    event.preventDefault();
    props
      .changePassword(oldPassword, newPassword, confirmPassword)
      .then(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <Scaffold {...props.scaffoldProps}>
      <Container className="my-3">
        <div className="max-width-md mx-auto">
          {props.loggedIn ? (
            <>
              <h2>Account</h2>

              <Card className="rounded m-3">
                <Card.Header>Change display name</Card.Header>
                <Card.Body>
                  <Form onSubmit={changeDisplayName}>
                    <Form.Control
                      placeholder="new display name"
                      type="text"
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                      }}
                      className="my-1"
                    />
                    <div className="text-center">
                      <CustomButton
                        type="submit"
                        variant="outline-primary"
                        className="my-1"
                      >
                        Change display name
                      </CustomButton>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="rounded m-3">
                <Card.Header>Change password</Card.Header>
                <Card.Body>
                  <Form onSubmit={changePassword}>
                    <Form.Control
                      placeholder="current password"
                      type="password"
                      autoComplete="current-password"
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                      }}
                      className="my-1"
                    />
                    <Form.Control
                      placeholder="new password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                      className="my-1"
                    />
                    <Form.Control
                      placeholder="confirm password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      className="my-1"
                    />
                    <AlertPasswordField />
                    <div className="text-center">
                      <CustomButton
                        type="submit"
                        variant="outline-primary"
                        className="my-1"
                      >
                        Change password
                      </CustomButton>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </>
          ) : null}

          <h2>Global</h2>

          <Card className="rounded m-3">
            <Card.Header>Delete data</Card.Header>
            <Card.Body>
              <Form onSubmit={deleteAll}>
                <div className="text-center">
                  <CustomButton type="submit" variant="danger">
                    Delete all data
                  </CustomButton>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </Scaffold>
  );
}
