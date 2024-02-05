import React from "react";
import Image from 'next/image';
let icon_size = 16;

export default function CssBox(props) {
  const cssRef = React.useRef(null);
  const editorNumbers = React.useRef(null);
  const commentNumbers = React.useRef(null);

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
    editorNumbers.current.innerHTML = Array(lineCount(e.target.value))
      .fill('<span></span>')
      .join('')
    commentNumbers.current.style.counterSet = `linenumber ${lineCount(e.target.value)}`
    adjustHeight();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      props.setCss(props.css.substring(0, start) + "  " + props.css.substring(end));
      setTimeout(() => {
        cssRef.current.selectionStart = cssRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lineCount = (val) => {
    return val.split('\n').length
  }

  React.useEffect(() => {
    adjustHeight(122);
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
                alt="css icon"
              />
              <span className="tab-text">user-editable.css</span><span className="close-icon">×</span>
            </div>
          </div>
        </div>
        <div className="editor-window">
          <div className="editor-numbers" ref={editorNumbers}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="editor-editable">
            <textarea
              value={props.css}
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => handleCssChange(e)}
              ref={cssRef}
              autoFocus
            />
          </div>
        </div>
        <div className="static-comment">
          <div className="editor-numbers" ref={commentNumbers}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="comment">
            {"/*"}
            <br />
            *&ensp; Try editing the CSS code!
            <br />
            *&ensp; For example: Add `background: orange`
            <br />
            {"*/"}
          </span>
        </div>
      </div>
    </div>
  );
}
