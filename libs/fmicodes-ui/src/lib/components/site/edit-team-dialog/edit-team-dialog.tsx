'use client';

import { FaSignInAlt } from 'react-icons/fa';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { Color } from '@prisma/client';
import libConfig from '@fmicodes/fmicodes-services/config/lib.config';
import ApiClient from '@fmicodes/fmicodes-api-client/client';
import { getBearerToken } from '@fmicodes/fmicodes-api-client/next';
import { Button } from '../../common/button/button';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  toast,
  Toaster,
} from '../../common/client';
import { Logo } from '../server';

interface CreateTeamDialogProps {
  children: React.ReactNode;
  team: ApiClient.TeamResponseBodyDto;
}

export function EditTeamDialog({ children, team }: CreateTeamDialogProps) {
  const t = useTranslations('site.edit-team-dialog');
  const colors = Object.values(Color);
  const locale = useLocale();

  const formSchema = z.object({
    color: z.enum(
      Object.values(libConfig.team.color.enum) as [string, ...string[]],
      {
        required_error: t('is-required'),
      },
    ),
    projectName: z
      .string()
      .max(
        libConfig.team.projectName.maxLength,
        t('too-long', { length: libConfig.team.projectName.maxLength }),
      ),
    projectDescription: z
      .string()
      .max(
        libConfig.team.projectDescription.maxLength,
        t('too-long', { length: libConfig.team.projectDescription.maxLength }),
      ),
    projectRepositories: z.string({
      required_error: t('is-required'),
    }),
    projectWebsite: z
      .string()
      .max(
        libConfig.team.projectWebsite.maxLength,
        t('too-long', { length: libConfig.team.projectWebsite.maxLength }),
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      color: team.color,
      projectName: team.projectName,
      projectDescription: team.projectDescription,
      projectRepositories: '',
      projectWebsite: team.projectWebsite,
    },
  });

  async function editTeam(requestBody: z.infer<typeof formSchema>) {
    try {
      return ApiClient.TeamsApiService.teamsControllerPatchV1({
        teamId: `${team.id}`,
        requestBody: {
          color: requestBody.color,
          projectName: requestBody.projectName,
          projectDescription: requestBody.projectDescription,
          projectRepositories: requestBody.projectRepositories,
          projectWebsite: requestBody.projectWebsite,
        },
        acceptLanguage: locale,
        authorization: await getBearerToken(),
      });
    } catch (error) {
      if (error instanceof ApiClient.ApiError) {
        return { error: error.body.message };
      }
      return { error: t('try-again') };
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await editTeam(values);

    if (response?.error) {
      toast({
        variant: 'destructive',
        title: response.error,
        description: t('try-again'),
      });
    }
  }

  return (
    <>
      <Toaster />
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          {/* Banner */}
          <div
            className="flex flex-col w-full h-32 mt-4 overflow-ellipsis justify-center items-center text-center text-white"
            style={{ backgroundColor: form.watch('color') }}
          >
            <span className="w-fit h-12 px-2 py-1 text-3xl font-bold bg-white text-black dark:bg-black dark:text-white">
              {team.name}
            </span>
            <Logo className="px-4 py-2 scale-50 -mt-3 bg-white text-black dark:bg-black dark:text-white" />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-xl m-4 mx-auto"
            >
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('color')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-8 grid-rows-2 grid-flow-row space-y-1"
                      >
                        {colors.map((color) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-16 h-16"
                                style={{ backgroundColor: color }}
                                value={color}
                              />
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('project-name-placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('project-description-placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectRepositories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-repositories')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('project-repositories-placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project-website')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('project-website-placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <FaSignInAlt className="mr-2 h-4 w-4" /> {t('submit')}
              </Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
