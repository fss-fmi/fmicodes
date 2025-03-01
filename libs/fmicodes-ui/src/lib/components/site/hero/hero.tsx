import Image from 'next/image';

export function Hero() {
  const bannerWidth = 4608; // Example width in pixels
  const bannerHeight = 2975; // Example height in pixels
  const aspectRatio = (bannerHeight / bannerWidth) * 100;

  return (
    <div className="relative w-full z-10">
      <div
        className="relative w-full h-0"
        style={{ paddingBottom: `${aspectRatio}%` }}
      >
        <Image
          src="/assets/images/banner.png"
          alt="FMI{Codes} event banner with decorative background"
          className="absolute top-0 left-0 w-full h-full object-cover"
          fill
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-[80%]">
            <Image
              src="/assets/images/heading.svg"
              alt="FMI{Codes} 2025 Main Heading"
              className="w-full"
              width={1746}
              height={290}
              priority
              quality={90}
              sizes="(max-width: 768px) 90vw, 80vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
