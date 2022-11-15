import { UseState, SetState, clearState } from "../../commonutils";
import { CopyLink } from "./CopyLink";
import { FormatIdName } from "./FormatIdName";
import type { IdName } from "chatternet-client-http";
import { isEmpty } from "lodash-es";
import { useEffect, useState } from "react";
import React from "react";
import {
  Button,
  Collapse,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";

interface AccountSelectorProps {
  didName: IdName;
  selectedDid: string | undefined;
  login: (did: string, password: string) => Promise<void>;
  setSelectedDid: SetState<string | undefined>;
}

function AccountSelector(props: AccountSelectorProps) {
  if (!props.login) return null;

  const [password, setPassword]: UseState<string> = useState("");

  const submit = async () => {
    await props.login(props.didName.id, password);
  };

  const onSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    submit().catch((err) => console.error(err));
  };

  return (
    <div className="m-1">
      <a
        href="#"
        className="list-group-item list-group-item-action"
        onClick={() => props.setSelectedDid(props.didName.id)}
      >
        <FormatIdName {...props.didName} />
      </a>
      <Collapse in={props.selectedDid === props.didName.id}>
        <Form onSubmit={onSubmit}>
          <Form.Group className="m-3">
            <InputGroup>
              <InputGroup.Text>Password</InputGroup.Text>
              <Form.Control
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputGroup.Text>
                <a href="#" onClick={onSubmit}>
                  <i className="bi bi-arrow-return-left"></i>
                </a>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Form>
      </Collapse>
    </div>
  );
}

interface AccountModalOutBodyProps {
  count: number;
  getAccountsName: () => Promise<IdName[]>;
  accountSelectorProps: Omit<
    AccountSelectorProps,
    "didName" | "selectedDid" | "setSelectedDid"
  >;
}

function AccountModalOutBody(props: AccountModalOutBodyProps) {
  const [selectedDid, setSelectedDid]: UseState<string | undefined> =
    useState();
  const [accountsName, setAccountsName]: UseState<IdName[] | undefined> =
    useState();

  // re-calculate whenever it is shown (count goes up)
  useEffect(() => {
    props
      .getAccountsName()
      .then(setAccountsName)
      .catch(() => console.error("unable to get account names"));
  }, [props.count]);

  if (!isEmpty(accountsName)) {
    return (
      <div>
        <p>Log into account:</p>
        <div className="list-group">
          {Object.values(accountsName ? accountsName : []).map((x) => (
            <AccountSelector
              key={x.id}
              didName={x}
              selectedDid={selectedDid}
              setSelectedDid={setSelectedDid}
              {...props.accountSelectorProps}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return <p>No accounts available.</p>;
  }
}

interface AccountModalInBodyProps {
  didName: IdName | undefined;
  logout: () => Promise<void>;
}

function AccountModalInBody(props: AccountModalInBodyProps) {
  if (!props.didName) return null;
  if (!props.logout) return null;

  return (
    <section>
      <div className="d-flex justify-content-center m-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            props.logout().catch((err) => console.error(err));
            clearState();
          }}
        >
          Log out
        </button>
      </div>
      <div className="grid m-2">
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">Name</div>
          <div className="col-9 text-truncate">{props.didName.name}</div>
        </div>
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">DID</div>
          <div className="col-9 text-truncate">
            <CopyLink value={props.didName.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

export interface LoginButtonProps {
  didName: IdName | undefined;
  loggedIn: boolean;
  loggingIn: boolean;
}

function LoginButton(props: LoginButtonProps) {
  if (props.loggedIn && props.didName) {
    if (props.didName) return <FormatIdName {...props.didName} plain />;
    else return <span>Logged in</span>;
  } else if (props.loggingIn) {
    return (
      <div className="d-flex align-items-center">
        <Spinner animation="grow" size="sm" />
        &ensp;
        <span>Loading</span>
      </div>
    );
  } else {
    return <span>Log In</span>;
  }
}

export interface AccountModalProps {
  loggingIn: boolean;
  loggedIn: boolean;
  loginButtonProps: LoginButtonProps;
  accountModalInBodyProps: AccountModalInBodyProps;
  accountModalOutBodyProps: Omit<AccountModalOutBodyProps, "count">;
}

export function AccountModal(props: AccountModalProps) {
  // used to update the state every time the modal is open
  const [count, setCount]: [number, SetState<number>] = useState(0);
  const [showModal, setShowModal]: [boolean, SetState<boolean>] =
    useState(false);

  return (
    <>
      <Button
        className="btn bg-purple-to-red"
        onClick={() => {
          if (props.loggingIn) return;
          setCount((prev) => prev + 1);
          setShowModal(true);
        }}
      >
        <LoginButton {...props.loginButtonProps} />
      </Button>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Account</Modal.Title>
          <Button
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          {props.loggedIn ? (
            <AccountModalInBody {...props.accountModalInBodyProps} />
          ) : (
            <AccountModalOutBody
              count={count}
              {...props.accountModalOutBodyProps}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
