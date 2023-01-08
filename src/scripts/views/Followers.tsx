import type { UseState, SetState } from "../commonutils";
import { FormatIdName, FormatIdNameProps } from "./common/FormatIdName";
import { PageIter } from "chatternet-client-http";
import { useEffect, useState } from "react";
import { Alert, Container, ListGroup } from "react-bootstrap";

export type FollowersProps = {
  pageSize: number;
  buildPageIter: (() => PageIter<string>) | undefined;
  formatIdNameProps: Omit<FormatIdNameProps, "id">;
};

export function Followers(props: FollowersProps) {
  const [followers, setFollowers]: UseState<string[] | undefined> = useState();
  const [pageIter, setPageIter]: UseState<PageIter<string> | undefined> =
    useState();

  useEffect(() => {
    if (!props.buildPageIter) return;
    setPageIter(props.buildPageIter());
  }, [props.buildPageIter]);

  useEffect(() => {
    if (!pageIter) return;
    (async () => {
      const items: string[] = [];
      for await (const item of pageIter.pageItems()) {
        items.push(item);
      }
      return items;
    })()
      .then(setFollowers)
      .catch((x) => console.error(x));
    const page: string[] = [];
  }, [pageIter]);

  return (
    <Container className="my-3 max-width-md mx-auto">
      {props.buildPageIter ? (
        <ListGroup className="my-3">
          {(followers != null ? followers : []).map((x) => (
            <ListGroup.Item key={x}>
              <FormatIdName id={x} {...props.formatIdNameProps} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert>Cannot view followers list without logging in.</Alert>
      )}
    </Container>
  );
}
