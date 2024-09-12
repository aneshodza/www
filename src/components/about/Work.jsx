import ExpItem from "./ExpItem";

export default function Work(props) {
  return (
    <div id="work" className="exp">
      <h3>Professional Journey</h3>
      <div className="experience-line">
        {props.items.map((item) => (
          <ExpItem item={item} lineLength={props.lineLength} />
        ))}
      </div>
    </div>
  );
}
