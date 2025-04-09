data "aws_ecr_image" "image" {
  repository_name = local.name
  image_tag       = "latest"
}

locals {
  image_version = element(tolist(setsubtract(data.aws_ecr_image.image.image_tags, ["latest"])), 0)
}

resource "aws_lambda_function" "lambda" {
  package_type  = "Image"
  image_uri     = "${local.account_id}.dkr.ecr.us-east-1.amazonaws.com/${local.name}:${local.image_version}"
  architectures = ["x86_64"]
  function_name = local.name
  description   = "Weekly Budget Tracking V2"
  role          = aws_iam_role.lambda.arn
  memory_size   = 512
  timeout       = 60
  publish       = true
  tags          = merge(local.tags, { Name = local.name })
  depends_on    = [aws_cloudwatch_log_group.logs]
}

resource "aws_lambda_permission" "permit" {
  function_name = aws_lambda_function.lambda.function_name
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${local.region}:${local.account_id}:${aws_api_gateway_rest_api.gateway.id}/*/*/*"
}
