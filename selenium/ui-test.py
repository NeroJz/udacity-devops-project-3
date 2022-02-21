# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import datetime
import logging

logging.basicConfig(
  format='%(asctime)s %(levelname)-8s %(msg)s',
  level=logging.INFO,
  datefmt='%Y-%m-%d %H:%M:%S')

def timestamp():
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return (ts + '\t')

def custom_loging(msg):
  # print("{}: {}".format(timestamp(), msg))
  logging.info(msg)

# Start the browser and login with standard_user
def login (user, password):
    # print ('Starting the browser...')
    # --uncomment when running in Azure DevOps.
    options = ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    # driver = webdriver.Chrome()
    custom_loging("Browser started successfully. Navigating to the demo page to login.")
    driver.get('https://www.saucedemo.com/')

    # Check login
    custom_loging('Start Login: username: {}, password: {}'.format(user, password))
    driver.find_element(By.CSS_SELECTOR, "input[name='user-name']").send_keys(user)
    driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(password)
    driver.find_element(By.ID, "login-button").click()

    custom_loging("Check successfully navigate to inventory.html")
    # By comparing the Page Label
    testLabel = "products"
    pageLabel = driver.find_element(By.CSS_SELECTOR, "#header_container .header_secondary_container .title").text
    custom_loging("inventory.html label: {}".format(pageLabel))
    assert testLabel == pageLabel.lower(), "The label should be 'PRODUCTS'"

    custom_loging("Login successfully")
    return driver


def addItem(driver):
  custom_loging("Test adding item to cart")
  items = driver.find_elements(By.CSS_SELECTOR, '.inventory_item')

  for i in range(0, len(items)):
    item = items[i]

    item_name = item.find_element(By.CLASS_NAME, 'inventory_item_name').text
    custom_loging("Add item: {}".format(item_name))
    button = item.find_element(By.CSS_SELECTOR, '.pricebar > button')
    button.click()

  totalItemOnCartLabel = driver.find_element(By.CLASS_NAME, 'shopping_cart_badge').text
  testItemAdded = "6"

  custom_loging("Total tested item added to cart: {}".format(testItemAdded))
  custom_loging("Total item added to cart: {}".format(totalItemOnCartLabel))
  assert testItemAdded == totalItemOnCartLabel, "Total added item on cart not matched"

  custom_loging("All item added to cart successfully")
  return driver


def removeItem(driver):
  custom_loging("Test remove item from the cart")
  items = driver.find_elements(By.CSS_SELECTOR, '.inventory_item')

  for i in range(0, len(items)):
    item = items[i]

    item_name = item.find_element(By.CLASS_NAME, 'inventory_item_name').text
    custom_loging("Remove item: {}".format(item_name))
    button = item.find_element(By.CSS_SELECTOR, '.pricebar > button')
    button.click()
  
  totalItemOnCartLabel = driver.find_element(By.CLASS_NAME, 'shopping_cart_link').text
  testItemRemove = "6"

  custom_loging("Total tested item remove from the to cart: {}".format(testItemRemove))
  assert "" == totalItemOnCartLabel, "Total added item on cart not matched"

  custom_loging("All item removed from cart successfully")
  return driver


if __name__ == "__main__":
  driver = login('standard_user', 'secret_sauce')
  addItem(driver)
  removeItem(driver)

  custom_loging("UI Tests are successfully completed")

