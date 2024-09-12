import Education from "./about/Education";
import Work from "./about/Work";
import Timeline from "./about/Timeline";

const experience = {
  education: [
    {
      title: "BSc. in Computer Science",
      school: "ZHAW",
      start_date: new Date("2023-08-01"),
      end_date: null,
      grade: null,
    },
    {
      title: "Wirtschaftsmatur",
      school: "KBW",
      start_date: new Date("2019-08-01"),
      end_date: new Date("2023-07-31"),
      grade: 5.2,
    },
    {
      title: "Informatiker EFZ, Applikationsentwicklung",
      school: "BBW",
      start_date: new Date("2019-08-01"),
      end_date: new Date("2023-07-31"),
      grade: 5.5,
    },
  ],
  work: [
    {
      title: "Software Engineer",
      company: "Renuo AG",
      start_date: new Date("2022-08-01"),
      end_date: new Date("2023-07-31"),
    },
    {
      title: "Software Engineer",
      company: "Sitrox AG",
      start_date: new Date("2023-08-01"),
      end_date: null,
    },
    {
      title: "TA in Theoretical Computer Science",
      company: "ZHAW",
      start_date: new Date("2023-08-01"),
      end_date: null,
    },
  ],
};

const lineLength = "60px";

export default function About() {
  return (
    <div id="about">
      <Education items={experience.education} lineLength={lineLength} />
      <Timeline items={experience} lineLength={lineLength} />
      <Work items={experience.work} lineLength={lineLength} />
    </div>
  );
}
