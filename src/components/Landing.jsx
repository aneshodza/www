import { useEffect, useRef, useState } from "react";
import DownArrows from "./DownArrows";

let fullName = "anes-hodza";
let minDelay = 120;

export default function Landing(props) {
  const [name, setName] = useState("");
  const [downArrows, setDownArrows] = useState(null);
  const caret = useRef(null);
  const mainBody = useRef(null);
  const titleWrapper = useRef(null);

  const appendName = (idx) => {
    if (fullName.length === idx - 1) {
      afterName();
      props.setNameDone(true);
      return;
    } else {
      setName(fullName.slice(0, idx));
    }

    if (fullName[idx] === "d") {
      setTimeout(() => {
        setName(fullName.slice(0, idx) + "z");
        setTimeout(() => {
          setName(fullName.slice(0, idx) + "zd");
          setTimeout(() => {
            setName(fullName.slice(0, idx) + "z");
            setTimeout(() => {
              setName(fullName.slice(0, idx));
              setTimeout(() => {
                appendName(idx + 1);
              }, minDelay + Math.random() * 100);
            }, minDelay + Math.random() * 100);
          }, minDelay + 200 + Math.random() * 100);
        }, minDelay + Math.random() * 100);
      }, minDelay + Math.random() * 100);
    } else {
      setTimeout(() => {
        appendName(idx + 1);
      }, minDelay + Math.random() * 100);
    }
  };

  const afterName = () => {
    titleWrapper.current.style.setProperty(
      "--from-top",
      titleWrapper.current.offsetTop * -1 + "px",
    );
    titleWrapper.current.style.setProperty(
      "--from-left",
      titleWrapper.current.offsetLeft * -1 + "px",
    );
    titleWrapper.current.classList.add("move-top-left");
    setTimeout(() => {
      titleWrapper.current.classList.add("stay");
      caret.current.classList.add("blinking");
      mainBody.current.classList.add("fade-in");
      props.appRef.current.classList.add("expand");
      props.appRef.current.classList.remove("contracted");
      setDownArrows(
        <DownArrows
          href={"#about"}
          givenClass={"jump-in float landing-arrows"}
        />,
      );
    }, 600);
  };

  useEffect(() => {
    setTimeout(() => {
      appendName(0);
    }, minDelay * 1.5);
  }, []);

  return (
    <div className="first-section" ref={mainBody}>
      <div className="center" ref={titleWrapper}>
        <h1 className="main-title">
          {name}
          <span ref={caret}>_</span>
        </h1>
        <div className="main-body">
          <h2>Just another Software Engineer</h2>
          <div className="about">
          </div>
        </div>
      </div>
      {downArrows}
    </div>
  );
}
