param([string]$accessToken)

$pendingItems = Import-Csv -Path "c:/save/budget/pending_items_2025-04-06_13-15-26.csv"

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

$incomes = Invoke-RestMethod "http://localbudget-api.buysse.link/api/incomes?year=$currentYear" -Headers $headers
$incomeIdByName = @{}
foreach ($income in $incomes) {
	$incomeIdByName[$income.name] = $income.id
}

$expenses = Invoke-RestMethod "http://localbudget-api.buysse.link/api/expenses?year=$currentYear" -Headers $headers
$expenseIdByName = @{}
foreach ($expense in $expenses) {
	$expenseIdByName[$expense.name] = $expense.id
}

foreach ($pendingItem in $pendingItems) {
	if ($pendingItem.Category) {
		$categoryId = $categoryIdByName[$pendingItem.Category.Trim()]
	} else {
		$categoryId = $null
	}

	if ($pendingItem.IncomeName) {
		$incomeId = $incomeIdByName[$pendingItem.IncomeName.Trim()]
	} else {
		$incomeId = $null
	}

	if ($pendingItem.ExpenseName) {
		$expenseId = $expenseIdByName[$pendingItem.ExpenseName.Trim()]
	} else {
		$expenseId = $null
	}

	$request = @{
		Name = $pendingItem.Name
		Amount = $pendingItem.Amount
		CategoryId = $categoryId
		ExpenseId = $expenseId
		IncomeId = $incomeId
	}

	Invoke-RestMethod `
		"http://localbudget-api.buysse.link/api/pending-items" `
		-Method "POST" `
		-Headers $headers `
		-Body (ConvertTo-Json $request)
}
