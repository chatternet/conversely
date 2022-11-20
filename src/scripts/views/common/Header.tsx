import { LOGO } from "../../commonutils";
import { navigate } from "../../commonutils";
import { AccountModal, AccountModalProps } from "./AccountModal";
import { Container, Navbar, Nav } from "react-bootstrap";

export interface HeaderProps {
  loggedIn: boolean;
  accountModalProps: AccountModalProps;
}

export function Header(props: HeaderProps) {
  return (
    <header className="border-bottom shadow-sm">
      <Navbar bg="light" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand href="#" onClick={() => navigate("/")}>
            <img src={LOGO} alt="logo" style={{ height: "32px" }} />{" "}
            <span style={{ fontWeight: 500 }}>Conversely</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link
                active={false}
                href="#"
                onClick={() => navigate("?feed")}
              >
                Feed
              </Nav.Link>
              <Nav.Link
                active={false}
                href="#"
                onClick={() => navigate("?following")}
              >
                Following
              </Nav.Link>
              <Nav.Link
                active={false}
                href="#"
                onClick={() => navigate("?settings")}
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
