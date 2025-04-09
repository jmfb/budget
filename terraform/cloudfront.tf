data "aws_cloudfront_cache_policy" "managed" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "cors" {
  name = "Managed-CORS-S3Origin"
}

resource "aws_cloudfront_distribution" "cdn" {
  default_root_object = "index.html"
  aliases             = [local.ui_dns]
  enabled             = true
  price_class         = "PriceClass_100"
  tags                = merge(local.tags, { Name = local.name })
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  default_cache_behavior {
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = data.aws_cloudfront_cache_policy.managed.id
    compress                 = true
    target_origin_id         = aws_s3_bucket.cdn.arn
    viewer_protocol_policy   = "redirect-to-https"
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.cors.id
  }
  origin {
    domain_name = aws_s3_bucket.cdn.bucket_domain_name
    origin_id   = aws_s3_bucket.cdn.arn
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cdn.cloudfront_access_identity_path
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.ui_cdn.arn
    minimum_protocol_version = "TLSv1.2_2019"
    ssl_support_method       = "sni-only"
  }
}
