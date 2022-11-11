$Password = ConvertTo-SecureString "12345abcdeFGHIJ" -AsPlainText -Force

$Params = @{
CreateDnsDelegation = $false
DatabasePath = 'C:\Windows\NTDS'
DomainMode = 'WinThreshold'
DomainName = 'domain.com'
DomainNetbiosName = 'DOMAIN'
ForestMode = 'ms'
InstallDns = $true
LogPath = 'C:\Windows\NTDS'
NoRebootOnCompletion = $true
SafeModeAdministratorPassword = $Password
SysvolPath = 'C:\Windows\SYSVOL'
Force = $true
}

Install-ADDSForest @Params

Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
