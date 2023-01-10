import { LOGO } from "../../commonutils";
import { onClickNavigate } from "../../commonutils";
import { AccountModal, AccountModalProps } from "./AccountModal";
import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";

export interface HeaderProps {
  loggedIn: boolean;
  accountModalProps: AccountModalProps;
}

export function Header(props: HeaderProps) {
  return (
    <header className="border-bottom shadow-sm">
      <Navbar bg="light" expand="md" collapseOnSelect>
        <Container className="max-width-lg">
          <Navbar.Brand href="/" onClick={onClickNavigate("/")}>
            <img src={LOGO} alt="logo" style={{ height: "32px" }} />{" "}
            <span>Conversely</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link
                active={false}
                href="/feed"
                onClick={onClickNavigate("/feed")}
              >
                Feed
              </Nav.Link>
              <Nav.Link
                active={false}
                href="/following"
                onClick={onClickNavigate("/following")}
              >
                Following
              </Nav.Link>
              <Nav.Link
                active={false}
                href="/following"
                onClick={onClickNavigate("/followers")}
              >
                Followers
              </Nav.Link>
              <Nav.Link
                active={false}
                href="/settings"
                onClick={onClickNavigate("/settings")}
              >
                Settings
              </Nav.Link>
            </Nav>
            <div className="m-1">
              <AccountModal {...props.accountModalProps} />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
