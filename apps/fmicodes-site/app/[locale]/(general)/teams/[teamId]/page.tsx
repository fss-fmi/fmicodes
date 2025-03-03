import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { TeamBanner } from '@fmicodes/fmicodes-ui/lib/components/site/team-banner/team-banner';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import {
  FaArrowLeft,
  FaGithub,
  FaGlobe,
  FaPencil,
  FaPeopleGroup,
  FaUserPlus,
} from 'react-icons/fa6';
import Link from 'next/link';
import { UsersSearch } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import React, { Suspense } from 'react';
import { getBearerToken, getUser } from '@fmicodes/fmicodes-api-client/next';
import { useLocale } from 'next-intl';
import { FaSignOutAlt } from 'react-icons/fa';
import { LeaveTeamDialog } from '@fmicodes/fmicodes-ui/lib/components/site/leave-team-dialog/leave-team-dialog';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { EditTeamDialog } from '@fmicodes/fmicodes-ui/lib/components/site/edit-team-dialog/edit-team-dialog';

interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { teamId } = await params;
  const t = await getTranslations('team-page');
  const team = await ApiClient.TeamsApiService.teamsControllerGetTeamV1({
    teamId,
  });

  return {
    metadataBase: new URL(
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 4200}`,
    ),
    title: `${t('title', { teamName: team?.name })} | FMI{Codes} 2024`,
    description: t('description', { teamName: team?.name }),
    openGraph: {
      images: [`/en/teams/${team?.id}/image`],
    },
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;
  const t = await getTranslations('team-page');
  const locale = useLocale();
  const user = await getUser();

  const team = await ApiClient.TeamsApiService.teamsControllerGetTeamV1({
    teamId,
  });

  if (!team) {
    redirect(`/${locale}/teams`);
  }

  // TODO: this is requested for each subcategory, refactor to get all users once
  async function getUsersOutsideOfThisTeam() {
    const users = await ApiClient.UsersApiService.usersControllerGetAllV1({});
    return users.filter((currentUser) => currentUser.team?.id !== team.id);
  }

  async function getTeamInvitesSentUserIds() {
    const invites =
      await ApiClient.TeamsApiService.teamsControllerGetInvitationsSentV1({
        authorization: await getBearerToken(),
      });
    return invites.map((invite) => invite.userId);
  }

  async function getTeamJoinRequestsUserIds() {
    const requests =
      await ApiClient.TeamsApiService.teamsControllerGetJoinRequestsV1({
        authorization: await getBearerToken(),
      });
    return requests.map((request) => request.userId);
  }

  async function getUsersWithoutATeamAndNoRequestAndInvites() {
    const users = await getUsersOutsideOfThisTeam();
    const invitesUserIds = await getTeamInvitesSentUserIds();
    const requestsUserIds = await getTeamJoinRequestsUserIds();

    return users
      .filter((currentUser) => !currentUser.team)
      .filter((currentUser) => !invitesUserIds.includes(currentUser.id))
      .filter((currentUser) => !requestsUserIds.includes(currentUser.id));
  }

  async function getUsersWithATeamAndNoRequestAndInvites() {
    const users = await ApiClient.UsersApiService.usersControllerGetAllV1({});
    const invitesUserIds = await getTeamInvitesSentUserIds();
    const requestsUserIds = await getTeamJoinRequestsUserIds();

    return users
      .filter((currentUser) => currentUser.team)
      .filter((currentUser) => !invitesUserIds.includes(currentUser.id))
      .filter((currentUser) => !requestsUserIds.includes(currentUser.id));
  }

  async function getUsersRequestedToJoin() {
    const users = await getUsersOutsideOfThisTeam();
    const requestsUserIds = await getTeamJoinRequestsUserIds();

    return users.filter((currentUser) =>
      requestsUserIds.includes(currentUser.id),
    );
  }

  async function getUsersAlreadyInvited() {
    const users = await getUsersOutsideOfThisTeam();
    const invitesUserIds = await getTeamInvitesSentUserIds();

    return users.filter((currentUser) =>
      invitesUserIds.includes(currentUser.id),
    );
  }

  return (
    <Card className="w-full mt-12">
      <CardHeader className="relative p-0 w-full aspect-[12/3] space-y-0 overflow-hidden rounded-t-xl">
        <TeamBanner
          team={team}
          enableTeamCapitanControls={user?.id === team.capitanId}
        />
        <Button
          variant="outline"
          className="absolute top-1 left-1 rounded-xl"
          asChild
        >
          <Link href={`/${locale}/teams`}>
            <FaArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex items-center">
          <FaPeopleGroup className="w-8 h-8 mr-2" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase my-2 truncate text-clip">
            {team.name}
          </h1>
          <div className="ml-auto flex flex-row gap-2">
            {user && user.teamId === team.id && (
              <LeaveTeamDialog team={team} user={user}>
                <Button variant="outline">
                  <FaSignOutAlt className="h-4 w-4" />
                </Button>
              </LeaveTeamDialog>
            )}

            {user && user.id === team.capitanId && (
              <Suspense fallback={null}>
                <UsersSearch
                  teamId={team.id}
                  usersWithoutATeam={await getUsersWithoutATeamAndNoRequestAndInvites()}
                  usersWithATeam={await getUsersWithATeamAndNoRequestAndInvites()}
                  usersRequestedToJoin={await getUsersRequestedToJoin()}
                  usersAlreadyInvited={await getUsersAlreadyInvited()}
                >
                  <Button>
                    <FaUserPlus className="h-4 w-4" />
                  </Button>
                </UsersSearch>

                <EditTeamDialog team={team}>
                  <Button>
                    <FaPencil className="h-4 w-4" />
                  </Button>
                </EditTeamDialog>
              </Suspense>
            )}
          </div>
        </div>
        <div>
          <div className="p-4">
            <h2 className="text-md sm:text-lg md:text-xl font-semibold">
              {team.projectName || t('no-project-name')}
            </h2>
            <p className="text-sm sm:text-md md:text-lg">
              {team.projectDescription || t('no-project-description')}
            </p>
            {team.projectRepositories.length !== 0 && (
              <div>
                <h3 className="text-md sm:text-lg md:text-xl font-semibold">
                  {t('repository')}
                </h3>
                <div className="flex gap-2">
                  {team.projectRepositories.map((repository) => (
                    <Button key={repository} asChild variant="secondary">
                      <Link
                        key={repository}
                        href={repository}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm sm:text-md md:text-lg"
                      >
                        <FaGithub className="w-4 h-4 mr-2" /> {repository}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {team.projectWebsite && (
              <div>
                <h3 className="text-md sm:text-lg md:text-xl font-semibold">
                  Website
                </h3>
                <Button asChild variant="secondary">
                  <Link
                    href={team.projectWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm sm:text-md md:text-lg"
                  >
                    <FaGlobe className="w-4 h-4 mr-2" /> {team.projectWebsite}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
