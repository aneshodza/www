import localFont from "next/font/local";
import Image from "next/image";

const jbMono = localFont({ src: "../fonts/JetBrainsMono-Regular.ttf" });
const image_size = 200;
const icon_size = 40;

export default function Whoami() {
  return (
    <div id="whoami">
      <div id="whoami-into">
        <div id="whoami-start">
          <h2
            className={`chapter-title ${jbMono.className}`}
            id="whoami-header"
          >
            ~/web $&gt; whoami
            <br />
            anes-hodza
          </h2>
          <p className={`${jbMono.className}`} id="whoami-text">
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
    </div>
  );
}
