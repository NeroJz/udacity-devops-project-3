resource "azurerm_network_interface" "main" {
  name                = "${var.name}-${var.application_type}-nic"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.public_ip_address_id
  }
}

resource "azurerm_linux_virtual_machine" "main" {
  name                = "${var.name}-${var.application_type}-vm"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"
  size                = "${var.size}"
  admin_username      = "${var.admin_username}"
  network_interface_ids = [azurerm_network_interface.main.id]
  admin_ssh_key {
    username   = "${var.admin_username}"
    public_key = file("${var.rsa_public_key_path}")
  }
  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }
}