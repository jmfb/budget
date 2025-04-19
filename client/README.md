# Budget Client Application

This directory contains the front-end UI for the budget application.

## Local Setup

You need to enable the IIS features (including script) for Windows.
You need to install the URL rewrite module:

```PowerShell
& choco install urlrewrite -y
```

Add the following entry to your hosts file: `C:\Windows\System32\drivers\etc\hosts`

```
127.0.0.1 localbudget.buysse.link
```

Run the following script in powershell to generate a self-signed cert and export it:

```PowerShell
. ./GenerateCert.ps1
```

Next, open an Ubuntu shell and run the following commands to extract the public/private pem files.
NOTE: Use the `localcert` password that Windows required when prompted.

You will also need to allow "Insecure Content" for the site in Chrome to allow the
http backend calls to succeed for mixed content. This was easier than trying to
get the self-signed cert on the API side to be accepted in the browser. Stupid.

```sh
cd /mnt/c/save/keys
openssl pkcs12 -in LocalBudget.pfx -out LocalBudget.pem -nodes
openssl pkcs12 -in LocalBudget.pfx -nocerts -out LocalBudgetPrivate.pem -nodes
openssl x509 -in LocalBudget.pem -out LocalBudgetPublic.pem
```
