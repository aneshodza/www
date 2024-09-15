export default function Timeunit(props) {
  return (
    <div className="timeunit" id={`year-${props.year}`} key={props.year}>
      <span className={`year ${props.classes}`}>{String(props.year).slice(2, 4)}</span>
      <span className={`line ${props.classes}`} style={{ height: props.lineLength }}></span>
      {props.children}
    </div>
  );
}
