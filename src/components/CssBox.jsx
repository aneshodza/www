import React from "react";
import Image from 'next/image';
let icon_size = 16;

export default function CssBox(props) {
  const cssRef = React.useRef(null);

  const adjustHeight = (defaultPixels) => {
    if (cssRef.current) {
      cssRef.current.style.height = "auto";
      if (defaultPixels === undefined) {
        cssRef.current.style.height = `${cssRef.current.scrollHeight}px`;
      } else {
        cssRef.current.style.height = `${defaultPixels}px`;
      }
    }
  };

  const handleCssChange = (e) => {
    props.setCss(e.target.value);
    adjustHeight();
  };

  React.useEffect(() => {
    adjustHeight(80);
  }, []);

  return (
    <div className="css-box-wrapper">
      <div className="css-box">
        <div className="editor-header">
          <div className="tab-wrapper">
            <div className="tab">
              <Image
                src="assets/css.svg"
                width={icon_size}
                height={icon_size}
              />
              <span class="tab-text">user-editable.css</span><span className="close-icon">×</span>
            </div>
          </div>
        </div>
        <div className="editor-window">
          .first-section {"{"}
          <br />
          <textarea
            value={props.css}
            onChange={(e) => handleCssChange(e)}
            ref={cssRef}
            autoFocus
          />
          {"}"} <br />
          <span className="comment">
            {"/*"}
            <br />
            &ensp; Try editing the CSS code!
            <br />
            &ensp; For example: Add `background: orange`
            <br />
            {"*/"}
          </span>
        </div>
      </div>
    </div>
  );
}
