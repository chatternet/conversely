import { LOGO } from "../../commonutils";
import { AccountModal, AccountModalProps } from "./AccountModal";
import { AlertTop, MessageTopProps } from "./MessageTop";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface HeaderProps {
  loggedIn: boolean;
  accountModalProps: AccountModalProps;
  alertTopProps: Omit<MessageTopProps, "style">;
}

export function Header(props: HeaderProps) {
  return (
    <header className="border-bottom shadow-sm">
      <Navbar bg="light" expand="md" collapseOnSelect>
        <Container className="max-width-lg">
          <Link to="/" className="navbar-brand">
            <img src={LOGO} alt="logo" style={{ height: "32px" }} />{" "}
            <span>Conversely</span>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Item>
                <Link to="/feed" className="nav-link active">
                  Feed
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/contacts" className="nav-link active">
                  Contacts
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/followers" className="nav-link active">
                  Followers
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/settings" className="nav-link active">
                  Settings
                </Link>
              </Nav.Item>
            </Nav>
            <div className="m-1">
              <AccountModal {...props.accountModalProps} />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="max-width-lg">
        <AlertTop {...props.alertTopProps} style={{ marginTop: "4em" }} />
      </div>
    </header>
  );
}
