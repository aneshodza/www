import { useEffect, useRef, useState } from "react";
import CssBox from "./CssBox";
import DownArrows from "./DownArrows";
import Languages from "./Languages";
import localFont from 'next/font/local'

let fullName = "anes-hodza";
let minDelay = 120;

const jbMono = localFont({ src: '../fonts/JetBrainsMono-Regular.ttf' })
// TODO: Put medium font on mobile
// const jbMonoMedium = localFont({ src: '../fonts/JetBrainsMono-Medium.ttf' })

export default function Landing(props) {
  const [name, setName] = useState("");
  const [downArrows, setDownArrows] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [css, setCss] = useState(`.first-section {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}`);

  const caret = useRef(null);
  const firstSection = useRef(null);
  const titleWrapper = useRef(null);
  const mainTitle = useRef(null);

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

      // setLanguages(<Languages />);
    }, 600);
  };

  useEffect(() => {
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
      {languages}
      {downArrows}
    </div>
  );
}
