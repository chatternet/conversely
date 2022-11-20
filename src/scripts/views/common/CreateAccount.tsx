import { UseState } from "../../commonutils";
import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Card } from "react-bootstrap";

export interface CreateAccountProps {
  loggedIn: boolean;
  loggingIn: boolean;
  createAccount: (
    displayName: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export function CreateAccount(props: CreateAccountProps) {
  if (!props.createAccount) return null;

  const [displayName, setDisplayName]: UseState<string> = useState("");
  const [password, setPassword]: UseState<string> = useState("");
  const [confirmPassword, setPasswordConfirm]: UseState<string> = useState("");
  const [wasFocused, setWasFocused]: UseState<boolean> = useState(false);

  const onSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    props
      .createAccount(displayName, password, confirmPassword)
      .catch((err) => console.error(err));
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>Create an account</Card.Header>
      <Card.Body>
        <Form
          onSubmit={onSubmit}
          onFocus={() => {
            setWasFocused(true);
          }}
        >
          <fieldset disabled={props.loggedIn || props.loggingIn}>
            <Row className="mb-3">
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    placeholder="display name"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                    isValid={!!displayName}
                    isInvalid={!displayName && wasFocused}
                  />
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    placeholder="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <InputGroup hasValidation>
                  <Form.Control
                    placeholder="confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                    }}
                    isValid={!!password && password === confirmPassword}
                    isInvalid={password !== confirmPassword}
                  />
                </InputGroup>
              </Form.Group>
            </Row>

            <div className="text-center">
              <Button type="submit">Create Account</Button>
            </div>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}
