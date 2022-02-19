# Azure GUIDS
variable "subscription_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "tenant_id" {}

# Resource Group/Location
variable "location" {}
variable "resource_group" {}
variable "application_type" {}

# Network
variable virtual_network_name {}
variable address_prefix_test {}
variable address_space {}

# VM
variable "size" {
  description = "The VM size"
}

variable "admin_user" {
  description = "The admin user for VM"
  default = "azureAdmin"
}

variable "rsa_key_path" {
  description = "Path of public key"
}

