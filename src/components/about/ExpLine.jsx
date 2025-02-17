import ExpItem from "./ExpItem";

export default function ExpLine(props) {
  const manageItems = (items) => {
    const sortedItems = items.sort((item1, item2) => item1.start_date - item2.start_date)
  }

  console.log(props.items)
  return (
    <div id={props.id}>
      <div className="experience-line">
        {props.items.sort((item1, item2) => item1.start_date - item2.start_date).map((item) => (
          <ExpItem item={item} lineLength={props.lineLength} key={`${item.location}-${item.title}`} orientation={props.orientation} />
        ))}
      </div>
    </div>
  );
}
