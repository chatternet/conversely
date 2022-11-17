import { LOGO, LOGO_SOLID } from "../commonutils";
import { FormatIdName } from "./common/FormatIdName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import type { IdName } from "chatternet-client-http";
import { Card, Row, Col, Container, Alert } from "react-bootstrap";

export type WelcomeProps = {
  loggedIn: boolean | undefined;
  didName: IdName | undefined;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
};

export function Welcome(props: WelcomeProps) {
  return (
    <div>
      <Container className="max-width-lg pt-3">
        <Row className="align-items-center text-center my-4">
          <Col md={8}>
            <h1>
              <span className="display-5 text-purple-to-red text-shadow-sm">
                Chit Chatter
              </span>
            </h1>
            <div className="display-6">A different kind of social.</div>
          </Col>
          <Col md>
            <div style={{ height: "18em" }} className="position-relative">
              <div
                style={{ height: "12em", width: "12em" }}
                className="bg-round-purple-to-red position-absolute top-50 start-50 translate-middle"
              ></div>
              <img
                src={LOGO}
                alt="logo"
                style={{
                  height: "8em",
                  filter: "drop-shadow(0 0 1.0em rgba(255, 255, 255, 0.667))",
                }}
                className="position-absolute top-50 start-50 translate-middle"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="max-width-md my-3">
        <p className="fs-5">
          Welcome to Chit Chatter
          {props.didName ? (
            <>
              {" "}
              <FormatIdName {...props.didName} />
            </>
          ) : null}
          .{" "}
          {props.loggedIn ? (
            <>
              You're already logged in and ready to go, it's really that easy!
            </>
          ) : (
            <>
              Select or create an account to get started. All you need is a name
              and a password.
            </>
          )}
        </p>
      </Container>

      <Container className="my-3">
        <div className="max-width-md mx-auto">
          <MessagesList
            pageSize={4}
            allowMore={false}
            {...props.messagesListProps}
          />
        </div>
      </Container>

      <Container className="max-width-md my-3">
        <p className="fs-5">
          There's a lot going on behind the scenes to deliver a social
          experience which empowers you, the user. Find more information on this
          page, or jump right into the social feed.
        </p>
      </Container>

      <Container className="max-width-lg my-5">
        <Row>
          <Col md className="my-3">
            <Card className="h-100">
              <Card.Header className="p-3">
                <span
                  style={{ fontWeight: 700 }}
                  className="flex align-items-center"
                >
                  <span className="bg-icon rounded">
                    <i className="bi bi-person-badge-fill"></i>
                  </span>
                  &nbsp; Own your identity
                </span>
              </Card.Header>
              <Card.Body className="text-secondary">
                <Card.Text>
                  You prove your own identity when interacting with others. No
                  need for an organization to issue an account which can be
                  retracted.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md className="my-3">
            <Card className="h-100">
              <Card.Header className="p-3">
                <span style={{ fontWeight: 700 }}>
                  <span className="bg-icon rounded">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  &nbsp; No lock-in
                </span>
              </Card.Header>
              <Card.Body className="text-secondary">
                <Card.Text>
                  Content and accounts can move freely between apps. If an app
                  falls to the wayside, simply move to a new app.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={{ span: 4 }} className="my-3">
            <Card className="h-100">
              <Card.Header className="p-3">
                <span
                  style={{ fontWeight: 700 }}
                  className="flex align-items-center"
                >
                  <span className="bg-icon rounded">
                    <i className="bi bi-robot"></i>
                  </span>
                  &nbsp; Spot bot spam
                </span>
              </Card.Header>
              <Card.Body className="text-secondary">
                <Card.Text>
                  You hear only from people you follow, the people they follow,
                  and so on. A spammer must gain the trust of someone you trust
                  to reach you.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div className="my-4"></div>

      <Container className="max-width-md">
        <Alert variant="danger">
          <div className="d-flex align-items-center">
            <div className="me-2">
              <i className="bi bi-exclamation-triangle-fill fs-3"></i>
            </div>
            <div className="ms-2">
              Chit Chatter is currently in the prototype phase. Some features
              are missing, some are incomplete, and some are broken.
            </div>
          </div>
        </Alert>
      </Container>

      <Container className="max-width-md text-spaced"></Container>
    </div>
  );
}
