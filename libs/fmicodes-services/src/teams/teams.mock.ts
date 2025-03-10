import { Color } from '@prisma/client';

export const exampleTeamCreateDto = {
  name: 'Team Gosho Losho',
  color: Color.BLUE,
};

export const exampleTeam = {
  ...exampleTeamCreateDto,
  id: 1,
  capitanId: '4b259124-6c9a-454c-b1eb-9aa4716136bb',
  imageUrl: null,
  projectName: null,
  projectDescription: null,
  projectRepositories: null,
  projectWebsite: null,
  teamPointsId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const exampleTeam2createDto = {
  name: 'Team Posho Mosho',
  color: Color.RED,
};

export const exampleTeam2 = {
  ...exampleTeam2createDto,
  id: 2,
  capitanId: 'eb11f360-98c5-44f3-9b4a-98169b051077',
  imageUrl: null,
  projectName: null,
  projectDescription: null,
  projectRepositories: null,
  projectWebsite: null,
  teamPointsId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const exampleNonexistentTeamCreateDto = {
  name: 'Team Nonexistent',
  color: Color.BLUE,
};

export const exampleNonexistentTeam = {
  ...exampleNonexistentTeamCreateDto,
  id: 3,
  capitanId: '35f8f475-f008-4c5e-88f3-5e453b6904b7',
  imageUrl: null,
  projectName: null,
  projectDescription: null,
  projectRepositories: null,
  projectWebsite: null,
  teamPointsId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const exampleTeams = [exampleTeam, exampleTeam2];
