resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 3
  tags = merge(var.tags, {
    Name = var.name
  })
}
