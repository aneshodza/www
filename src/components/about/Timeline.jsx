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

  function passedYear() {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const startOfNextYear = new Date(currentDate.getFullYear() + 1, 0, 1);
    const millisecondsInYear = startOfNextYear - startOfYear;
    const millisecondsPassed = currentDate - startOfYear;
    const percentageOfYearPassed = (millisecondsPassed / millisecondsInYear);

    return percentageOfYearPassed;
  }

  return (
    <div id="timeline" ref={props.lineRef}>
      {yearArray.slice(0, -2).map((year) => (
        <div className="timeunit" key={year}>
          <span className="year">{String(year).slice(2, 4)}</span>
          <span className="line" style={{ height: props.lineLength }}></span>
        </div>
      ))}
      <div className="timeunit" key={currentYear - 1}>
        <span className="year">{String(currentYear - 1).slice(2, 4)}</span>
        <span className="line" style={{ height: props.lineLength + 30 }}></span>
      </div>
      <div className="timeunit">
        <span className="year current">{String(currentYear).slice(2, 4)}</span>
        <span className="line current" style={{ height: props.lineLength * passedYear() }}></span>
        <span className="empty line current next" style={{ height: props.lineLength - props.lineLength * passedYear() }}></span>
        <span className="year next">{String(currentYear + 1).slice(2, 4)}</span>
      </div>
    </div>
  );
}
