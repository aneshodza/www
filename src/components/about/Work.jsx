export default function Work(props) {
  const toYears = (date) => {
    const currentDate = new Date();

    // Get the full difference in milliseconds
    const diffInMilliseconds = currentDate - date;

    // Calculate the integer number of years
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const totalYears = diffInMilliseconds / millisecondsPerYear;

    const fullYears = Math.floor(totalYears);  // Get the integer part (years)
    const decimals = totalYears - fullYears;   // Get the decimal part

    return { years: fullYears, decimals: decimals };
  }
  console.log(props);
  return (
    <div id="work" class="exp">
      <h3>Professional Journey</h3>
      {
        props.items.map(item =>
          <div class="exp-item">
            {
              item.end_date ?
                (() => {
                const { years, decimals } = toYears(item.end_date - item.start_date)
                  return <div>{years}<span class="decimals-of-years">{String(decimals).slice(1)}</span></div>
                })() :
                (() => {
                const { years, decimals } = toYears(new Date() - item.start_date)
                  return <div>{years}<span class="decimals-of-years">{decimals}</span></div>
                })()
            }
          </div>
        )
      }
    </div>
  )
}
