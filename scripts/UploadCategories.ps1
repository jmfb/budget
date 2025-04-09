param([string]$accessToken)

$expenses = Import-Csv -Path "c:/save/budget/expenses_2025-04-06_13-15-27.csv"
$categories = $expenses | ForEach { $_.Category.Trim() }

$pendingItems = Import-Csv -Path "c:/save/budget/pending_items_2025-04-06_13-15-26.csv"
$categories += $pendingItems | ForEach { $_.Category.Trim() }

$transactions = Import-Csv -Path "c:/save/budget/trasnactions_2025-04-06_13-15-25.csv"
$categories += $transactions | ForEach { $_.Category.Trim() }

$distinctCategories = $categories | Where { $_ } | Sort-Object | Get-Unique

$headers = @{
	Authorization = "Bearer $accessToken"
	"Content-Type" = "application/json"
}

foreach ($category in $distinctCategories) {
	$request = @{
		Name = $category
	}
	Invoke-RestMethod `
		"http://localbudget-api.buysse.link/api/categories" `
		-Method "POST" `
		-Headers $headers `
		-Body (ConvertTo-Json $request)
}
