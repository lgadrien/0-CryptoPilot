from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

# Configuration du navigateur (mode sans interface)
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Lance Chrome
driver = webdriver.Chrome(options=options)
driver.get("https://coinmarketcap.com/fr/")

# Attends le chargement initial
time.sleep(5)

# Scroll plusieurs fois pour charger plus de lignes
for _ in range(10):  # augmente la valeur pour plus de cryptos
    driver.execute_script("window.scrollBy(0, 2000);")
    time.sleep(1.5)

# Parse le HTML après chargement
soup = BeautifulSoup(driver.page_source, "html.parser")

# Récupère les symboles et valeurs
symbols = [p.get_text(strip=True) for p in soup.select("p[class*='coin-item-symbol']")]
divs = soup.select("div[class*='eAphWs']")

for i, div in enumerate(divs):
    spans = [span.get_text(strip=True) for span in div.find_all("span")]
    if i < len(symbols):
        print(f"{symbols[i]}: {spans}")
    else:
        print(spans)

driver.quit()
