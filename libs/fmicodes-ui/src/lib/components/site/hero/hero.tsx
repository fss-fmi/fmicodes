import Image from 'next/image';

export function Hero() {
  const bannerWidth = 611;
  const bannerHeight = 210;
  const aspectRatio = (bannerHeight / bannerWidth) * 100;

  return (
    <div className="mx-auto w-full px-4 md:px-6 lg:px-32 mb-8 pointer-events-none">
      <div className="relative w-full z-10">
        <div
          className="relative w-full h-0"
          style={{ paddingBottom: `${aspectRatio}%` }}
        >
          <Image
            src="/assets/images/banner.svg"
            alt="FMI{Codes} event banner with decorative background"
            className="absolute top-0 left-0 right-0 w-full h-full object-cover"
            fill
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center mt-6 md:mt-16">
            <div className="relative w-full max-w-[90%]">
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
    </div>
  );
}
