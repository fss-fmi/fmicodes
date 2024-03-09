import Image from 'next/image';
import React from 'react';
import { cn } from '../../../utils';

export function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  // eslint-disable-next-line react/prop-types
  const { className, ...otherProps } = props;
  return (
    <div
      className={cn('flex w-fit items-center gap-1.5', className)}
      {...otherProps}
    >
      <Image
        src="/assets/icons/fmicodes.svg"
        alt="FMI{Codes} Logo"
        width={32}
        height={32}
      />
      <span className="text-xl font-bold text-[#f7f281]">{'FMI{Codes}'}</span>
    </div>
  );
}
export default Logo;
