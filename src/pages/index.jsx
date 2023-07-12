import About from "@/components/About";
import React from "react";
import Landing from "@/components/Landing";

export default function App() {
  const app = React.useRef(null);
  const [nameDone, setNameDone] = React.useState(false);
  return (
    <div ref={app} className="app contracted">
      <div id="top-of-page"></div>
      <Landing appRef={app} setNameDone={setNameDone} />
      {/* { nameDone && <About /> } */}
    </div>
  );
}
