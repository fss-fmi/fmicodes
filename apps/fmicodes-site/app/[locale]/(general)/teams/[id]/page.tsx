import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { TeamBanner } from '@fmicodes/fmicodes-ui/lib/components/site/team-banner/team-banner';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { FaArrowLeft, FaPeopleGroup, FaUserPlus } from 'react-icons/fa6';
import Link from 'next/link';
import { UsersSearch } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import React, { Suspense } from 'react';
import { getBearerToken, getUser } from '@fmicodes/fmicodes-api-client/next';
import { useLocale } from 'next-intl';
import { FaSignOutAlt } from 'react-icons/fa';
import { LeaveTeamDialog } from '@fmicodes/fmicodes-ui/lib/components/site/leave-team-dialog/leave-team-dialog';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface TeamPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const t = await getTranslations('team-page');
  const team = await ApiClient.TeamsApiService.teamsControllerGetTeamV1({
    teamId: params.id,
  });

  return {
    title: `${t('title', { teamName: team?.name })} | FMI{Codes} 2024`,
    description: t('description'),
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const locale = useLocale();
  const user = await getUser();

  const team = await ApiClient.TeamsApiService.teamsControllerGetTeamV1({
    teamId: params.id,
  });

  if (!team) {
    return null;
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
          <Link href={`/${locale}//teams`}>
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
              </Suspense>
            )}
          </div>
        </div>
        {/* <div className="h-80"> */}
        {/*  <div className="p-4"> */}
        {/*    <h2 className="text-md sm:text-lg md:text-xl font-semibold"> */}
        {/*      Matches */}
        {/*    </h2> */}
        {/*  </div> */}
        {/* </div> */}
      </CardContent>
    </Card>
  );
}
