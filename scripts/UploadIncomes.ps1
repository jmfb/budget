param([string]$accessToken)

$incomes = Import-Csv -Path "c:/save/budget/incomes_2025-04-06_13-15-29.csv"
$transactions = Import-Csv -Path "c:/save/budget/trasnactions_2025-04-06_13-15-25.csv"

$currentYear = (Get-Date).Year

$headers = @{
	Authorization = "Bearer $accessToken"
	"Content-Type" = "application/json"
}

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

$incomeByName = @{}

foreach ($income in $incomes) {
	$incomeByName[$income.Name] = $income

	$request = @{
		Year = $currentYear
		Name = $income.Name
		Amount = $income.Amount
		WeeksInterval = $income.WeeksInterval
	}

	Invoke-RestMethod `
		"https://localbudget-api.buysse.link/api/incomes" `
		-Method "POST" `
		-Headers $headers `
		-Body (ConvertTo-Json $request)
}

$previousYears = @(2020, 2021, 2022, 2023, 2024)
foreach ($year in $previousYears) {
	$yearTransactions = $transactions `
		| Where { ([datetime]$_.Date).Year -eq $year }
	$yearIncomes = $yearTransactions `
		| ForEach { $_.IncomeName } `
		| Where { $_ } `
		| Sort-Object `
		| Get-Unique
	foreach ($name in $yearIncomes) {
		$amount = (`
			$yearTransactions `
			| Where { $_.IncomeName -eq $name } `
			| ForEach { -$_.Amount } `
			| Measure-Object -Maximum `
		).Maximum

		$currentIncome = $incomeByName[$name]
		if ($currentIncome) {
			$weeksInterval = $currentIncome.WeeksInterval
		} else {
			$weeksInterval = 52
		}

		$request = @{
			Year = $year
			Name = $name
			Amount = $amount
			WeeksInterval = $weeksInterval
		}

		Invoke-RestMethod `
			"https://localbudget-api.buysse.link/api/incomes" `
			-Method "POST" `
			-Headers $headers `
			-Body (ConvertTo-Json $request)
	}
}
