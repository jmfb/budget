param([string]$accessToken)

$expenses = Import-Csv -Path "c:/save/budget/expenses_2025-04-06_13-15-27.csv"
$transactions = Import-Csv -Path "c:/save/budget/trasnactions_2025-04-06_13-15-25.csv"

$currentYear = (Get-Date).Year

$headers = @{
	Authorization = "Bearer $accessToken"
	"Content-Type" = "application/json"
	Accept = "application/json"
}

$categories = Invoke-RestMethod "http://localbudget-api.buysse.link/api/categories" -Headers $headers
$categoryIdByName = @{}
foreach ($category in $categories) {
	$categoryIdByName[$category.name] = $category.id
}

foreach ($expense in $expenses) {
	$request = @{
		Year = $currentYear
		Name = $expense.Name.Trim()
		Amount = $expense.Amount
		CategoryId = $categoryIdByName[$expense.Category]
		MonthsInterval = $expense.MonthsInterval
		IsDistributed = [bool]::Parse($expense.IsDistributed)
	}

	Invoke-RestMethod `
		"http://localbudget-api.buysse.link/api/expenses" `
		-Method "POST" `
		-Headers $headers `
		-Body (ConvertTo-Json $request)
}

$previousYears = @(2020, 2021, 2022, 2023, 2024)
foreach ($year in $previousYears) {
	$yearTransactions = $transactions `
		| Where { ([datetime]$_.Date).Year -eq $year }
	$yearExpenses = $yearTransactions `
		| ForEach { $_.ExpenseName.Trim() } `
		| Where { $_ } `
		| Sort-Object `
		| Get-Unique
	foreach ($name in $yearExpenses) {
		$amount = (`
			$yearTransactions `
			| Where { $_.ExpenseName.Trim() -eq $name } `
			| ForEach { $_.Amount } `
			| Measure-Object -Sum `
		).Sum

		$categoryName = (`
			$yearTransactions `
			| Where { $_.ExpenseName.Trim() -eq $name } `
			| ForEach { $_.Category.Trim() } `
			| Where { $_ } `
			| Measure-Object -Minimum `
		).Minimum
		if (-not $categoryName) {
			$categoryName = "Other"
		}

		$request = @{
			Year = $year
			Name = $name
			Amount = $amount
			CategoryId = $categoryIdByName[$categoryName]
			MonthsInterval = 12
			IsDistributed = $true
		}

		Invoke-RestMethod `
			"http://localbudget-api.buysse.link/api/expenses" `
			-Method "POST" `
			-Headers $headers `
			-Body (ConvertTo-Json $request)
	}
}
