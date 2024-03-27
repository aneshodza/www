import { useEffect, useState } from "react";
import Link from "next/link";

export default function GuestbookGIF() {
  const [showGIF, setShowGIF] = useState(false);
  const [hideGIF, setHideGIF] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideGIF(false);
      setTimeout(() => setShowGIF(true), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!hideGIF &&
        (
          <div className={`guestbook-wrapper ${showGIF && "show-gif"}`}>
            <span onClick={() => setHideGIF(true)} className="close-gif">
              ×
            </span>
            <Link href="/guestbook">
              <img src="assets/guestbook-icon.gif" alt="Guestbook GIF" />
            </Link>
          </div>
        )}
    </>
  );
}
