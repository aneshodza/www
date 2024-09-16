import { useRef } from "react";

import ExpLine from "./about/ExpLine";
import Timeline from "./about/Timeline";

const experience = {
  education: [
    {
      title: "BSc. in Computer Science",
      location: "ZHAW",
      start_date: new Date("2023-08-01"),
      end_date: null,
      grade: null,
    },
    {
      title: "Wirtschaftsmatur",
      location: "KBW",
      start_date: new Date("2019-08-01"),
      end_date: new Date("2023-07-31"),
      grade: 5.2,
    },
    {
      title: "Informatiker EFZ, Applikationsentwicklung",
      location: "BBW",
      start_date: new Date("2019-08-01"),
      end_date: new Date("2023-07-31"),
      grade: 5.5,
    },
  ],
  work: [
    {
      title: "Software Engineer",
      location: "Renuo AG",
      start_date: new Date("2022-08-01"),
      end_date: new Date("2023-07-31"),
    },
    {
      title: "Software Engineer",
      location: "Sitrox AG",
      start_date: new Date("2023-08-01"),
      end_date: null,
    },
    {
      title: "TA in Theoretical Computer Science",
      location: "ZHAW",
      start_date: new Date("2024-08-01"),
      end_date: null,
    },
  ],
};

const getMinYear = (items) => {
  const allStartDates = [
    ...items.education.map((item) => item.start_date),
    ...items.work.map((item) => item.start_date),
  ];
  return new Date(Math.min(...allStartDates.map((date) => date.getTime()))).getFullYear();
};

const lineLength = 75;
const minYear = getMinYear(experience);

export default function About() {
  const lineRef = useRef(null);

  return (
    <div id="about">
      <ExpLine items={experience.education} lineLength={lineLength} lineRef={lineRef} orientation={`left`} id={`education`} />
      <Timeline items={experience} lineLength={lineLength} lineRef={lineRef} minYear={minYear} />
      <ExpLine items={experience.work} lineLength={lineLength} lineRef={lineRef} orientation={`right`} id={`work`} />
    </div>
  );
}
