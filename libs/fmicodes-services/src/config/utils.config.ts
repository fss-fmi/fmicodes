import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { libConfig } from './lib.config';

export function isTeamVerified(
  team: ApiClient.TeamResponseBodyDto,
): boolean {
  return (
    team.members['length'] >= libConfig.team.members.min &&
    team.members['length'] <= libConfig.team.members.max
  );
}
