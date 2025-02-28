import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CSVRecord {
  time_stamp: string;
  email: string;
  full_name: string;
  company_name: string;
  position: string;
  picture_url: string;
  phone: string;
  alternate_email: string;
  discord_account: string;
  friday_availability: string;
  saturday_availability: string;
  sunday_availability: string;
  familiar_with_fields: string;
  programming_languages: string;
  web_technologies: string;
  server_technologies: string;
  database_tools: string;
  mobile_apps: string;
  machine_learning: string;
  game_development: string;
  hardware: string;
  cloud_technologies: string;
  tools: string;
  additional_notes: string;
  mentorship: string;
  other_mentor_name: string;
  tshirt_size: string;
}

async function populateDatabase() {
  try {
    const data = fs.readFileSync(
      'C:\\Users\\tsb\\Downloads\\Ментор - FMI{Codes} 2025 (отговори) - Отговори от формуляр 1.tsv',
      'utf8',
    );
    console.log(data);
    const records: CSVRecord[] = data
      .split('\n')
      .slice(1)
      .map((line) => {
        const [
          time_stamp,
          email,
          full_name,
          company_name,
          position,
          picture_url,
          phone,
          alternate_email,
          discord_account,
          friday_availability,
          saturday_availability,
          sunday_availability,
          familiar_with_fields,
          programming_languages,
          web_technologies,
          server_technologies,
          database_tools,
          mobile_apps,
          machine_learning,
          game_development,
          hardware,
          cloud_technologies,
          tools,
          additional_notes,
          mentorship,
          other_mentor_name,
          tshirt_size,
        ] = line.split('\t');

        return {
          time_stamp,
          email,
          full_name,
          company_name,
          position,
          picture_url,
          phone,
          alternate_email,
          discord_account,
          friday_availability,
          saturday_availability,
          sunday_availability,
          familiar_with_fields,
          programming_languages,
          web_technologies,
          server_technologies,
          database_tools,
          mobile_apps,
          machine_learning,
          game_development,
          hardware,
          cloud_technologies,
          tools,
          additional_notes,
          mentorship,
          other_mentor_name,
          tshirt_size,
        };
      });

    for (const record of records) {
      await prisma.mentor.create({
        data: {
          name: record.full_name,
          pictureUrl: '',
          discordId: record.discord_account,
          company: {
            connect: {
              name: record.company_name,
            },
          },
          jobTitle: record.position,
          availability: [
            ...record.friday_availability
              .split(',')
              .filter((slot) => slot.trim() !== '')
              .map((slot) => `Петък ${slot.trim()}`),
            ...record.saturday_availability
              .split(',')
              .filter((slot) => slot.trim() !== '')
              .map((slot) => `Събота ${slot.trim()}`),
            ...record.sunday_availability
              .split(',')
              .filter((slot) => slot.trim() !== '')
              .map((slot) => `Неделя ${slot.trim()}`),
          ],
          technologies: {
            connect: [
              ...record.familiar_with_fields.split(',').map((field) => ({
                name: field.trim(),
              })),
              ...record.programming_languages.split(',').map((lang) => ({
                name: lang.trim(),
              })),
              ...record.web_technologies.split(',').map((tech) => ({
                name: tech.trim(),
              })),
              ...record.server_technologies.split(',').map((tech) => ({
                name: tech.trim(),
              })),
              ...record.database_tools.split(',').map((tool) => ({
                name: tool.trim(),
              })),
              ...record.mobile_apps.split(',').map((app) => ({
                name: app.trim(),
              })),
              ...record.machine_learning.split(',').map((ml) => ({
                name: ml.trim(),
              })),
              ...record.game_development.split(',').map((game) => ({
                name: game.trim(),
              })),
              ...record.hardware.split(',').map((hw) => ({
                name: hw.trim(),
              })),
              ...record.cloud_technologies.split(',').map((cloud) => ({
                name: cloud.trim(),
              })),
              ...record.tools.split(',').map((tool) => ({
                name: tool.trim(),
              })),
            ].filter((record) => record.name !== ''),
          },
        },
      });
    }

    console.log('Database population completed!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateDatabase();
