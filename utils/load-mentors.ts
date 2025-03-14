import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryColors: Record<string, string> = {
  familiar_with_fields: '#FF5733', // Bright orange
  programming_languages: '#4285F4', // Google blue
  web_technologies: '#34A853', // Google green
  server_technologies: '#FBBC05', // Google yellow
  database_tools: '#A142F4', // Purple
  mobile_apps: '#E91E63', // Pink
  machine_learning: '#9C27B0', // Deep purple
  game_development: '#3F51B5', // Indigo
  hardware: '#009688', // Teal
  cloud_technologies: '#FF9800', // Amber
  tools: '#795548', // Brown
};

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16),
    amt = Math.round(255 * (percent / 100)),
    r = Math.min(255, (num >> 16) + amt),
    g = Math.min(255, ((num >> 8) & 0x00ff) + amt),
    b = Math.min(255, (num & 0x0000ff) + amt);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getCategoryEntries(
  category: string,
  data: string,
): { where: { name: string }; create: { name: string; color: string } }[] {
  return data
    .split(',')
    .filter((item) => item.trim() !== '')
    .map((item, index, array) => ({
      where: { name: item.trim() },
      create: {
        name: item.trim(),
        color: lightenColor(
          categoryColors[category] || '#000000',
          (index / array.length) * 15,
        ), // Adjust brightness gradually
      },
    }));
}

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
      '/Users/mihaildobroslavski/Documents/FMI CODES/fmicodes-2024/utils/Answers.tsv',
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
          pictureUrl: record.picture_url,
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
            connectOrCreate: [
              ...getCategoryEntries(
                'familiar_with_fields',
                record.familiar_with_fields,
              ),
              ...getCategoryEntries(
                'programming_languages',
                record.programming_languages,
              ),
              ...getCategoryEntries(
                'web_technologies',
                record.web_technologies,
              ),
              ...getCategoryEntries(
                'server_technologies',
                record.server_technologies,
              ),
              ...getCategoryEntries('database_tools', record.database_tools),
              ...getCategoryEntries('mobile_apps', record.mobile_apps),
              ...getCategoryEntries(
                'machine_learning',
                record.machine_learning,
              ),
              ...getCategoryEntries(
                'game_development',
                record.game_development,
              ),
              ...getCategoryEntries('hardware', record.hardware),
              ...getCategoryEntries(
                'cloud_technologies',
                record.cloud_technologies,
              ),
              ...getCategoryEntries('tools', record.tools),
            ],
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
