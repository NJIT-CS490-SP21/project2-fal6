import React from "react";
export function Box(props) {
  const val = props.val;
  const index = props.index;
  const func = props.func;
  return (
    <div onClick={() => func(index)} className="box">
      {val}
    </div>
  );
}
