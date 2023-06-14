import React from "react";

export default function CssBox(props) {
  const cssRef = React.useRef(null);

  React.useEffect(() => {
    cssRef.current.style.height = `${props.css.split('\n').length * 19}px`;
  }, [props.css]);

  const handleCssChange = (e) => {
    props.setCss(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (
    <div className="css-box">
      .first-section {'{'}
      <br />
      <textarea
        value={props.css}
        onChange={(e) => handleCssChange(e)}
        ref={cssRef}
      />
      {'}'}
    </div>
  )
}
