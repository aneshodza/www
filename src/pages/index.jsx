import React, { useRef } from "react";
import Landing from "./components/Landing";

export default function App() {
  const app = useRef(null);
  return (
    <div ref={app} className="app">
      <div id="top-of-page"></div>
      <Landing appRef={app} />
    </div>
  );
}
