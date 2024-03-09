resource "vercel_project" "vercel_site" {
  name      = "fmicodes-site"
  framework = "nextjs"

  git_repository = {
    type              = "github"
    repo              = "fss-fmi/fmicodes"
    production_branch = "release-placeholder"
  }

  build_command    = "pnpm prisma migrate deploy && pnpm prisma generate && pnpm nx build fmicodes-site --prod"
  output_directory = "../../dist/apps/fmicodes-site/.next"
  install_command  = "pnpm install"
  root_directory   = "apps/fmicodes-site"
}
