import { useEffect, useRef, useState } from "react";
import CssBox from "./CssBox";
import DownArrows from "./DownArrows";
import localFont from 'next/font/local'

const fullNameStates = [
  "a",
  "an",
  "ane",
  "anes",
  "anes-",
  "anes-h",
  "anes-ho",
  "anes-hoz",
  "anes-hozd",
  "anes-hozd",
  "anes-hozd",
  "anes-hoz",
  "anes-ho",
  "anes-hod",
  "anes-hodz",
  "anes-hodza",
]
let minDelay = 120;

const jbMono = localFont({ src: '../fonts/JetBrainsMono-Regular.ttf' })

export default function Landing(props) {
  const [name, setName] = useState("");
  const [downArrows, setDownArrows] = useState(null);
  const [css, setCss] = useState(`.first-section {\n  width: 100%;\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}`);

  const caret = useRef(null);
  const firstSection = useRef(null);
  const titleWrapper = useRef(null);
  const mainTitle = useRef(null);

  const appendName = (idx) => {
    if (fullNameStates.length === idx) {
      afterName();
      props.setNameDone(true);
      sessionStorage.setItem("animated", true);
      return;
    } else {
      setName(fullNameStates[idx]);
      setTimeout(() => {
        appendName(idx + 1);
      }, (minDelay + Math.random() * 100));
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
      firstSection.current.classList.add("fade-in");
      props.appRef.current.classList.add("expand");
      props.appRef.current.classList.remove("contracted");
      setDownArrows(
        <DownArrows
          href={"#about"}
          givenClass={"jump-in float landing-arrows"}
        />,
      );

      setTimeout(() => {
        mainTitle.current.classList.remove("not-done");
      }, 100)
    }, 600);
  };

  useEffect(() => {
    const animated = sessionStorage.getItem("animated") == "true" ? true : false;

    console.log("animated", animated);
    if (animated) {
      setName(fullNameStates[fullNameStates.length - 1]);
      props.setNameDone(true);
      titleWrapper.current.classList.add("stay");
      caret.current.classList.add("blinking");
      firstSection.current.classList.add("fade-in");
      props.appRef.current.classList.add("expand");
      props.appRef.current.classList.remove("contracted");
      setDownArrows(
        <DownArrows
          href={"#about"}
          givenClass={"jump-in float landing-arrows"}
        />,
      );
    }
    setTimeout(() => {
      appendName(0);
    }, minDelay * 1.5);
  }, []);

  return (
    <div className="first-section" ref={firstSection}>
      <div className={`center ${jbMono.className}`} ref={titleWrapper}>
        <h1 className={`main-title not-done`} ref={mainTitle}>
          {name}
          <span ref={caret}>_</span>
        </h1>
        <div className="main-body">
          <h2>Just another programmer</h2>
          <CssBox css={css} setCss={setCss} />
          <style>{css}</style>
        </div>
      </div>
      {downArrows}
    </div>
  );
}
