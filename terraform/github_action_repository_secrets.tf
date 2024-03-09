resource "github_actions_secret" "vercel_fmicodes_site_project_id_secret" {
  repository      = github_repository.github_secrets_repository.name
  secret_name     = "VERCEL_FMICODES_PROJECT_SITE_ID"
  plaintext_value = var.vercel_project_site_id
}

resource "github_actions_secret" "vercel_fmicodes_admin_project_id_secret" {
  repository      = github_repository.github_secrets_repository.name
  secret_name     = "VERCEL_FMICODES_PROJECT_ADMIN_ID"
  plaintext_value = var.vercel_project_admin_id
}

resource "github_actions_secret" "vercel_site_project_id_secret" {
  repository      = github_repository.github_repository.name
  secret_name     = "VERCEL_PROJECT_SITE_ID"
  plaintext_value = var.vercel_project_site_id
}

resource "github_actions_secret" "vercel_admin_project_id_secret" {
  repository      = github_repository.github_repository.name
  secret_name     = "VERCEL_PROJECT_ADMIN_ID"
  plaintext_value = var.vercel_project_admin_id
}
