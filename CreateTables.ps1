$ErrorActionPreference = "Stop"

try {
	. .\ExecFunction.ps1

	Write-Host "[$(Get-Date)] Creating budget-incomes table..."
	exec { & aws dynamodb create-table `
		--endpoint-url http://localhost:8000 `
		--table-name "budget-incomes" `
		--attribute-definitions `
			AttributeName=Name,AttributeType=S `
		--key-schema `
			AttributeName=Name,KeyType=HASH `
		--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 | Out-Null
	}

	Write-Host "[$(Get-Date)] Creating budget-expenses table..."
	exec { & aws dynamodb create-table `
		--endpoint-url http://localhost:8000 `
		--table-name "budget-expenses" `
		--attribute-definitions `
			AttributeName=Name,AttributeType=S `
		--key-schema `
			AttributeName=Name,KeyType=HASH `
		--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 | Out-Null
	}

	Write-Host "[$(Get-Date)] Creating budget-transactions table..."
	exec { & aws dynamodb create-table `
		--endpoint-url http://localhost:8000 `
		--table-name "budget-transactions" `
		--attribute-definitions `
			AttributeName=Date,AttributeType=S `
			AttributeName=Id,AttributeType=N `
		--key-schema `
			AttributeName=Date,KeyType=HASH `
			AttributeName=Id,KeyType=RANGE `
		--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 | Out-Null
	}

	Write-Host "[$(Get-Date)] Creating budget-pending-items table..."
	exec { & aws dynamodb create-table `
		--endpoint-url http://localhost:8000 `
		--table-name "budget-pending-items" `
		--attribute-definitions `
			AttributeName=Id,AttributeType=N `
		--key-schema `
			AttributeName=Id,KeyType=HASH `
		--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 | Out-Null
	}

	Write-Host "[$(Get-Date)] Creating budget-data-version table..."
	exec { & aws dynamodb create-table `
		--endpoint-url http://localhost:8000 `
		--table-name "budget-data-versions" `
		--attribute-definitions `
			AttributeName=Name,AttributeType=S `
		--key-schema `
			AttributeName=Name,KeyType=HASH `
		--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 | Out-Null
	}

	exit 0
} catch {
	Write-Host $_ -BackgroundColor Red
	exit -1
}
