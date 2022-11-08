import { Container } from "react-bootstrap";

export function Details() {
  return (
    <Container>
      <div className="mw-md mx-auto">
        <div className="max-width-md mx-auto">
          <dl className="row">
            <dt className="col-sm-3">Platform-specific</dt>
            <dd className="col-sm-9">
              without the platform to view the content, it might be
              indecipherable.
            </dd>
            <dt className="col-sm-3">APIs</dt>
            <dd className="col-sm-9">
              content is locked in walled gardens, and a user account is
              required to access it.
            </dd>
            <dt className="col-sm-3">End points</dt>
            <dd className="col-sm-9">
              user content is made available on a platform's web site, and can
              be removed or re-purposed at any time by the platform.
            </dd>
            <dt className="col-sm-3">Feeds</dt>
            <dd className="col-sm-9">
              it is hard to discover content on your terms, instead content is
              delivered to you to suite the platform's needs.
            </dd>
          </dl>

          <p>
            While there was no firm concept of identity in the world wide web,
            in the web 2.0 user accounts are needed to unlock a vast amount of
            content. And those user accounts are owned by 3rd party platforms,
            giving the platforms a lot of authority over how you interact with
            the web.
          </p>
        </div>
      </div>
    </Container>
  );
}
