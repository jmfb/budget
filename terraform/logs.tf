resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 3
  tags              = merge(local.tags, { Name = local.name })
}
