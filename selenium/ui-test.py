# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import datetime

def timestamp():
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return (ts + '\t')

def logging(msg):
  print("{}: {}".format(timestamp(), msg))

# Start the browser and login with standard_user
def login (user, password):
    print ('Starting the browser...')
    # --uncomment when running in Azure DevOps.
    options = ChromeOptions()
    options.add_argument("--headless") 
    driver = webdriver.Chrome(options=options)
    driver = webdriver.Chrome()
    logging("Browser started successfully. Navigating to the demo page to login.")
    driver.get('https://www.saucedemo.com/')

    # Check login
    logging('Start Login: username: {}, password: {}'.format(user, password))
    driver.find_element(By.CSS_SELECTOR, "input[name='user-name']").send_keys(user)
    driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(password)
    driver.find_element(By.ID, "login-button").click()

    logging("Check successfully navigate to inventory.html")
    # By comparing the Page Label
    testLabel = "products"
    pageLabel = driver.find_element(By.CSS_SELECTOR, "#header_container .header_secondary_container .title").text
    logging("inventory.html label: {}".format(pageLabel))
    assert testLabel == pageLabel.lower(), "The label should be 'PRODUCTS'"

    logging("Login successfully")
    return driver


def addItem(driver):
  logging("Test adding item to cart")
  buttons = driver.find_elements(By.CSS_SELECTOR, '.inventory_item_description > .pricebar > button')

  for i in range(0, len(buttons)):
    logging("Add item {} ({}) to cart".format(i+1, buttons[i]))
    buttons[i].click()

  totalItemOnCartLabel = driver.find_element(By.CLASS_NAME, 'shopping_cart_badge').text
  testItemAdded = "6"

  logging("Total tested item added to cart: {}".format(testItemAdded))
  logging("Total item added to cart: {}".format(totalItemOnCartLabel))
  assert testItemAdded == totalItemOnCartLabel, "Total added item on cart not matched"

  logging("All item added to cart successfully")
  return driver


def removeItem(driver):
  logging("Test remove item from the cart")
  buttons = driver.find_elements(By.CSS_SELECTOR, '.inventory_item_description > .pricebar > button')

  for i in range(0, len(buttons)):
    logging("Remove item {} ({}) from the cart".format(i+1, buttons[i]))
    buttons[i].click()
  
  totalItemOnCartLabel = driver.find_element(By.CLASS_NAME, 'shopping_cart_link').text
  testItemRemove = "6"

  logging("Total tested item remove from the to cart: {}".format(testItemRemove))
  assert "" == totalItemOnCartLabel, "Total added item on cart not matched"

  logging("All item removed from cart successfully")
  return driver


if __name__ == "__main__":
  driver = login('standard_user', 'secret_sauce')
  addItem(driver)
  removeItem(driver)

  logging("UI Tests are successfully completed")

