$certname = "LocalBudget"
$cert = New-SelfSignedCertificate `
	-Subject "CN=$certname" `
	-DnsName "localbudget.buysse.link" `
	-CertStoreLocation "Cert:\CurrentUser\My" `
	-KeyExportPolicy Exportable `
	-KeySpec Signature `
	-KeyLength 2048 `
	-KeyAlgorithm RSA `
	-HashAlgorithm SHA256
Export-Certificate `
	-Cert $cert `
	-FilePath "C:\save\keys\$certname.cer"
Export-PfxCertificate `
	-Cert $cert `
	-FilePath "C:\save\keys\$certname.pfx" `
	-Password (ConvertTo-SecureString -String "localcert" -Force -AsPlainText)
