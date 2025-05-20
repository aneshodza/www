import Image from 'next/image';
const icon_size = 40;

export default function RestartAnimationButton() {
  const handleClick = () => {
    sessionStorage.removeItem("animated");
    window.location.reload();
  }

  return (
    <div className="tinted" id="restart-animation" onClick={handleClick}>
      <Image
        src="assets/circular_arrow.svg"
        width={icon_size}
        height={icon_size}
        alt="restart animation button"
      />
      Liked the animation? Click to restart!
    </div>
  );
}
