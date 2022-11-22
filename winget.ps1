    ## Run the MS Store update and wait until winget is installed

    $OSVBui = [environment]::OSVersion.Version | Select-Object -expand build
    $wmiObj = Get-WmiObject -Namespace "root\cimv2\mdm\dmmap" -Class "MDM_EnterpriseModernAppManagement_AppManagement01"

    ## Windows 10 22H2
    If ($OSVBui -eq "19045")
    {
        Do {
            $updateTrigger = $wmiObj.UpdateScanMethod()
            start-sleep -S 60
        } until (Get-appxprovisionedpackage -online | where-object {$_.packagename -like 'Microsoft.DesktopAppInstaller*'} | where-object {$_.version -notlike "2019.125.2243.0"})
    }

    ## Windows 11 22H2
    If ($OSVBui -eq "22621")
    {
        Do {
            $updateTrigger = $wmiObj.UpdateScanMethod()
            start-sleep -S 60
        } until (Get-appxprovisionedpackage -online | where-object {$_.packagename -like 'Microsoft.DesktopAppInstaller*'} | where-object {$_.version -notlike "2022.310.2333.0"})
    }

    winget install -e --id 7zip.7zip --accept-package-agreements --accept-source-agreements
    winget install -e --id VideoLAN.VLC --accept-package-agreements --accept-source-agreements
    winget install -e --id Adobe.Acrobat.Reader.64-bit --accept-package-agreements --accept-source-agreements
    winget install -e --id Notepad++.Notepad++ --accept-package-agreements --accept-source-agreements
