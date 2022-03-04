data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = var.name
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "policy" {
  statement {
    effect    = "Allow"
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.lambda.arn]
  }

  statement {
    effect    = "Allow"
    actions   = [
      "dynamodb:DescribeTable",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"
    ]
    resources = [
      aws_dynamodb_table.incomes.arn,
      aws_dynamodb_table.expenses.arn,
      aws_dynamodb_table.transactions.arn
    ]
  }
}

resource "aws_iam_policy" "policy" {
  name   = var.name
  policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy_attachment" "policy" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.policy.arn
}
