import ExpItem from "./ExpItem";

export default function Education(props) {
  return (
    <div id="education">
      <h3>Academic Milestones</h3>
      <div className="experience-line">
        {props.items.sort((item1, item2) => item1.start_date - item2.start_date).map((item) => (
          <ExpItem item={item} lineLength={props.lineLength} key={`${item.school}-${item.title}`} />
        ))}
      </div>
    </div>
  );
}
