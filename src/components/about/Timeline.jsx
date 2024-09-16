import Timeunit from './Timeunit';

export default function Timeline(props) {
  const allStartDates = [
    ...props.items.education.map((item) => item.start_date),
    ...props.items.work.map((item) => item.start_date),
  ];
  const minDate = new Date(
    Math.min(...allStartDates.map((date) => date.getTime())),
  );
  const currentYear = new Date().getFullYear();
  const minYear = props.minYear;

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
        <Timeunit year={year} lineLength={props.lineLength} />
      ))}
      <Timeunit year={currentYear - 1} lineLength={props.lineLength + 30} />
      <Timeunit year={currentYear} lineLength={props.lineLength} classes={'current'}>
        <span className="empty line current next" style={{ height: props.lineLength - props.lineLength * passedYear() }}></span>
        <span className="year next">{String(currentYear + 1).slice(2, 4)}</span>
      </Timeunit>
    </div>
  );
}
