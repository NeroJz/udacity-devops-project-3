
#!/bin/bash

az group create --name Udacity-LogAnalytics --location eastus
az deployment group create --resource-group Udacity-LogAnalytics --name la-jc-wsp --template-file deploylaworkspacetemplate.json