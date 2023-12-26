import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Sortable(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div className="list-row" ref={setNodeRef} style={style}>
      <span>{props.id}</span>
      <button {...attributes} {...listeners}>
        ⣿
      </button>
    </div>
  );
}
