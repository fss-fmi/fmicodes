import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import {
  LoginButtons,
  TeamCard,
} from '@fmicodes/fmicodes-ui/lib/components/site/server';
import { isTeamVerified } from '@fmicodes/fmicodes-services/config/utils.config';
import { GoUnverified, GoVerified } from 'react-icons/go';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@fmicodes/fmicodes-api-client/next';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardHeader,
  Skeleton,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { FaDiscord, FaUsers, FaUserTie } from 'react-icons/fa6';
import { CreateTeamDialog } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { libConfig } from '@fmicodes/fmicodes-services/config/lib.config';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('teams-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

export default async function TeamsPage() {
  const t = await getTranslations('teams-page');
  const user = await getUser();

  async function VerifiedTeamsCards() {
    const teams = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    return teams
      .filter((team) => isTeamVerified(team))
      .map((team) => <TeamCard key={team.id} team={team} />);
  }

  async function UnverifiedTeamsCards() {
    const teams = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    return teams
      .filter((team) => !isTeamVerified(team))
      .map((team) => <TeamCard key={team.id} team={team} />);
  }

  function FallbackCards() {
    return Array(4)
      .fill(0)
      .map((_) => (
        <Card
          key={Math.random()}
          className="w-full transition hover:-translate-y-1 hover:shadow-lg "
        >
          <CardHeader className="relative p-0 w-full aspect-[21/9] space-y-0 overflow-hidden rounded-t-xl">
            <Skeleton className="w-full h-full" />
          </CardHeader>
          <div className="p-3">
            <Skeleton className="w-1/2 h-6" />
          </div>
        </Card>
      ));
  }

  async function VerifiedTeamsCounter() {
    const teams = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    const verifiedTeams = teams.filter((team) => isTeamVerified(team));

    return (
      <>
        ({verifiedTeams.length}/{libConfig.team.max})
      </>
    );
  }

  async function CreateTeamButton() {
    const teams = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    const verifiedTeams = teams.filter((team) => isTeamVerified(team));
    if (verifiedTeams.length >= libConfig.team.max) {
      return null;
    }

    return (
      <Alert className="md:flex">
        <FaUsers className="h-4 w-4" />

        <div className="w-fit">
          <AlertTitle>{t('want-to-be-a-part-of-a-team')}</AlertTitle>
          <AlertDescription>
            {t('create-a-team-or-join-an-existing-one')}
          </AlertDescription>
        </div>

        <div className="md:ml-auto mt-2 md:mt-0">
          <CreateTeamDialog>
            <Button>{t('create-a-team')}</Button>
          </CreateTeamDialog>
        </div>
      </Alert>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl sm:text-4xl md:text-6xl font-black uppercase my-4 truncate text-clip">
        {t('title')}
      </h1>

      {!user && (
        <Alert className="md:flex">
          <FaUserTie className="h-4 w-4" />

          <div className="w-fit">
            <AlertTitle>{t('want-to-be-a-part-of-a-team')}</AlertTitle>
            <AlertDescription>
              {t('create-an-account-or-login')}
            </AlertDescription>
          </div>

          <LoginButtons className="md:ml-auto mt-2 md:mt-0" />
        </Alert>
      )}

      {user && !user.teamId && (
        <Suspense>
          <CreateTeamButton />
        </Suspense>
      )}

      {user && !user.discord && (
        <Alert className="md:flex">
          <FaDiscord className="h-4 w-4" />

          <div className="w-fit">
            <AlertTitle>{t('fmicodes-has-a-discord-server')}</AlertTitle>
            <AlertDescription>
              {t('join-our-discord-server-to-communicate-with-everyone')}
            </AlertDescription>
          </div>

          <Button
            type="button"
            className="w-full md:w-auto my-auto md:ml-auto"
            asChild
          >
            <Link
              href={`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/login/discord`}
              target="_blank"
              rel="opener" // Required, so that the new tab can go back to this window
            >
              {t('link-your-discord-account')}
            </Link>
          </Button>
        </Alert>
      )}

      <div className="flex items-center">
        <GoVerified className="w-8 h-8 mr-2" />
        <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold my-4 truncate text-clip">
          {t('verified-teams')}{' '}
          <Suspense>
            <VerifiedTeamsCounter />
          </Suspense>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-evenly border-l-2 ml-4 pl-4 border-black dark:border-white">
        <Suspense fallback={<FallbackCards />}>
          <VerifiedTeamsCards />
        </Suspense>
      </div>

      <div className="flex items-center">
        <GoUnverified className="w-8 h-8 mr-2" />
        <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold my-4 truncate text-clip">
          {t('unverified-teams')}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-evenly border-l-2 ml-4 pl-4 border-black dark:border-white">
        <Suspense fallback={<FallbackCards />}>
          <UnverifiedTeamsCards />
        </Suspense>
      </div>
    </>
  );
}
