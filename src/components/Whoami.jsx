import localFont from "next/font/local";
import Image from "next/image";
import technologies from "@/util/data/technologies";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Link from "next/link";

const jbMono = localFont({ src: "../fonts/JetBrainsMono-Regular.ttf" });
const image_size = 200;
const birthday = new Date("2004-01-14");

export default function Whoami() {
  const router = useRouter();
  const [age, setAge] = useState(0);

  const incrementAge = () => {
    const now = new Date();
    const newDateDiff = now - birthday;
    const newAge = newDateDiff / (1000 * 60 * 60 * 24 * 365.25);
    setAge(newAge.toFixed(10));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      incrementAge();
    }, 50);
    return () => clearInterval(interval);
  })

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
            &gt; Teaching Assistant
            <br />
            &gt; Full Stack RoR Developer
            <br />
            &gt; <Link href="https://dev.to/aneshodza" target="_blank">Blog Writer</Link>
            <br />
            &gt; <span id="whoami-age">{age}</span> years old
          </p>
        </div>
        <Image
          src="/assets/me.jpg"
          width={image_size}
          height={image_size}
          alt="image of me"
        />
      </div>
      <div id="whoami-socials">
        <h2 className="chapter-title" id="whoami-dotfiles-title">
          .socials
        </h2>
        <p>
          Find me on following platforms:
        </p>
        <div id="whoami-socials-list">
          <i
            className="devicon-linkedin-plain"
            onClick={() => window.open("https://www.linkedin.com/in/aneshodza/", "_blank")}
          />
          <i
            className="devicon-github-plain"
            onClick={() => window.open("https://github.com/aneshodza", "_blank")}
          />
        </div>
      </div>
      <div id="whoami-dotfiles">
        <h2 className="chapter-title" id="whoami-dotfiles-title">
          .dotfiles
        </h2>
        <p>
          My .dotfiles are open-sourced on
          <Link href="https://github.com/aneshodza/" target="_blank"> GitHub</Link>
          <br />
          Check them out!
        </p>
        <div id="whoami-dotfiles-list">
          <i
            className="devicon-vim-plain"
            onClick={() => window.open("https://github.com/aneshodza/nvim", "_blank")}
          />
          <i
            className="devicon-bash-plain"
            onClick={() => window.open("https://github.com/aneshodza/.dotfiles", "_blank")}
          />
        </div>
      </div>
      <div id="whoami-technologies">
        <h2 className="chapter-title" id="whoami-technologies-title">
          .technologies
        </h2>
        <p>
          Click on the icons to see my projects built with these technologies!
        </p>
        <div id="whoami-technologies-list">
          {technologies.map((technology) => (
            <i
              key={technology}
              title={technology}
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
