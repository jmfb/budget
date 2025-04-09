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
  name               = local.name
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "policy" {
  statement {
    effect = "Allow"
    actions = ["secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    "secretsmanager:ListSecretVersionIds"]
    resources = [aws_secretsmanager_secret.token_secret.arn,
      aws_secretsmanager_secret.auth_client_secret.arn,
    aws_secretsmanager_secret.database_password.arn]
  }
}

resource "aws_iam_policy" "policy" {
  name   = local.name
  policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy_attachment" "policy" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_cloudfront_origin_access_identity" "cdn" {
  comment = "Identity for ${local.bucket_name} cloudfront distribution"
}

data "aws_iam_policy_document" "cloudfront_cdn" {
  policy_id = "PolicyForCloudFrontPrivateContent"
  version   = "2012-10-17"
  statement {
    sid    = "ObjectReadOnly"
    effect = "Allow"
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.cdn.iam_arn]
      type        = "AWS"
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.cdn.arn}/*"]
  }
  statement {
    sid    = "BucketReadOnly"
    effect = "Allow"
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.cdn.iam_arn]
      type        = "AWS"
    }
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.cdn.arn]
  }
}

resource "aws_s3_bucket_policy" "cloudfront_cdn" {
  bucket     = aws_s3_bucket.cdn.id
  policy     = data.aws_iam_policy_document.cloudfront_cdn.json
  depends_on = [aws_s3_bucket_public_access_block.cdn]
}
