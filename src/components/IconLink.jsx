import Link from "next/link";
import Image from "next/image";

const icon_size = 25;

export default function IconLink({ text, src, href, classes }) {
  return (
    <Link href={href} className={`icon-link ${classes}`}>
      <span class="tinted">
        <Image
          src={src}
          width={icon_size}
          height={icon_size}
          alt="web icon"
        />
        {text}
      </span>
    </Link>
  );
}
