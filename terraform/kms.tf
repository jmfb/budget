resource "aws_kms_key" "lambda" {
  description = "Budget Lambda Environment Variable Key"
  tags        = var.tags
}

resource "aws_kms_alias" "lambda" {
  name          = "alias/${var.name}-key"
  target_key_id = aws_kms_key.lambda.key_id
}
