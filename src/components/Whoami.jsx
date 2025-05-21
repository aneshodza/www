import localFont from "next/font/local";
import Image from "next/image";
import technologies from "@/util/data/technologies";
import { useRouter } from 'next/navigation';

const jbMono = localFont({ src: "../fonts/JetBrainsMono-Regular.ttf" });
const image_size = 200;

export default function Whoami() {
  const router = useRouter();

  return (
    <div id="whoami" className={jbMono.className}>
      <div id="whoami-intro">
        <div id="whoami-start">
          <h2
            className="chapter-title"
            id="whoami-header"
          >
            ~/web $&gt; whoami
            <br />
            anes-hodza
          </h2>
          <p id="whoami-text">
            &gt; Bsc. Computer Science
            <br />
            &gt; Full Stack RoR Developer
            <br />
            &gt; Open Source Contributor
          </p>
        </div>
        <Image
          src="/assets/me.jpg"
          width={image_size}
          height={image_size}
          alt="image of me"
        />
      </div>
      <div id="whoami-technologies">
        <h2 className="chapter-title" id="whoami-tech">
          .technologies
        </h2>
        <div id="whoami-technologies-list">
          {technologies.map((technology) => (
            <i
              key={technology}
              className={`devicon-${technology}-plain`}
              onMouseEnter={(e) => e.target.classList.add("colored")}
              onMouseLeave={(e) => e.target.classList.remove("colored")}
              onClick={() => router.push(`/projects?technology=${technology}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
