import { UseState, SetState } from "../../commonutils";
import { FormatIdName, FormatIdNameProps } from "./FormatIdName";
import { ChatterNet } from "chatternet-client-http";
import { useState } from "react";
import React from "react";
import { Collapse, Form, InputGroup, ListGroup } from "react-bootstrap";

export interface AccountSelectorProps {
  did: string;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  selectedDid: string | undefined;
  isPasswordless: (did: string) => boolean;
  login: (did: string, password: string) => Promise<void>;
  setSelectedDid: SetState<string | undefined>;
}

export function AccountSelector(props: AccountSelectorProps) {
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
  const isPasswordless = props.isPasswordless(props.did);

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
                placeholder={isPasswordless ? "no password" : ""}
                value={password}
                disabled={isPasswordless}
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
