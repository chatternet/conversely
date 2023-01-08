import { LOGO_HERO, onClickNavigate } from "../commonutils";
import {
  CreateSelectAccount,
  CreateSelectAccountProps,
} from "./common/CreateSelectAccount";
import { FormatIdName, FormatIdNameProps } from "./common/FormatIdName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Card, Row, Col, Container, Alert, Button } from "react-bootstrap";

export type WelcomeProps = {
  loggedIn: boolean | undefined;
  localActorId: string | undefined;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  createSelectAccountProps: CreateSelectAccountProps;
};

export function Welcome(props: WelcomeProps) {
  return (
    <div>
      <Container className="pt-3">
        <Row className="align-items-center text-center my-4 max-width-md mx-auto">
          <Col md={6}>
            <h1>
              <span className="display-5 text-purple-to-red text-shadow-sm">
                Conversely
              </span>
            </h1>
            <div className="display-6">A different kind of social.</div>
          </Col>
          <Col md>
            <img src={LOGO_HERO} alt="logo" width={"256px"} height={"256px"} />
          </Col>
        </Row>
      </Container>

      {props.loggedIn ? (
        <Container className="max-width-md my-3">
          <Alert variant="primary">
            Welcome
            {props.localActorId ? (
              <>
                {" "}
                <FormatIdName
                  id={props.localActorId}
                  {...props.formatIdNameProps}
                />
              </>
            ) : null}
            , you're logged into a default account and ready to go, it's really
            that easy! To change your account name and create a password, go to
            the{" "}
            <a href="/settings" onClick={onClickNavigate("/settings")}>
              settings page
            </a>
            .
          </Alert>
        </Container>
      ) : null}

      <Container className="my-3">
        <div className="max-width-md mx-auto">
          {props.loggedIn ? (
            <>
              <MessagesList
                pageSize={4}
                allowMore={false}
                {...props.messagesListProps}
              />
              <div className="text-center">
                <Button onClick={onClickNavigate("/feed")}>Full feed</Button>
              </div>
            </>
          ) : (
            <CreateSelectAccount {...props.createSelectAccountProps} />
          )}
        </div>
      </Container>

      <Container className="max-width-md my-3">
        <p>
          There's a lot going on behind the scenes to deliver a social
          experience which empowers you, the user. Find more information on this
          page, or jump right into the social feed.
        </p>
      </Container>

      <Container className="max-width-xl my-5">
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
              <Card.Body>
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
              <Card.Body>
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
              <Card.Body>
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
              Conversely is currently in the prototype phase. Some features are
              missing, some are incomplete, and some are broken.
            </div>
          </div>
        </Alert>
      </Container>

      <Container className="max-width-md text-spaced"></Container>
    </div>
  );
}
