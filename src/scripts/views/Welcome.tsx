import { LOGO, LOGO_SOLID } from "../commonutils";
import { FormatIdNameSuffix } from "./common/FormatNameSuffix";
import { IdNameSuffix } from "chatternet-client-http";
import { Card, Row, Col, Container, Alert } from "react-bootstrap";

export type WelcomeProps = {
  loggedIn: boolean | undefined;
  didNameSuffix: IdNameSuffix | undefined;
};

export function Welcome(props: WelcomeProps) {
  return (
    <div>
      <Container className="max-width-md pt-3">
        <Row className="align-items-center">
          <Col md={8} className="my-3">
            <h1>
              <span className="hero-text text-shadow-sm">Chit Chatter</span>
            </h1>
            <div className="display-6">A different kind of social.</div>
          </Col>
          <Col md className="my-3">
            <div style={{ height: "12em" }} className="position-relative">
              <div
                style={{ height: "12em", width: "12em" }}
                className="hero-logo-bg position-absolute top-50 start-50 translate-middle"
              ></div>
              <img
                src={LOGO_SOLID}
                alt="logo"
                style={{
                  height: "8em",
                  filter: "invert(1) blur(1.5em)",
                }}
                className="position-absolute top-50 start-50 translate-middle"
              />
              <img
                src={LOGO_SOLID}
                alt="logo"
                style={{
                  height: "8em",
                  filter: "blur(0.3em)",
                  opacity: 0.15,
                }}
                className="position-absolute top-50 start-50 translate-middle"
              />
              <img
                src={LOGO}
                alt="logo"
                style={{ height: "8em" }}
                className="position-absolute top-50 start-50 translate-middle"
              />
            </div>
          </Col>
        </Row>
        <div className="my-4" />
        <div className="m-3">
          <p className="fs-5">
            Welcome to Chit Chatter
            {props.didNameSuffix ? (
              <>
                {" "}
                <FormatIdNameSuffix idNameSuffix={props.didNameSuffix} />
              </>
            ) : null}
            .{" "}
            {props.loggedIn ? (
              <>
                You're already logged in and ready to go, it's really that easy!
              </>
            ) : (
              <>
                Select or create an account to get started. All you need is a
                name and a password.
              </>
            )}
          </p>
          <p>
            There's a lot going on behind the scenes to deliver a social
            experience which empowers you, the user. Find more information on
            this page, or jump right into the social feed.
          </p>
        </div>
        <div className="my-4" />
      </Container>

      <Container>
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
                  &nbsp; No de-platforming
                </span>
              </Card.Header>
              <Card.Body className="text-secondary">
                <Card.Text>
                  You have the ability to prove who you are and interact with
                  others. No need for an organization to issue an account which
                  they can take back for arbitrary reasons.
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
                  Content and accounts can move freely between apps. If you
                  don't like the direction an app is taking, you can move to
                  another.
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
                  &nbsp; No unknown spam
                </span>
              </Card.Header>
              <Card.Body className="text-secondary">
                <Card.Text>
                  You hear only from people you follow, and the people they
                  follow, and so on. A would-be spammer needs to enter your
                  social circle in order to send you spam.
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
