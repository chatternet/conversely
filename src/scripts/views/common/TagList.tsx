import { SetState, UseState } from "../../commonutils";
import { TopicName, TopicNameProps } from "./FormatTopicName";
import { includes } from "lodash-es";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

export interface TagListProps {
  tagsId: string[];
  setTagsId: SetState<string[]>;
  tagToId: (tag: string) => Promise<string>;
  topicNameProps: Omit<TopicNameProps, "id">;
}

export function TagList(props: TagListProps) {
  const [tag, setTag]: UseState<string> = useState("");

  function addTag(event: React.MouseEvent) {
    event.preventDefault();
    props
      .tagToId(tag)
      .then((tagId) => {
        if (!tagId) return;
        props.setTagsId((tagsId) => {
          if (includes(tagsId, tagId)) return tagsId;
          return [...tagsId, tagId];
        });
      })
      .catch((x) => console.error(x))
      .then(() => {
        setTag("");
      });
  }

  function removeTag(tagId: string) {
    props.setTagsId((tagsId) => tagsId.filter((x) => x !== tagId));
  }

  return (
    <>
      {props.tagsId.map((tagId) => (
        <span key={tagId} className="ms-2 text-nowrap">
          <span className="badge rounded-pill text-bg-secondary m-1 fw-normal">
            <TopicName id={tagId} {...props.topicNameProps} noLink />
          </span>
          <Button
            variant="link"
            className="p-0"
            onClick={(x) => {
              x.preventDefault();
              removeTag(tagId);
            }}
          >
            <i className="bi bi-x-circle"></i>
          </Button>
        </span>
      ))}
      <span className="ms-2 text-nowrap">
        <Form.Control
          as="input"
          type="text"
          value={tag}
          placeholder={"topic"}
          spellCheck="false"
          onChange={(e) => {
            setTag(e.target.value);
          }}
          className="d-inline p-1 m-1"
          style={{ width: "12em", fontSize: "inherit" }}
        />
        <Button variant="link" className="p-0" onClick={addTag}>
          <i className="bi bi-plus-circle"></i>
        </Button>
      </span>
    </>
  );
}
