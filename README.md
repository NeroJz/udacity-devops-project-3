# Udacity Nanodegree Devops Using Microsfot Azure
This project showcase the CI/CD full pipeline using Microsoft Azure. The pipeline ensure quality releases by implementing CI/CD pipeline in Azure Devops service.

## Description
This project implements CI/CD pipeline using Microsoft Azure. The pipeline starts with deploying the Azure resources using IaC. It then follow by deploying the FakeTestApi app. Then, the pipeline will run the Regression Tests and UI Tests using Postman and Selenium respectively. 

## Getting Started
1. Create an Azure Free Account.
2. Create an Azure Devops Account in [here](https://dev.azure.com).
3. Install visual code editor.
4. Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli).
5. Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Instructions

### Create Storage Account
1. Make sure login your Azure Account in the terminal using:
```
az login
```
2. Run the create_azure_storage_account.sh
3. Copy these values from the terminal:
    - STORAGE_ACCOUNT_NAME
    - CONTAINER_NAME
    - ACCOUNT_KEY
4. Replace these values to the terraform/main.tf

A new resource group named 'tfstate' shall be created. A blob container will be used to keep track the state of the Terraform when provisioning the Azure resources.

Output:
![Storage Account - Terraform](./screens/01_Terraform.png)

### Create Service Principal
1. Create the Service Principal by following the documentation from [Azure](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal).
2. The service principal is an identity created to access the Azure resources.
3. Copy the following settings from the service principal after it had created:
    - Client ID
    - Client Credential/Password
4. Replace these values to the terraform/terraform.tfvars

### Create SSH Key pair
Prior creating the VM, create the [SSH key pair](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys).
The public SSH key allows the Azure Pipeline to access the VM which in turn can perform specify tasks like UI testing in the VM.