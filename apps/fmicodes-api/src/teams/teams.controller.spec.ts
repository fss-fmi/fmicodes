import { Test, TestingModule } from '@nestjs/testing';
import {
  exampleNonexistentTeam,
  exampleNonexistentTeamCreateDto,
} from '@fmicodes/fmicodes-services//teams/teams.mock';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { exampleUserWithoutPassword3 } from '@fmicodes/fmicodes-services/users/users.mock';
import { TeamsController } from './teams.controller';

describe('TeamsController', () => {
  let controller: TeamsController;

  jest.mock('@fmicodes/fmicodes-services//teams/teams.service');
  const mockTeamsService: jest.Mocked<TeamsService> = jest.requireMock(
    '@fmicodes/fmicodes-services//teams/teams.service',
  );

  mockTeamsService.create = jest.fn().mockResolvedValue(exampleNonexistentTeam);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService],
      controllers: [TeamsController],
    })
      .overrideProvider(TeamsService)
      .useValue(mockTeamsService)
      .compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postV1', () => {
    it('should return a new team on correct information', async () => {
      // Act
      const result = await controller.postV1(
        exampleNonexistentTeamCreateDto,
        exampleUserWithoutPassword3,
      );

      // Assert
      expect(result).toBe(exampleNonexistentTeam);
    });
  });
});
