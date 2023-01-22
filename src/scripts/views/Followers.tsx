import type { UseState, SetState } from "../commonutils";
import { AlertNotLoggedIn } from "./common/CustomAlerts";
import {
  FormatActorName,
  FormatActorNameProps,
} from "./common/FormatActorName";
import { Scaffold, ScaffoldProps } from "./common/Scaffold";
import { PageIter } from "chatternet-client-http";
import { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

export type FollowersProps = {
  pageSize: number;
  buildPageIter: (() => PageIter<string>) | undefined;
  FormatActorNameProps: Omit<FormatActorNameProps, "id">;
  scaffoldProps: Omit<ScaffoldProps, "children">;
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
    <Scaffold {...props.scaffoldProps}>
      <Container className="my-3 max-width-md mx-auto">
        <span className="lead">Accounts following you</span>
        {props.buildPageIter ? (
          <ListGroup className="my-3">
            {(followers != null ? followers : []).map((x) => (
              <ListGroup.Item key={x}>
                <FormatActorName id={x} {...props.FormatActorNameProps} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <AlertNotLoggedIn />
        )}
      </Container>
    </Scaffold>
  );
}
