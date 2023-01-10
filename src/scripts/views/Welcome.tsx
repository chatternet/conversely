import { default as IMG_AI } from "../../assets/undraw_artificial_intelligence_re_enpp.svg";
import { default as IMG_LETTER } from "../../assets/undraw_confidential_letter_w6ux.svg";
import { default as IMG_CONVERSATION } from "../../assets/undraw_conversation_re_c26v.svg";
import { default as IMG_FILTER } from "../../assets/undraw_filter_re_sa16.svg";
import { default as IMG_FINGERPRINT } from "../../assets/undraw_fingerprint_re_uf3f.svg";
import { default as IMG_SEARCH } from "../../assets/undraw_searching_re_3ra9.svg";
import { default as IMG_TRAVEL } from "../../assets/undraw_travel_mode_re_2lxo.svg";
import { default as IMG_VAULT } from "../../assets/undraw_vault_re_s4my.svg";
import { LOGO_HERO, onClickNavigate } from "../commonutils";
import {
  CreateSelectAccount,
  CreateSelectAccountProps,
} from "./common/CreateSelectAccount";
import { FormatIdName, FormatIdNameProps } from "./common/FormatIdName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Alert,
  Button,
  ListGroup,
  ListGroupItem,
  Collapse,
} from "react-bootstrap";

interface ListItemExpandProps {
  heading: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

function ListItemExpand(props: ListItemExpandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand: React.MouseEventHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsExpanded((x) => !x);
  };

  return (
    <ListGroupItem action onClick={toggleExpand} className={props.className}>
      {props.heading}
      <Collapse in={isExpanded}>
        <div>{props.content}</div>
      </Collapse>
    </ListGroupItem>
  );
}

export type WelcomeProps = {
  loggedIn: boolean | undefined;
  localActorId: string | undefined;
  newDefaultAccount: boolean;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  createSelectAccountProps: CreateSelectAccountProps;
};

export function Welcome(props: WelcomeProps) {
  return (
    <div>
      <Container className="my-4 max-width-md mx-auto">
        <Row className="align-items-center">
          <Col md className="text-center">
            <h1>
              <span className="display-4 text-purple-to-red text-shadow-sm">
                Conversely
              </span>
            </h1>
            <h3 className="fw-light">A different kind of social.</h3>
          </Col>
          <Col md className="text-center">
            <img src={LOGO_HERO} alt="logo" width={"256px"} height={"256px"} />
          </Col>
        </Row>
      </Container>

      {props.newDefaultAccount ? (
        <Container className="max-width-md my-3">
          <Alert variant="info">
            <div className="d-flex align-items-center">
              <div className="me-2">
                <i className="bi bi-info-circle-fill fs-4"></i>
              </div>
              <div className="ms-2">
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
                , you're logged into a default account and ready to go, it's
                really that easy! To change your account name and create a
                password, go to the{" "}
                <a href="/settings" onClick={onClickNavigate("/settings")}>
                  settings page
                </a>
                .
              </div>
            </div>
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
        <Alert variant="danger">
          <div className="d-flex align-items-center">
            <div className="me-2">
              <i className="bi bi-exclamation-triangle-fill fs-4"></i>
            </div>
            <div className="ms-2">
              Conversely is currently in the prototype phase. Expect missing
              features and rough edges. You can help the project by{" "}
              <a
                href="https://github.com/chatternet/conversely/issues"
                target="_blank"
              >
                submitting issues
              </a>
              .
            </div>
          </div>
        </Alert>
      </Container>

      <Container className="max-width-lg mx-auto">
        <Row className="align-items-center my-5">
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Choice</h2>
            <p className="text-secondary">
              You make meaningful choices about what content you see, and how
              you interact with it.
            </p>
            <ListGroup>
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Seeing content you don't care about?
                  </span>
                }
                content={
                  <div className="m-3">
                    In Conversely, you have complete control over what content
                    you see. There is no hidden algorithm working at a cross
                    purpose.
                  </div>
                }
              />
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Can't find interesting new content?
                  </span>
                }
                content={
                  <div className="m-3">
                    In Conversely, you are not spoon fed the most engaging
                    content. You are free to explore, or stick to what you know
                    works for you.
                  </div>
                }
              />
            </ListGroup>
          </Col>
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_FILTER} style={{ height: "12em" }} />
          </Col>
        </Row>

        <Row className="align-items-center my-5">
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_SEARCH} style={{ height: "12em" }} />
          </Col>
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Transparency</h2>
            <p className="text-secondary">
              You know where content comes from, why you are seeing it, and what
              others are seeing about you.
            </p>
            <ListGroup>
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Hard to tell spam and content apart?
                  </span>
                }
                content={
                  <div className="m-3">
                    In Conversely, content gets to you through gossip. If you
                    are seeing something, someone you know has also seen it. And
                    you can find out who it went through to get to you.
                  </div>
                }
              />
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Ads getting a bit too personal?
                  </span>
                }
                content={
                  <div className="m-3">
                    In Conversely, you can see and control exactly what public
                    information is known about you. You choose how to present
                    yourself.
                  </div>
                }
              />
            </ListGroup>
          </Col>
        </Row>

        <Row className="align-items-center my-5">
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Social Discovery</h2>
            <p className="text-secondary">
              Discover credible people and interesting content on your terms.
            </p>
            <ListGroup>
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Contacts are either relatives or shameless shills?
                  </span>
                }
                content={
                  <div className="m-3">
                    Conversely's gossip mechanism means that you only hear from
                    people who are connected to your social circle. Make
                    meaningful connections, and let them introduce you to
                    credible contacts.
                  </div>
                }
              />
            </ListGroup>
          </Col>
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_CONVERSATION} style={{ height: "12em" }} />
          </Col>
        </Row>

        <Row className="align-items-center my-5">
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_TRAVEL} style={{ height: "12em" }} />
          </Col>
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Ownership</h2>
            <p className="text-secondary">
              You own your identity, you control your profile. You can freely
              move between services, taking your content with you.
            </p>
            <ListGroup>
              <ListItemExpand
                className="text-bg-light"
                heading={
                  <span className="text-info">
                    Platforms change, people move on ...
                  </span>
                }
                content={
                  <div className="m-3">
                    In Conversely, the social circle you build and the content
                    you curate follow you to any platform built on interoperable
                    technologies.
                  </div>
                }
              />
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Container className="max-width-md mx-auto">
        <h2>How it works</h2>

        <p>
          Conversely is built on{" "}
          <a href="https://github.com/chatternet/chatternet-client-http">
            Chatter Net
          </a>
          . It is a decentralized platform: your account is stored on your
          device, it is not controlled by a third party; and you can interact
          with content from any server, each with their own rules catering to
          various audiences.
        </p>

        <p>
          In a decentralized system, there is no authority which determines who
          is a valid user, and what is valid content. Instead, this power
          resides in the users of the network. Tailor your experience by making
          meaningful contacts and listening to reputable servers.
        </p>

        <p>
          Chatter Net is built with open protocols such as the World Wide Web
          Consortium's{" "}
          <a href="https://www.w3.org/TR/did-core/">
            Decentralized Identifiers
          </a>{" "}
          model and <a href="https://www.w3.org/TR/activitypub/">ActivityPub</a>{" "}
          protocol. This means that your identity and your content can be
          understood and used on other platforms using the same protocols.
        </p>

        <h3>Accounts</h3>

        <div className="clearfix">
          <img
            src={IMG_VAULT}
            style={{ width: "12em", float: "left" }}
            className="m-3"
          />

          <p>
            Chatter Net accounts are based on{" "}
            <a href="https://en.wikipedia.org/wiki/Public-key_cryptography">
              public-key cryptography
            </a>
            . Consider, as an analogy, a picture frame with two keys. One key
            (the private key) opens the frame allowing you to insert a message
            into it. The other key (the public key) simply spins the lock
            without opening the frame. Crucially, the public key spins only the
            lock which is opened by the corresponding private key.
          </p>

          <img
            src={IMG_LETTER}
            style={{ width: "12em", float: "right" }}
            className="m-3"
          />

          <p>
            If you intend to communicate with someone, you give them a copy of
            the public key. At some later time when you want to send a message,
            you build a new copy of the frame, insert your message in it, lock
            it, and send it in the mail.
          </p>

          <p>
            When the recipient gets the frame, they use the public key they
            previously obtained from you to verify that the lock spins. They
            then know the message comes from you because the public key spins
            only the lock that is opened by your private key.
          </p>

          <p>
            In Chatter Net, your account <em>is</em> your public key. If someone
            knows of your account, that means they have your public key, and
            they can verify the authenticity of your messages.
          </p>
        </div>

        <h3>Servers</h3>

        <div className="clearfix">
          <img
            src={IMG_FINGERPRINT}
            style={{ width: "12em", float: "left" }}
            className="m-3"
          />

          <p>
            Chatter Net uses servers only to relay messages. This differs from
            web 2.0 era platforms which use servers for to relay messages and to
            authenticate users.
          </p>

          <p>
            Consider seeing a post written by Alice on the web. How do you know
            Alice wrote that post? Alice made an account on some platform and
            created a password known only to her and the platform. She posted to
            the platform by sending her password along with some content. After
            verifying the password is correct, the platform stored her post and
            attribute her name to it.
          </p>

          <p>
            You then visit the platform and see a post with her name on it. If
            you trust that the platform correctly verified her password, that
            the platform correctly stored her post, and that the platform is not
            trying to trick you, you can then trust that Alice wrote the post.
          </p>

          <p>
            This is a fragile chain of trust, and it puts a lot of power in the
            hands of the platforms which can enact arbitrary rules, pick
            favorites, and generally manipulate content to their own benefit. If
            you don't like the direction a platform is taking, your only
            alternative is to leave and start from scratch. This doesn't make
            much sense given what you know about public-pair cryptography.
          </p>

          <p>
            In Chatter Net, you verify the authenticity of a message using a
            user's public key without having to trust any server. A server
            cannot manipulate content, but it can restrict what it stores. If
            you have a bad experience with a server you can move away from it,
            taking your identity, contacts, and content with you.
          </p>
        </div>

        <h3>Feed</h3>

        <div className="clearfix">
          <img
            src={IMG_AI}
            style={{ width: "12em", float: "left" }}
            className="m-3"
          />

          <p>
            Chatter Net uses gossip to propagate messages. A message must be
            created or viewed by someone you follow for you to receive it. By
            contrast, in other social media platforms, any user (or bot) who can
            create an account can then spread spam.
          </p>
        </div>
      </Container>
    </div>
  );
}
