import { default as IMG_AI } from "../../assets/undraw_artificial_intelligence_re_enpp.svg";
import { default as IMG_LETTER } from "../../assets/undraw_confidential_letter_w6ux.svg";
import { default as IMG_CONVERSATION } from "../../assets/undraw_conversation_re_c26v.svg";
import { default as IMG_FILTER } from "../../assets/undraw_filter_re_sa16.svg";
import { default as IMG_FISH } from "../../assets/undraw_fish_bowl_uu88.svg";
import { default as IMG_FOLDER } from "../../assets/undraw_image__folder_re_hgp7.svg";
import { default as IMG_CAT } from "../../assets/undraw_playful_cat_re_ac9g.svg";
import { default as IMG_SEARCH } from "../../assets/undraw_searching_re_3ra9.svg";
import { default as IMG_TRAVEL } from "../../assets/undraw_travel_mode_re_2lxo.svg";
import { default as IMG_VAULT } from "../../assets/undraw_vault_re_s4my.svg";
import { LOGO_HERO, onClickNavigate } from "../commonutils";
import {
  CreateSelectAccount,
  CreateSelectAccountProps,
} from "./common/CreateSelectAccount";
import { CustomAlert } from "./common/CustomAlerts";
import {
  FormatActorName,
  FormatActorNameProps,
} from "./common/FormatActorName";
import { MessagesList, MessagesListProps } from "./common/MessagesList";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  Collapse,
} from "react-bootstrap";
import { Link } from "react-router-dom";

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
  FormatActorNameProps: Omit<FormatActorNameProps, "id">;
  messagesListProps: Omit<MessagesListProps, "pageSize" | "allowMore">;
  createSelectAccountProps: CreateSelectAccountProps;
  scaffoldProps: Omit<ScaffoldProps, "children">;
};

export function Welcome(props: WelcomeProps) {
  return (
    <Scaffold {...props.scaffoldProps} backsplash>
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
          <CustomAlert variant="info">
            Welcome
            {props.localActorId ? (
              <>
                {" "}
                <FormatActorName
                  id={props.localActorId}
                  {...props.FormatActorNameProps}
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
          </CustomAlert>
        </Container>
      ) : null}

      <Container className="my-3 max-width-md mx-auto">
        {props.loggedIn ? (
          <>
            <MessagesList
              pageSize={4}
              allowMore={false}
              {...props.messagesListProps}
            />
            <div className="text-center">
              <Link to="/feed">View full feed</Link>
            </div>
          </>
        ) : (
          <CreateSelectAccount {...props.createSelectAccountProps} />
        )}
      </Container>

      <Container className="max-width-md mx-auto my-3">
        <CustomAlert variant="danger">
          Conversely is currently in the prototype phase. Expect missing
          features and rough edges. You can help the project by{" "}
          <a
            href="https://github.com/chatternet/conversely/issues"
            target="_blank"
          >
            submitting issues
          </a>
          .
        </CustomAlert>
      </Container>

      <Container className="max-width-lg mx-auto">
        <Row className="align-items-center my-5 mx-3">
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Choice</h2>
            <p className="text-secondary">
              You make meaningful choices about what content you see, and how
              you interact with it.
            </p>
            <ListGroup>
              <ListItemExpand
                heading={
                  <span className="text-primary">
                    Only content you care about
                  </span>
                }
                content={
                  <div className="mt-2">
                    In Conversely, you have complete control over what content
                    you see. There is no hidden algorithm working at a cross
                    purpose.
                  </div>
                }
              />
              <ListItemExpand
                heading={
                  <span className="text-primary">
                    Find interesting new content
                  </span>
                }
                content={
                  <div className="mt-2">
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

        <Row className="align-items-center my-5 mx-3">
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
                heading={
                  <span className="text-primary">
                    Differentiate spam from content
                  </span>
                }
                content={
                  <div className="mt-2">
                    In Conversely, content gets to you through gossip. If you
                    are seeing something, someone you know has also seen it. And
                    you can find out who it went through to get to you.
                  </div>
                }
              />
              <ListItemExpand
                heading={
                  <span className="text-primary">
                    Take charge of your public profile
                  </span>
                }
                content={
                  <div className="mt-2">
                    In Conversely, you can see and control exactly what public
                    information is known about you. You choose how to present
                    yourself.
                  </div>
                }
              />
            </ListGroup>
          </Col>
        </Row>

        <Row className="align-items-center my-5 mx-3">
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Social Discovery</h2>
            <p className="text-secondary">
              Discover credible people and interesting content on your terms.
            </p>
            <ListGroup>
              <ListItemExpand
                heading={
                  <span className="text-primary">
                    Less shills, more people worth talking to
                  </span>
                }
                content={
                  <div className="mt-2">
                    Conversely's gossip mechanism means that you only hear from
                    people who are connected to your social circle. Make
                    meaningful connections, and let them introduce you to
                    credible contacts.
                  </div>
                }
              />
              <ListItemExpand
                heading={
                  <span className="text-primary">Connect on your terms</span>
                }
                content={
                  <div className="mt-2">
                    In Conversely, you see who is following you, and you see
                    messages from people followed by your contacts. It is then
                    entirely up to you to decide who to connect with.
                  </div>
                }
              />
            </ListGroup>
          </Col>
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_CONVERSATION} style={{ height: "12em" }} />
          </Col>
        </Row>

        <Row className="align-items-center my-5 mx-3">
          <Col sm className="text-center d-none d-sm-block">
            <img src={IMG_TRAVEL} style={{ height: "12em" }} />
          </Col>
          <Col sm className="border rounded shadow-sm p-3">
            <h2>Ownership</h2>
            <p className="text-secondary">
              You own your identity, you control your profile. You can freely
              move between services, taking your content with you.
            </p>
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
            . Consider, as an analogy, the following situation. Alice wants to
            share pictures of her cat with Bob using the mail system. But there
            is a trouble maker that sometimes intercepts the mail and replaces
            cat pictures with dog pictures.
          </p>

          <img
            src={IMG_CAT}
            style={{ width: "12em", float: "right" }}
            className="m-3"
          />

          <p>
            Knowing this, Alice devises a plan. She builds a picture frame with
            a lock and two keys. She keeps one key, called the private key, to
            herself. This key opens the frame and allows her to insert a picture
            in it. She gives one key, called the public key, to Bob. This key is
            able to turn the lock part way, but is not able to unlock the frame.
          </p>

          <img
            src={IMG_LETTER}
            style={{ width: "12em", float: "left" }}
            className="m-3"
          />

          <p>
            When Alice wants to send a picture to Bob, she inserts the picture
            in the frame, locks it, and sends it in the mail. When Bob receives
            the frame, he inserts his key in the lock and verifies that it can
            turn. If it does turn, he is confident that the picture is from
            Alice.
          </p>

          <p>
            This is because the trouble maker can't open the frame to change the
            picture. And while the trouble maker could swap the frame for a
            similar looking one containing a picture of a dog, Bob's key won't
            be able to turn that frame's lock.
          </p>

          <p>
            Alice can create many copies of the public key and send them to
            anyone she wants to send pictures to. Anytime someone can turn a
            frame's lock with Alice's public key, they can be confident that the
            frame's picture is from Alice.
          </p>

          <p>
            In Chatter Net, your account <em>is</em> your public key. If someone
            knows your account, that means they have your public key, and they
            can verify the authenticity of your messages.
          </p>
        </div>

        <h3>Servers</h3>

        <div className="clearfix">
          <p>
            Chatter Net uses servers only to relay messages. This differs from
            web 2.0 era platforms which use servers to relay messages and to
            authenticate users.
          </p>

          <img
            src={IMG_FOLDER}
            style={{ width: "12em", float: "right" }}
            className="m-3"
          />

          <p>
            User authentication can be explained by extending the previous
            analogy: in response to the trouble maker's mischief, a new business
            named Acme Inc springs up in town. They will store a customer's
            pictures in a file with that customer's name on it, and they will
            show those pictures to anyone who comes asking to see the file.
          </p>

          <p>
            Charlie doesn't know how to build a frame like Alice does, so he
            goes to Acme Inc and creates a password that he shares with them.
            Now he can drop off pictures at Acme Inc and they will store them in
            his file if he can prove who he is by reciting his password.
          </p>

          <p>
            When Bob wants to see Charlie's pictures, he must go to Acme Inc and
            ask to see Charlie's file. If Bob trusts that the Acme Inc correctly
            verified Charlie's password, that Acme Inc didn't mix up the files,
            and that Acme Inc is not trying to trick him, then he can trust that
            he is indeed seeing Charlie's pictures.
          </p>

          <img
            src={IMG_FISH}
            style={{ width: "12em", float: "left" }}
            className="m-3"
          />

          <p>
            This is a fragile chain of trust, and it puts a lot of power in the
            hands of Acme Inc. Their owner, who holds a grudge against rabbits,
            might one day decide to throw away the files of customers who have a
            rabbit. And to help promote his pet store business, he might add a
            gold fish picture to a few files.
          </p>

          <p>
            Clearly Alice's picture frame is a much better system. No one can
            alter her pictures, no one can impersonate her, and if she has
            issues with the post office, she can instead use a shipping company
            to get her frames delivered.
          </p>

          <p>
            In this analogy, Chatter Net servers act like the mail system,
            simply helping deliver the picture frames. And same as in the
            analogy, if the Chatter Net servers don't provide an adequate
            service, the users are free to use a different server.
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
    </Scaffold>
  );
}
