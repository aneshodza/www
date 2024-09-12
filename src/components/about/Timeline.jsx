export default function Timeline(props) {
  const allStartDates = [
    ...props.items.education.map((item) => item.start_date),
    ...props.items.work.map((item) => item.start_date),
  ];
  const minDate = new Date(
    Math.min(...allStartDates.map((date) => date.getTime())),
  );
  const currentYear = new Date().getFullYear();
  const minYear = minDate.getFullYear();

  const yearArray = Array.from(
    { length: currentYear - minYear + 1 },
    (_, i) => minYear + i,
  );
  return (
    <div id="timeline">
      {yearArray.slice(0, -1).map((year) => (
        <div className="timeunit" key={year}>
          <span className="year">{String(year).slice(2, 4)}</span>
          <span className="line" style={{ height: props.lineLength }}></span>
        </div>
      ))}
      <div className="timeunit">
        <span className="year">{String(currentYear).slice(2, 4)}</span>
      </div>
    </div>
  );
}
