import React from "react";
import Landing from "../components/Landing";

export default function App() {
  const app = React.useRef(null);

  return (
    <div ref={app} className="app">
      <div id="top-of-page"></div>
      <Landing appRef={app} />
    </div>
  );
}
