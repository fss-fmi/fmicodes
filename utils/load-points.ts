import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateDatabase() {
  try {
    const filePath =
      'C:\\Users\\tsb\\Downloads\\Критерии FMI{Codes} 2024 - Total.tsv';
    const csvData = fs.readFileSync(filePath, 'utf-8');

    const rows = csvData.trim().split('\n').slice(1); // Skip the header row

    for (const row of rows) {
      const columns = row.split('\t');
      const teamName = columns[0].trim();
      const teamData = columns.slice(1).map((value) => parseInt(value.trim()));

      console.log(teamName, teamData);

      await prisma.team.update({
        where: {
          name: teamName,
        },
        data: {
          teamPoints: {
            create: {
              relevance: teamData[0],
              originality: teamData[1],
              applicability: teamData[2],
              completion: teamData[3],
              complexity: teamData[4],
              authenticity: teamData[5],
              quality: teamData[6],
              projectTechnologiesChoice: teamData[7],
              projectStructure: teamData[8],
              presentation: teamData[9],
              demo: teamData[10],
              questions: teamData[11],
            },
          },
        },
      });
    }

    console.log('Database population completed.');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateDatabase();
