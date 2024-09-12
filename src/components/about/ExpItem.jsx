import { useEffect, useState } from "react";

export default function ExpItem({ item, lineLength }) {
  const [years, setYears] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const toYears = (startDate, endDate = new Date()) => {
    if (endDate === null) {
      endDate = new Date();
    }

    let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
    if (endDate.getMonth() < startDate.getMonth()) {
      years -= 1;
    }

    const msInYear = new Date(endDate.getUTCFullYear(), 0, 1) -
      new Date(endDate.getUTCFullYear() - 1, 0, 1);
    const millisecondsPassed = endDate -
      new Date(
        endDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
      );
    let decimals = millisecondsPassed / msInYear;
    if (decimals < 0) {
      decimals += 1;
    } else if (decimals < 0.01) {
      decimals = 0;
    }
    if (decimals > 0.99) {
      decimals = 0;
      years += 1;
    }

    return { years, decimals };
  };

  useEffect(() => {
    const updateTime = () => {
      const { years, decimals } = toYears(item.start_date, item.end_date);
      setYears(years);
      setDecimals(decimals);
    };

    const interval = setInterval(updateTime, 100);

    return () => clearInterval(interval);
  }, [item.start_date, item.end_date]);

  return (
    <div className="experience-item" key={`${item.title}-${item.company}`}>
      {years}
      <span className="decimals-of-years">{decimals.toFixed(9).slice(1)}</span>
    </div>
  );
}
