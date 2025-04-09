import Socials from "./Socials";
import Image from 'next/image';

export default function UnderConstruction() {
    return (
        <div className="under-construction">
            <h2>This page is currently under construction</h2>
            <div className="socials-announcement">
              <h3>In the meantime, check out my socials</h3>
              <Socials/>
            </div>
            <div className="studyweek-announcement">
              <h3>Or check out studyweek, my own app!</h3>
              <a className="studyweek" href="https://www.studyweek.ch/" target="_blank" rel="noreferrer">
                <Image
                  src="/assets/studyweek.png"
                  width={40}
                  height={40}
                  alt="studyweek icon"
                  />
              </a>
            </div>
        </div>
    );
}
