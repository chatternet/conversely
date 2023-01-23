import { SetState, clearState, onClickNavigate } from "../../commonutils";
import { CopyLink } from "./CopyLink";
import {
  CreateSelectAccount,
  CreateSelectAccountProps,
} from "./CreateSelectAccount";
import { CustomButton } from "./CustomButtons";
import { ActorNameIcon, ActorNameProps } from "./FormatActorName";
import { IdName } from "chatternet-client-http";
import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

interface AccountModalBodyProps {
  didName: IdName | undefined;
  logout: () => Promise<void>;
  setShowModal: SetState<boolean>;
}

function AccountModalBody(props: AccountModalBodyProps) {
  if (!props.didName) return null;
  if (!props.logout) return null;

  const navigate = onClickNavigate("/settings");

  return (
    <section>
      <div className="d-flex justify-content-center m-2">
        <CustomButton
          variant="outline-primary"
          onClick={() => {
            props.logout().catch((err) => console.error(err));
            props.setShowModal(false);
            clearState();
          }}
          small
        >
          Log out
        </CustomButton>
        &nbsp;
        <CustomButton
          variant="outline-primary"
          onClick={(event) => {
            navigate(event);
            props.setShowModal(false);
          }}
          small
        >
          Modify
        </CustomButton>
      </div>
      <div className="grid m-2">
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">Name</div>
          <div className="col-9 text-truncate">{props.didName.name}</div>
        </div>
        <div className="row mb-2">
          <div className="col-3 bg-secondary text-white rounded">ID</div>
          <div className="col-9 text-truncate">
            <CopyLink value={props.didName.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

export interface LoginButtonProps {
  localActorId: string | undefined;
  FormatActorNameProps: Omit<ActorNameProps, "id" | "plain">;
  loggedIn: boolean;
  loggingIn: boolean;
}

function LoginButton(props: LoginButtonProps) {
  if (props.loggedIn && props.localActorId) {
    return (
      <ActorNameIcon id={props.localActorId} {...props.FormatActorNameProps} />
    );
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
  accountModalInBodyProps: Omit<AccountModalBodyProps, "setShowModal">;
  createSelectAccountProps: CreateSelectAccountProps;
}

export function AccountModal(props: AccountModalProps) {
  // used to update the state every time the modal is open
  const [showModal, setShowModal]: [boolean, SetState<boolean>] =
    useState(false);

  return (
    <>
      <Button
        className="bg-purple-to-red border border-0 shadow-sm"
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
          <Button variant="close" onClick={() => setShowModal(false)}></Button>
        </Modal.Header>
        <Modal.Body>
          {props.loggedIn ? (
            <AccountModalBody
              setShowModal={setShowModal}
              {...props.accountModalInBodyProps}
            />
          ) : (
            <CreateSelectAccount {...props.createSelectAccountProps} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
