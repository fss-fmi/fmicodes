'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { unstable_noStore as noStore } from 'next/cache';
import { useLocale } from 'next-intl';
import { ApiClient } from '../client';
import { UsersPostCurrentTeamInvitesRespondRequestBodyDto } from '../client/src';
import TeamInviteResponse = UsersPostCurrentTeamInvitesRespondRequestBodyDto.response;

export async function login(email: string, password: string) {
  try {
    noStore();
    const response = await ApiClient.AuthApiService.authControllerPostLoginV1({
      requestBody: {
        email,
        password,
      },
      acceptLanguage: useLocale(),
    });

    const { accessToken, refreshToken } = response;
    const cookieStore = await cookies();
    setTokens(cookieStore, accessToken, refreshToken);
  } catch (error) {
    if (error instanceof ApiClient.ApiError) {
      return { error: error.body.message };
    }
  }

  return null;
}

export async function loginDiscord(code: string) {
  try {
    const response =
      await ApiClient.AuthApiService.authControllerPostLoginDiscordV1({
        code,
        authorization: await getBearerToken(),
        acceptLanguage: useLocale(),
      });

    const { accessToken, refreshToken } = response;
    const cookieStore = await cookies();
    setTokens(cookieStore, accessToken, refreshToken);
  } catch (error) {
    if (error instanceof ApiClient.ApiError) {
      return { error: error.body.message };
    }
  }

  return null;
}

export async function signUp(formData: FormData) {
  return fetch(`${process.env['API_BASE']}/api/v1/users`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept-Language': useLocale(),
    },
  });
}

export async function completeOnboarding() {
  try {
    await ApiClient.UsersApiService.usersControllerPatchCurrentOnboardingV1({
      authorization: await getBearerToken(),
      acceptLanguage: useLocale(),
    });
  } catch (error) {
    if (error instanceof ApiClient.ApiError) {
      return { error: error.body.message };
    }
  }

  return null;
}

export async function getRefreshedTokens() {
  noStore();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token');

  if (!refreshToken) {
    return null;
  }

  return ApiClient.AuthApiService.authControllerPostRefreshV1({
    authorization: `Refresh ${refreshToken.value}`,
  });
}

export async function refreshTokens(cookieStore: ResponseCookies) {
  const refreshedTokens = await getRefreshedTokens();
  if (refreshedTokens) {
    setTokens(
      cookieStore,
      refreshedTokens.accessToken,
      refreshedTokens.refreshToken,
    );
  }
}

export async function getAuth() {
  // Get access token from cookies
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access_token');

  // Refresh existing access and refresh tokens if the access token is expired
  if (!accessToken) {
    // await refreshTokens();
    accessToken = cookieStore.get('access_token');
  }

  return accessToken;
}

export async function getBearerToken() {
  const accessToken = await getAuth();

  if (!accessToken) {
    return undefined;
  }

  return `Bearer ${accessToken.value}`;
}

export async function getUser() {
  // Get current authentication
  const bearerToken = await getBearerToken();

  try {
    return await ApiClient.UsersApiService.usersControllerGetCurrentV1({
      authorization: bearerToken,
    });
  } catch (ApiError) {
    return undefined;
  }
}

function setTokens(
  cookieStore: ResponseCookies,
  accessToken: string,
  refreshToken: string,
) {
  const decodedAccessToken = jwtDecode(accessToken);
  const accessTokenExp = decodedAccessToken.exp;

  const decodedRefreshToken = jwtDecode(refreshToken);
  const refreshTokenExp = decodedRefreshToken.exp;

  cookieStore.set('access_token', accessToken, {
    expires: accessTokenExp ? accessTokenExp * 1000 : undefined,
  });
  cookieStore.set('refresh_token', refreshToken, {
    expires: refreshTokenExp ? refreshTokenExp * 1000 : undefined,
  });
}

export async function removeMemberRequest(
  team: ApiClient.TeamResponseBodyDto,
  user: ApiClient.UserResponseBodyDto,
) {
  try {
    return await ApiClient.TeamsApiService.teamsControllerDeleteMemberV1({
      teamId: `${team.id}`,
      userId: user.id,
      authorization: await getBearerToken(),
    });
  } catch (error) {
    if (error instanceof ApiClient.ApiError) {
      return { error: error.body.message };
    }
  }

  return null;
}

export async function respondToTeamInvite(
  inviteId: string,
  requestResponse: TeamInviteResponse,
) {
  try {
    return await ApiClient.UsersApiService.usersControllerPostCurrentTeamInvitesRespondV1(
      {
        requestBody: {
          response: requestResponse,
        },
        inviteId,
        authorization: await getBearerToken(),
      },
    );
  } catch (error) {
    if (error instanceof ApiClient.ApiError) {
      return { error: error.body.message };
    }
  }

  return null;
}
