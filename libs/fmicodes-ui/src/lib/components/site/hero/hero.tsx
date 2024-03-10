import Image from 'next/image';

export function Hero() {
  return (
    <div className="relative scale-[115%] h-[80vh]">
      <Image
        src="/assets/images/banner.png"
        alt="FMI{Codes} Banner"
        className="absolute inset-0 h-[80vh] w-auto mx-auto object-cover"
        width={1920 * 2}
        height={1080 * 2}
      />
      <div className="absolute inset-0 w-full h-full flex justify-center flex-col items-center">
        <Image
          src="/assets/images/heading.png"
          alt="FMI{Codes} 2024"
          className="w-[69vw]"
          width={3492}
          height={579}
        />
      </div>
    </div>
  );
}
