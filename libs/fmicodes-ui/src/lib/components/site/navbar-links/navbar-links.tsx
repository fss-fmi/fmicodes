import { useLocale, useTranslations } from 'next-intl';
import { NavbarLinksDesktop } from './components/navbar-links-desktop';
import { NavbarLinksMobile } from './components/navbar-links-mobile';

interface NavbarLinksProps {
  variant: 'desktop' | 'mobile';
  className: string;
}
export function NavbarLinks({ className, variant }: NavbarLinksProps) {
  const locale = useLocale();
  const t = useTranslations('site.navbar-links');

  const links = [
    {
      title: t('home'),
      href: `/${locale}`,
    },
    {
      title: t('teams'),
      href: `/${locale}/teams`,
    },
    {
      title: t('regulations'),
      href: `/${locale}/regulations`,
    },
  ];

  if (variant === 'desktop') {
    return <NavbarLinksDesktop className={className} links={links} />;
  }

  if (variant === 'mobile') {
    return <NavbarLinksMobile className={className} links={links} />;
  }
}
