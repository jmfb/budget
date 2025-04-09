variable "release_version" {
  type = string
}

variable "token_secret" {
  type      = string
  sensitive = true
}

variable "auth_client_secret" {
  type      = string
  sensitive = true
}

variable "database_password" {
  type      = string
  sensitive = true
}
