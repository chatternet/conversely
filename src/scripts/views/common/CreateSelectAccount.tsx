import { UseState } from "../../commonutils";
import { AccountSelector, AccountSelectorProps } from "./AccountSelector";
import { AlertPasswordField } from "./CustomAlerts";
import { ActorNameProps } from "./FormatActorName";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  Row,
  Card,
  ListGroup,
  Alert,
} from "react-bootstrap";

export interface CreateAccountProps {
  loggedIn: boolean;
  loggingIn: boolean;
  createAccount: (
    displayName: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  setSelectAccount: () => void;
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

  const setSelectAccount: React.MouseEventHandler = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    props.setSelectAccount();
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

            <AlertPasswordField />

            <div className="text-center mt-3">
              <Button type="submit">Create account</Button> or{" "}
              <a href="#" onClick={setSelectAccount}>
                Select an account
              </a>
            </div>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}

export interface SelectAccountProps {
  accountsDid: string[];
  FormatActorNameProps: Omit<ActorNameProps, "id">;
  accountSelectorProps: Omit<
    AccountSelectorProps,
    "did" | "FormatActorNameProps" | "selectedDid" | "setSelectedDid"
  >;
  setCreateAccount: () => void;
}

export function SelectAccount(props: SelectAccountProps) {
  const [selectedDid, setSelectedDid]: UseState<string | undefined> =
    useState();

  const setCreateAccount: React.MouseEventHandler = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    props.setCreateAccount();
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>Log into account</Card.Header>
      <Card.Body>
        {props.accountsDid.length > 0 ? (
          <ListGroup>
            {props.accountsDid.map((x) => (
              <AccountSelector
                key={x}
                did={x}
                selectedDid={selectedDid}
                setSelectedDid={setSelectedDid}
                FormatActorNameProps={{ ...props.FormatActorNameProps }}
                {...props.accountSelectorProps}
              />
            ))}
          </ListGroup>
        ) : (
          <Alert>No accounts available.</Alert>
        )}
        <div className="text-center mt-3">
          <a href="#" onClick={setCreateAccount}>
            Create an account
          </a>
        </div>
      </Card.Body>
    </Card>
  );
}

export interface CreateSelectAccountProps {
  createAccountProps: Omit<CreateAccountProps, "setSelectAccount">;
  selectAccountProps: Omit<SelectAccountProps, "setCreateAccount">;
}

export function CreateSelectAccount(props: CreateSelectAccountProps) {
  const [isCreate, setIsCreate]: UseState<boolean> = useState(true);
  useEffect(() => {
    if (props.selectAccountProps.accountsDid.length > 0) setIsCreate(false);
  }, [props.selectAccountProps.accountsDid]);
  return isCreate ? (
    <CreateAccount
      {...props.createAccountProps}
      setSelectAccount={() => {
        setIsCreate(false);
      }}
    />
  ) : (
    <SelectAccount
      {...props.selectAccountProps}
      setCreateAccount={() => {
        setIsCreate(true);
      }}
    />
  );
}
