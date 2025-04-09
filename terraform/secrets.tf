resource "aws_secretsmanager_secret" "token_secret" {
  name = "BudgetTokenSecret"
  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "token_secret" {
  secret_id     = aws_secretsmanager_secret.token_secret.id
  secret_string = var.token_secret
}

resource "aws_secretsmanager_secret" "auth_client_secret" {
  name = "BudgetAuthClientSecret"
  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "auth_client_secret" {
  secret_id     = aws_secretsmanager_secret.auth_client_secret.id
  secret_string = var.auth_client_secret
}

resource "aws_secretsmanager_secret" "database_password" {
  name = "BudgetDatabasePassword"
  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "database_password" {
  secret_id     = aws_secretsmanager_secret.database_password.id
  secret_string = var.database_password
}
