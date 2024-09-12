import ExpItem from "./ExpItem";

export default function Work(props) {
  return (
    <div id="work" className="exp">
      <h3>Professional Journey</h3>
      <div className="experience-line">
        {props.items.sort((item1, item2) => item1.start_date - item2.start_date).map((item) => (
          <ExpItem item={item} lineLength={props.lineLength} key={`${item.company}-${item.title}`} />
        ))}
      </div>
    </div>
  );
}
