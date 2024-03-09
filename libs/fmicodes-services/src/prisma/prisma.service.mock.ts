import createPrismaMock from 'prisma-mock';
import { exampleUsers } from '../users/users.mock';
import { exampleTeams } from '../teams/teams.mock';

const prismaServiceMock = createPrismaMock({
  user: exampleUsers,
  team: exampleTeams,
});

export default prismaServiceMock;
