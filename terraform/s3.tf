locals {
  bucket_name = "jmfb-${local.name}-cdn"
}

resource "aws_s3_bucket" "cdn" {
  bucket = local.bucket_name
  tags   = merge(local.tags, { Name = local.bucket_name })
}

resource "aws_s3_bucket_cors_configuration" "cdn" {
  bucket = aws_s3_bucket.cdn.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_public_access_block" "cdn" {
  bucket                  = aws_s3_bucket.cdn.id
  block_public_acls       = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  block_public_policy     = true
}

resource "terraform_data" "s3_ui_assets" {
  triggers_replace = [var.release_version]

  provisioner "local-exec" {
    command = "aws s3 cp ../client/build/ s3://${aws_s3_bucket.cdn.bucket}/ --recursive"
  }
}
