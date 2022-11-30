import {
  UseState,
  SetState,
  clearState,
  onClickNavigate,
} from "../../commonutils";
import { CopyLink } from "./CopyLink";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { ChatterNet, IdName } from "chatternet-client-http";
import { useState } from "react";
import React from "react";
import {
  Button,
  Collapse,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Spinner,
} from "react-bootstrap";

interface AccountSelectorProps {
  did: string;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  selectedDid: string | undefined;
  login: (did: string, password: string) => Promise<void>;
  setSelectedDid: SetState<string | undefined>;
}

function AccountSelector(props: AccountSelectorProps) {
  if (!props.login) return null;

  const [password, setPassword]: UseState<string> = useState("");

  const submit = async () => {
    await props.login(props.did, password);
  };

  const onSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    submit().catch((err) => console.error(err));
  };

  const accountId = ChatterNet.actorFromDid(props.did);

  return (
    <ListGroup.Item>
      <a
        href="#"
        className="d-block"
        onClick={() => props.setSelectedDid(props.did)}
      >
        <FormatIdName id={accountId} {...props.formatIdNameProps} />
      </a>
      <Collapse in={props.selectedDid === props.did}>
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
    </ListGroup.Item>
  );
}

interface AccountModalOutBodyProps {
  accountsDid: string[];
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  accountSelectorProps: Omit<
    AccountSelectorProps,
    "did" | "formatIdNameProps" | "selectedDid" | "setSelectedDid"
  >;
}

function AccountModalOutBody(props: AccountModalOutBodyProps) {
  const [selectedDid, setSelectedDid]: UseState<string | undefined> =
    useState();

  if (props.accountsDid.length > 0) {
    return (
      <div>
        <p>Log into account:</p>
        <ListGroup>
          {props.accountsDid.map((x) => (
            <AccountSelector
              key={x}
              did={x}
              selectedDid={selectedDid}
              setSelectedDid={setSelectedDid}
              formatIdNameProps={{ ...props.formatIdNameProps }}
              {...props.accountSelectorProps}
            />
          ))}
        </ListGroup>
      </div>
    );
  } else {
    return <p>No accounts available.</p>;
  }
}

interface AccountModalInBodyProps {
  didName: IdName | undefined;
  logout: () => Promise<void>;
  setShowModal: SetState<boolean>;
}

function AccountModalInBody(props: AccountModalInBodyProps) {
  if (!props.didName) return null;
  if (!props.logout) return null;

  const actorId = `${props.didName.id}/actor`;

  const navigate = onClickNavigate("/settings");

  return (
    <section>
      <div className="d-flex justify-content-center m-2">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            props.logout().catch((err) => console.error(err));
            props.setShowModal(false);
            clearState();
          }}
        >
          Log out
        </Button>
        &nbsp;
        <Button
          type="button"
          className="btn btn-primary"
          onClick={(event) => {
            navigate(event);
            props.setShowModal(false);
          }}
        >
          Modify
        </Button>
      </div>
      <div className="grid m-2">
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">Name</div>
          <div className="col-9 text-truncate">{props.didName.name}</div>
        </div>
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">ID</div>
          <div className="col-9 text-truncate">
            <CopyLink value={actorId} />
          </div>
        </div>
      </div>
    </section>
  );
}

export interface LoginButtonProps {
  did: string | undefined;
  formatIdNameProps: Omit<FormatIdNameProps, "id" | "plain">;
  loggedIn: boolean;
  loggingIn: boolean;
}

function LoginButton(props: LoginButtonProps) {
  if (props.loggedIn && props.did) {
    return <FormatIdName id={props.did} {...props.formatIdNameProps} plain />;
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
  accountModalInBodyProps: Omit<AccountModalInBodyProps, "setShowModal">;
  accountModalOutBodyProps: Omit<AccountModalOutBodyProps, "count">;
}

export function AccountModal(props: AccountModalProps) {
  // used to update the state every time the modal is open
  const [showModal, setShowModal]: [boolean, SetState<boolean>] =
    useState(false);

  return (
    <>
      <Button
        className="btn bg-purple-to-red"
        onClick={() => {
          if (props.loggingIn) return;
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
            <AccountModalInBody
              setShowModal={setShowModal}
              {...props.accountModalInBodyProps}
            />
          ) : (
            <AccountModalOutBody {...props.accountModalOutBodyProps} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
