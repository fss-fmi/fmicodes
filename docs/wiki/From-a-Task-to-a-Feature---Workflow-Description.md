This manual should walk you through the entire process of creating a task (issue), working on it, submitting a pull request, merging, and deploying it. The guide will also outline several conventions that you should stick to in the process.

### Table of contents

1. [Issues](#-issues)
2. [Project Boards](#-project-boards)
3. [Git Branches](#-git-branches)
4. [Commit Conventions](#-commit-conventions)
5. [Pull Requests (PRs)](#-pull-requests-prs)
6. [Preview and Production deployments](#-preview-and-production-deployments)
7. [Closing Remarks](#-closing-remarks)

---

## 🎟️ Issues

Issues are a feature of GitHub that allows tracking, discussion, and prioritization of tasks, features, bug fixes, and other issues related to software projects. In this project, it is used for task tracking, work assignment, and team communication.

To view all the open issues for FMI{Codes} - [go to this page](https://github.com/fss-fmi/fmicodes/issues).

To create an issue, select the `New issues` button and choose an appropriate template for the task you are assigning. In case you need to modify the issue templates, they are stored as markdown files in `.github/ISSUE_TEMPLATE`.

![Issue Templates](./assets/from-a-task-to-a-feature-workflow-description/issue-templates.png)

Whenever creating an issue, make sure to stick to the template and give as much context as you currently have. Also, ensure that you have assigned the appropriate labels, project, milestone, and assignee(s) in the right-side panel. It's not a problem if a request doesn't initially have an assignee - it can be assigned later.

![Example of an well documented issue](./assets/from-a-task-to-a-feature-workflow-description/example-issue.png)

An open issue is considered a task to be completed - so whenever a task is completed, close the issue, whether via a comment or a [pull request](#-pull-requests-prs).

## 📊 Project Boards

GitHub has a project board feature called "GitHub Projects". It can be used to organize all the project issues and their statuses.

To view the project board for FMI{Codes} - [go to this page](https://github.com/orgs/fss-fmi/projects/1).

Whenever you open the project board, it will have the following 6 tabs:

- `Personal Tasks` - Tasks assigned to you
- `General` - General task, not related to the API, the site, or the admin panel
- `API` - Tasks regarding the API backend
- `Site` - Tasks regarding the front-end client
- `Admin` - Tasks regarding the admin panel
- `All` - All project tasks

Work is sorted into 5 columns: `🔙 Backlog`, `📌 Todo`, `🛠 In Progress`, `🧪 In Validation`, and `🎉 Done`.

![Project board](./assets/from-a-task-to-a-feature-workflow-description/project-board.png)

You can use the board to organize your personal work or overview tasks across the project.

## 🌿 Git Branches

Whenever you are working on a task, that requires changes to the project source code, you should create a git branch and make your changes in it. You can associate a GitHub issue with a branch by going to the issue page and selecting the `Create a branch` button under `Development` on the right-hand side of the page.

When creating a branch, you should specify a name for it. I recommend you include the GitHub issue number in the branch name. Personally, I name my branches `SUG-<ticket number>` (`SUG` is shortened from `FMI{Codes}`), but you can go with whatever suits you (including the default suggested by GitHub).

Before starting work on a feature, **always remember to `git checkout` your branch locally**. Direct pushes to the `main` branch are restricted.

https://github.com/fss-fmi/fmicodes/assets/26301867/c594ab74-96f7-4b49-9c78-212ad4e99f26

## 🔬 Commit Conventions

To keep the project repository tidy and well-maintained, a few code checks are made when you make a git commit. Those checks can be put into 2 categories:

- **Commit message checks**

  - Each commit message should contain a `header`, a `body`, and a `footer`. The `header` has a special format that includes a `type`, a `scope`, and a `subject`:

    ```
    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>
    ```

  - The commit message `header` should start with one of the following `type` keywords:

    - `feat` - when introducing a new feature to the project.
    - `fix` - when addressing a bug or error.
    - `build` - when you are introducing changes related to the build system or external dependencies. It could include configuration changes or updates to build scripts.
    - `chore` - when performing routine tasks, maintenance, or minor adjustments that are not related to the application's logic.
    - `ci` - when changing the Continuous Integration (CI) configuration or any other automated workflow.
    - `docs` - when making documentation-related changes, such as updating README files or adding comments.
    - `perf` - when you introduce changes that improve the performance of the application.
    - `refactor` - when you are restructuring code without changing its external behavior.
    - `revert` - when reverting a previous commit. The commit being reverted should be referenced.
    - `style` - when making changes that do not affect the meaning of the code, such as formatting, white space, or code style adjustments.
    - `test` - when you are adding or modifying tests.

  - The `scope` in the header is optional and can be used to specify the module, component, or area of the project that the commit affects.

  - The `subject` in the header should be a concise and clear description of the changes introduced by the commit. It should contain only lowercase letters.

  - The `body` is optional (but highly recommended) and can provide additional details about the changes, providing context or explaining the reasoning behind the commit.

  - The `footer` is optional and can be used to reference issue tracker IDs or include breaking change notices.

  - More detailed documentation about `Conventional Commits` can be found [here](https://www.conventionalcommits.org/en/v1.0.0/).

> [!WARNING]
> If the commit message does not comply with this ruleset, the commit is terminated.

- **Contents check**

  - **Formatting using `prettier`** - Upon committing, a file formatting check is performed using `prettier`. If formatting errors are found, `prettier` tries to resolve them. In case any errors cannot be resolved, the commit process is stopped.

  - **Linting using `eslint`** - All `.ts` and `.tsx` files are linted using `eslint` on commit. If the linting process finds errors, `eslint` tries to fix them and if it fails to do so - the commit is terminated.

  - **Prisma formatting** - Whenever committing, the `prisma/scheme.prisma` schema file is checked and formatted.

  - **Terraform formatting** - If the `terraform` command is available on the current machine, `.tf` files in the `terraform/` directory are checked and formatted.

> [!WARNING]
> If any of the aforementioned checks fails (returns a non-zero status), the commit is terminated.

---

The checks are performed using the [husky](https://www.npmjs.com/package/husky) tool. This means that you should have installed the project dependencies beforehand. For an installation manual, please refer to the [Development Setup section in the Developer Onboarding guide](./Developer-Onboarding.md#-development-setup).

Most of the aforementioned content checks can be displayed right in your IDE, while you are developing. For reference on how to set those checks up, refer to the [IDE Setup section in the Developer Onboarding guide](./Developer-Onboarding.md#-ide-setup).

## ⏩ Pull Requests (PRs)

Whenever a task is completed, the changes from the task's git branch should be merged into the `main` branch. This is done via Pull Request (PRs).

To create a new PR, go to the `Pull requests` tab on GitHub and click `New pull request` (or click [here](https://github.com/fss-fmi/fmicodes/compare)). Then select the branch you want to merge and click `Create pull request`.

You will be presented with a PR template - make sure to stick to it and give as much information about your changes as you can. Also, ensure that you have assigned the appropriate project, milestone, labels, and reviewers in the right-side panel.

The PR title must be in the following format:

```
<type>(<issue number>): <subject>
```

where:

- `type` should usually the same as in the issue title, should be one of the following: `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`.
- `issue number` should be the number of the issue the PR is resolving (e.g. `#26`).
- `subject` should be a concise and clear description of the changes introduced by the commit.

Several good examples of good PR titles are `feat(#26): Credentials authentication`, `fix(#24): Documentation sync pipeline failure fix`, `docs(#36): Workflow description documentation`, etc.

![Example pull request](./assets/from-a-task-to-a-feature-workflow-description/example-pull-request.png)

---

Each PR deploys preview versions of the `fmicodes-api`, `fmicodes-site`, and `fmicodes-admin` apps to Vercel. These previews can be inspected by following the links in the comment left by the Vercel bot in the pull request.

![Vercel PR comment](./assets/from-a-task-to-a-feature-workflow-description/vercel-pr-comment.png)

> [!NOTE]
> To inspect the builds, you need to be logged in to the organization's Vercel account. Refer to [the secrets repository](https://github.com/fss-fmi/secrets/blob/main/credentials.md) for account credentials.

---

In addition, if the PR has infrastructure changes (changes in the `terraform` directory), a Terraform Plan will be created and linked as a comment.

![Terraform PR comment](./assets/from-a-task-to-a-feature-workflow-description/terraform-pr-comment.png)

> [!NOTE]
> To inspect the Terraform Cloud run, you need to be logged in to the organization's Hashicorp account. Refer to [the secrets repository](https://github.com/fss-fmi/secrets/blob/main/credentials.md) for account credentials.

---

Before merging the PR, it should pass 2 checks:

- **It must be reviewed and tested** by at least 1 team member.
- **It must pass all automated checks.** The automated checks include:
  - `Vercel – fmicodes-api` - Preview deployment of `fmicodes-api` has been completed successfully.
  - `Vercel – fmicodes-site` - Preview deployment of `fmicodes-site` has been completed successfully.
  - `Vercel – fmicodes-admin` - Preview deployment of `fmicodes-admin` has been completed successfully.
  - `Terraform Plan` has created an infrastructure change plan, if there are changes in `terraform/`.
  - `Continuous Integration` - The entire project builds successfully, passes formatting and linting checks and passes unit and E2E tests.
  - `Build and Publish` - Container images of `fmicodes-api`, `fmicodes-site`, and `fmicodes-admin` have been built for and published to the [GitHub Packages Hub](https://github.com/orgs/fss-fmi/packages) and the [Docker Hub](https://hub.docker.com/u/fssfmi).

![PR checks](./assets/from-a-task-to-a-feature-workflow-description/pr-checks.png)

After all that is complete, you can `Squash and merge` the PR into the `main` branch. 🥳

## 🚀 Preview and Production Deployments

Congrats, you have merged your PR! 🎉 However, it is not available to the public yet. Merges to the `main` branch do not deploy to the `production` environment directly, but rather on a `preview` environment, which can be used for pre-release testing.

The `preview` environment URLs are the following:

- **fmicodes-api**: https://fmicodes-api-git-main-fss-fmi.vercel.app
- **fmicodes-site**: https://fmicodes-site-git-main-fss-fmi.vercel.app
- **fmicodes-admin**: https://fmicodes-admin-git-main-fss-fmi.vercel.app

---

To publish to the `production` environment, you will need to create a SemVer release. Semantic Versioning (SemVer) is a versioning scheme for software that uses a three-part number, major.minor.patch, to convey information about the nature of changes. In this project, we use the [jscutlery/semver](https://github.com/jscutlery/semver) package for creating and managing workspace versions.

> [!IMPORTANT]
> Everyone can create SemVer releases, but only code owners can push them to the repository.

To create a versioned release, first make sure you have changed the current branch to `main` and have pulled the latest changes from the remote repository:

```shell
git fetch
git checkout main
git pull
```

Then run one of the following commands, depending on the type of release you are targeting:

```shell
# Create a patch release; changes version from X.Y.Z to X.Y.Z+1
pnpm nx run workspace:version --releaseAs=patch

# Create a minor release; changes version from X.Y.Z to X.Y+1.0
pnpm nx run workspace:version --releaseAs=minor

# Create a major release; changes version from X.Y.Z to X+1.0.0
pnpm nx run workspace:version --releaseAs=major
```

After completion, you must push the `main` branch changes and the new version tag to the remote repository.

```shell
# Push the main branch
git push origin main

# Push the new version tag
git push --tags
```

Afterward, an automatic release workflow will be triggered. When it completes (takes roughly about 3-4 minutes), the new release will be available under `Releases` on the main GitHub page (or by clicking [here](https://github.com/fss-fmi/fmicodes/releases)). From the release page, you will be able to find the deployment URLs.

![Releases](./assets/from-a-task-to-a-feature-workflow-description/releases.png)

The latest production deployments can always be accessed by querying the following links:

- **fmicodes-api**: https://fmicodes-api-fss-fmi.vercel.app
- **fmicodes-site**: https://fmicodes-site-fss-fmi.vercel.app
- **fmicodes-admin**: https://fmicodes-admin-fss-fmi.vercel.app

## 🔚 Closing Remarks

Congratulations on completing this lengthy guide. Now you should be familiar with how features are shipped in the FMI{Codes} project. If you have questions or need help, reach out to anyone on the team.

Thank you so much for contributing! Happy coding! ❤️
