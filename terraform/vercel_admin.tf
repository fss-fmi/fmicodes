resource "vercel_project" "vercel_admin" {
  name      = "fmicodes-admin"
  framework = "nextjs"

  git_repository = {
    type              = "github"
    repo              = "fss-fmi/fmicodes"
    production_branch = "release-placeholder"
  }

  build_command    = "pnpm prisma migrate deploy && pnpm prisma generate && pnpm nx build fmicodes-admin --prod"
  output_directory = "../../dist/apps/fmicodes-admin/.next"
  install_command  = "pnpm install"
  root_directory   = "apps/fmicodes-admin"
}
