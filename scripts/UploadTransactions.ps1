param([string]$accessToken)

$transactions = Import-Csv -Path "c:/save/budget/trasnactions_2025-04-06_13-15-25.csv"

$headers = @{
	Authorization = "Bearer $accessToken"
	"Content-Type" = "application/json"
	Accept = "application/json"
}

$categoryIdByName = @{}
$incomeIdByYearName = @{}
$expenseIdByYearName = @{}

$categories = Invoke-RestMethod "http://localbudget-api.buysse.link/api/categories" -Headers $headers
foreach ($category in $categories) {
	$categoryIdByName[$category.name] = $category.id
}

$years = @(2020, 2021, 2022, 2023, 2024, 2025)
foreach ($year in $years) {
	$incomeIdByYearName[$year] = @{}
	$expenseIdByYearName[$year] = @{}

	$incomes = Invoke-RestMethod "http://localbudget-api.buysse.link/api/incomes?year=$year" -Headers $headers
	foreach ($income in $incomes) {
		$incomeIdByYearName[$year][$income.name] = $income.id
	}

	$expenses = Invoke-RestMethod "http://localbudget-api.buysse.link/api/expenses?year=$year" -Headers $headers
	foreach ($expense in $expenses) {
		$expenseIdByYearName[$year][$expense.name] = $expense.id
	}
}

foreach ($transaction in $transactions) {
	$year = ([datetime]$transaction.Date).Year

	if ($transaction.Category) {
		$categoryId = $categoryIdByName[$transaction.Category.Trim()]
	} else {
		$categoryId = $null
	}

	if ($transaction.IncomeName) {
		$incomeId = $incomeIdByYearName[$year][$transaction.IncomeName.Trim()]
	} else {
		$incomeId = $null
	}

	if ($transaction.ExpenseName) {
		$expenseId = $expenseIdByYearName[$year][$transaction.ExpenseName.Trim()]
	} else {
		$expenseId = $null
	}

	if ($transaction.Source -eq "Bank") {
		$sourceId = 0
	} else {
		$sourceId = 1
	}

	$request = @{
		Date = $transaction.Date
		SourceId = $sourceId
		RawText = $transaction.RawText.Trim()
		Amount = $transaction.Amount
		OriginalCategory = $transaction.OriginalCategory.Trim()
		CategoryId = $categoryId
		Description = $transaction.Description.Trim()
		Note = $transaction.Note.Trim()
		ExpenseId = $expenseId
		IncomeId = $incomeId
	}

	Invoke-RestMethod `
		"http://localbudget-api.buysse.link/api/transactions" `
		-Method "POST" `
		-Headers $headers `
		-Body (ConvertTo-Json $request)
}
