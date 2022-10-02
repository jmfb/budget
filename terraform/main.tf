terraform {
  required_version = "1.3.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.27.0"
    }
  }

  backend "s3" {
    bucket         = "jmfb-terraform"
    key            = "budget"
    region         = "us-east-1"
    dynamodb_table = "tfstate-lock"
  }
}

provider "aws" {
  region = "us-east-1"
}
