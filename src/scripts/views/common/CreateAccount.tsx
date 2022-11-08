import { UseState } from "../../commonutils";
import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Card } from "react-bootstrap";

export interface CreateAccountProps {
  loggedIn: boolean;
  loggingIn: boolean;
  createAccount: (
    displayName: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
}

export function CreateAccount(props: CreateAccountProps) {
  if (!props.createAccount) return null;

  const [displayName, setDisplayName]: UseState<string> = useState("");
  const [password, setPassword]: UseState<string> = useState("");
  const [passwordConfirm, setPasswordConfirm]: UseState<string> = useState("");
  const [wasFocused, setWasFocused]: UseState<boolean> = useState(false);

  const onSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    props
      .createAccount(displayName, password, passwordConfirm)
      .catch((err) => console.error(err));
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Text className="lead">
          Create an identity to get started!
        </Card.Text>
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
                <Form.Text>
                  Enter a display name to help others find you.
                </Form.Text>
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
                <Form.Text>
                  This password cannot be recovered. Do not lose it.
                </Form.Text>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <InputGroup hasValidation>
                  <Form.Control
                    placeholder="confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                    }}
                    isValid={!!password && password === passwordConfirm}
                    isInvalid={password !== passwordConfirm}
                  />
                </InputGroup>
              </Form.Group>
            </Row>

            <Button type="submit">Create identity</Button>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}
