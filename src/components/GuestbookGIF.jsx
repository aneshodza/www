import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuestbookGIF() {
  const [showGIF, setShowGIF] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGIF(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`guestbook-wrapper ${showGIF && 'show-gif'}`}>
      <span onClick={() => setShowGIF(false)} className="close-gif">×</span>
      <Link href="/guestbook">
        <img src="assets/guestbook-icon.gif" alt="Guestbook GIF" />
      </Link>
    </div>
  );
}
