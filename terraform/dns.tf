data "aws_route53_zone" "dns_zone" {
  name         = "buysse.link."
  private_zone = false
}

resource "aws_acm_certificate" "api_acm" {
  domain_name       = local.api_dns
  validation_method = "DNS"
  tags              = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_validation" {
  for_each = {
    for option in aws_acm_certificate.api_acm.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.dns_zone.zone_id
}

resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = aws_acm_certificate.api_acm.arn
  validation_record_fqdns = [for record in aws_route53_record.api_validation : record.fqdn]
}

resource "aws_api_gateway_domain_name" "api_gateway" {
  domain_name     = local.api_dns
  certificate_arn = aws_acm_certificate.api_acm.arn
  tags            = local.tags
}

resource "aws_route53_record" "api_dns" {
  zone_id = data.aws_route53_zone.dns_zone.zone_id
  name    = local.api_dns
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.api_gateway.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.api_gateway.cloudfront_zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "ui_cdn" {
  domain_name       = local.ui_dns
  validation_method = "DNS"
  tags              = merge(local.tags, { Name = local.name })
}

resource "aws_acm_certificate_validation" "ui_cdn" {
  certificate_arn         = aws_acm_certificate.ui_cdn.arn
  validation_record_fqdns = [for dvo in aws_acm_certificate.ui_cdn.domain_validation_options : dvo.resource_record_name]
  depends_on              = [aws_route53_record.ui_acm]
}

resource "aws_route53_record" "ui_acm" {
  for_each = {
    for dvo in aws_acm_certificate.ui_cdn.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      record  = dvo.resource_record_value
      zone_id = data.aws_route53_zone.dns_zone.zone_id
    }
  }
  allow_overwrite = true
  zone_id         = each.value.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
}

resource "aws_route53_record" "ui_cdn" {
  name    = local.ui_dns
  type    = "A"
  zone_id = data.aws_route53_zone.dns_zone.zone_id
  alias {
    evaluate_target_health = true
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}
