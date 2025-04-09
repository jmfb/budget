provider "aws" {
  region = "us-east-1"
}

terraform {
  required_version = "1.11.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.94.1"
    }
  }

  backend "s3" {
    bucket         = "jmfb-terraform"
    key            = "budget2"
    region         = "us-east-1"
    dynamodb_table = "tfstate-lock"
  }
}
