resource "github_repository" "github_repository" {
  name         = "fmicodes"
  description  = "Website of the FMI{Codes} 2024 hackathon."
  homepage_url = "https://fmicodes.com"

  visibility = "public"

  has_issues      = true
  has_projects    = true
  has_wiki        = true
  has_discussions = true

  allow_merge_commit = false
  allow_squash_merge = true
  allow_rebase_merge = false

  allow_update_branch    = true
  delete_branch_on_merge = true
}

resource "github_repository" "github_secrets_repository" {
  name        = "secrets"
  description = "FSS of FMI Organizational Secrets"

  visibility = "private"

  has_issues      = false
  has_projects    = false
  has_wiki        = false
  has_discussions = false
}
