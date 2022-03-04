resource "aws_dynamodb_table" "incomes" {
  name = "budget-incomes"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "Name"

  attribute {
    name = "Name"
    type = "S"
  }

  tags = merge(var.tags, tomap({
    "Name" = "budget-incomes"
  }))
}

resource "aws_dynamodb_table" "expenses" {
  name = "budget-expenses"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "Name"

  attribute {
    name = "Name"
    type = "S"
  }

  tags = merge(var.tags, tomap({
    "Name" = "budget-expenses"
  }))
}

resource "aws_dynamodb_table" "transactions" {
  name = "budget-transactions"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "Date"
  range_key = "Id"

  attribute {
    name = "Date"
    type = "S"
  }

  attribute {
    name = "Id"
    type = "N"
  }

  tags = merge(var.tags, tomap({
    "Name" = "budget-transactions"
  }))
}
