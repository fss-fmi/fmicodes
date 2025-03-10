import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { cn } from '../../../utils';
import { Button } from '../../common/server';

interface LoginButtonsProps {
  className?: string;
}

export function LoginButtons({ className = '' }: LoginButtonsProps) {
  const t = useTranslations('site.login-buttons');
  const locale = useLocale();

  return (
    <div className={cn('flex gap-x-1', className)}>
      {/* <Button className="w-full xl:w-auto" variant="outline" asChild> */}
      {/*   <Link href={`/${locale}/login`}>{t('login')}</Link> */}
      {/* </Button> */}
      {/* <Button className="w-full xl:w-auto" variant="default" asChild> */}
      {/*   <Link href={`/${locale}/signup`}>{t('signup')}</Link> */}
      {/* </Button> */}

      <Button className="w-full xl:w-auto" variant="default" asChild>
        <Link
          href={`https://l.facebook.com/l.php?u=https%3A%2F%2Fforms.gle%2F18oGtXy21nn99GfG6%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR3SUNEcIZhYFEjeqrlEPBouRZA9j4DcyoE2EW0f7YR36CGVr0pf_DIMqmg_aem_QMc97iIBJodvxWlTuCdyPg&h=AT2TVCWMc3T7z7Cn64Mk4ToNQ9b4sXQkkxRuX0eENNLETCutTSFvSu1RKClxc8MxdjSO5Rr4JNyA3Me6xB7fiFPiYt4uQBPiVP4RmcF_HWONz7ChaF6npVRqP8aV&__tn__=-UK-R&c[0]=AT0_ultdVfa3-n59w-TcFrNSvRf9LRw-UltrhlAgluSXql7Zy618G0kz6iyENy12pAk2oaJdOIsVy6LwIQC4VdBORl-PBRNCd7JVpYck7EjFKd9iy-IoQwkMhfS5cIWi7h628_-odgGrq-5lUlKgeelTERcLgKWWD-XB4n2o01Kcvo4dwQ2QGA`}
          target="_blank"
        >
          {t('signup')}
        </Link>
      </Button>
    </div>
  );
}
