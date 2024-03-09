import { Test, TestingModule } from '@nestjs/testing';
import { I18nContext } from 'nestjs-i18n';
import { getRedisToken } from '@songkeys/nestjs-redis';
import { TeamsService } from './teams.service';
import { PrismaService } from '../src/prisma/prisma.service';
import prismaServiceMock from '../src/prisma/prisma.service.mock';
import {
  exampleNonexistentTeam,
  exampleNonexistentTeamCreateDto,
  exampleTeamCreateDto,
} from './teams.mock';
import { exampleUser, exampleUser3 } from '../src/users/users.mock';
import { TeamsNameAlreadyExistsException } from './exceptions/teams-name-already-exists.exception';
import { UsersService } from '../src/users/users.service';

describe('TeamsService', () => {
  let service: TeamsService;

  jest.mock('nestjs-i18n');
  I18nContext.current = jest.fn().mockReturnValue({
    t: () => jest.fn(),
  });

  const redisServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRedisToken('default'), useValue: redisServiceMock },
        TeamsService,
        PrismaService,
        UsersService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new team on valid information', async () => {
      // Act
      const actual = await service.create(
        exampleNonexistentTeamCreateDto,
        exampleUser3.id,
      );

      // Assert
      expect(actual).not.toBeNull();

      // Should be equal (except for timestamps)
      const { createdAt, updatedAt, ...expected } = exampleNonexistentTeam;
      const {
        createdAt: actualCreatedAt,
        updatedAt: actualUpdatedAt,
        ...actualTeam
      } = actual;

      expect(actualTeam).toEqual(expected);
      expect(redisServiceMock.publish).toHaveBeenCalled();
    });

    it('should throw an BadRequestException when the team name is already taken', async () => {
      // Act + Assert
      await expect(
        service.create(exampleTeamCreateDto, exampleUser3.id),
      ).rejects.toThrow(TeamsNameAlreadyExistsException);
    });

    it('should throw an BadRequestException when the user is already in a team', async () => {
      // Act + Assert
      await expect(
        service.create(exampleNonexistentTeamCreateDto, exampleUser.id),
      ).rejects.toThrow(TeamsNameAlreadyExistsException);
    });
  });
});
