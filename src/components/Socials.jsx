import Image from 'next/image';
const icon_size = 40;

export default function Socials() {
    return (
      <div className="socials">
        <a className="linkedin" href="https://www.linkedin.com/in/anes-hodza-8454aa24a/" target="_blank" rel="noreferrer">
          <Image
            src="assets/linked_in.svg"
            width={icon_size}
            height={icon_size}
            alt="linkedin icon"
            />
        </a>

        <a className="github" href="https://github.com/aneshodza" target="_blank" rel="noreferrer">
          <Image
            src="assets/github.svg"
            width={icon_size}
            height={icon_size}
            alt="github icon"
            />
        </a>

        <a className="devto" href="https://dev.to/aneshodza" target="_blank" rel="noreferrer">
        <Image
          src="assets/dev.svg"
          width={icon_size}
          height={icon_size}
          alt="devto icon"
          />
        </a>
      </div>
    );
}
