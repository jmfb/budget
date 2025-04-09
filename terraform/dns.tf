data "aws_route53_zone" "dns_zone" {
  name         = "buysse.link."
  private_zone = false
}

resource "aws_acm_certificate" "acm" {
  domain_name       = var.dns
  validation_method = "DNS"
  tags              = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "validation" {
  for_each = {
    for option in aws_acm_certificate.acm.domain_validation_options : option.domain_name => {
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
  certificate_arn         = aws_acm_certificate.acm.arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}

resource "aws_api_gateway_domain_name" "gateway" {
  domain_name     = var.dns
  certificate_arn = aws_acm_certificate.acm.arn
  tags            = var.tags
}

resource "aws_route53_record" "dns" {
  zone_id = data.aws_route53_zone.dns_zone.zone_id
  name    = var.dns
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.gateway.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.gateway.cloudfront_zone_id
    evaluate_target_health = true
  }
}
