import { useEffect, useState } from "react";

export default function ExpItem({ item }) {
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
    const { years, decimals: initialDecimals } = toYears(item.start_date, item.end_date);
    setYears(years);
    setDecimals(initialDecimals);
    const updateTime = () => {
    setDecimals((prevDecimals) => {
        const newDecimals = prevDecimals + 0.000000001633055;
        if (newDecimals >= 1) {
          setYears((prevYears) => prevYears + 1);
          return newDecimals % 1;
        }
        return newDecimals;
      });
    };

    if (item.end_date !== null) return;
    const interval = setInterval(updateTime, 50);

    return () => clearInterval(interval);
  }, [item.start_date, item.end_date]);

  return (
    <div className="experience-item" key={`${item.title}-${item.company}`}>
      {years}
      <span className="decimals-of-years">{decimals.toFixed(9).slice(1)}</span>
    </div>
  );
}
