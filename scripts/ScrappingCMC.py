import requests
import sqlite3
import time

DB_PATH = "./api/cryptos.db"  # Mise à jour du chemin pour pointer vers la base de données existante
INTERVAL = 3  # secondes

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT,
            name TEXT,
            price REAL,
            change24h REAL,
            market_cap REAL,
            timestamp INTEGER
        )
    """)
    conn.commit()
    conn.close()

def fetch_data():
    url = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing"
    params = {
        "start": 1,
        "limit": 500,
        "sortBy": "market_cap",
        "sortType": "desc",
        "convert": "USD"
    }
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    return data["data"]["cryptoCurrencyList"]

def save_to_db(coins):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    now = int(time.time())

    # Vérifie si la table est vide avant de supprimer les données
    cur.execute("SELECT COUNT(*) FROM prices")
    count = cur.fetchone()[0]

    if count > 0:
        print("La table contient déjà des données. Suppression des anciennes données...")
        cur.execute("DELETE FROM prices")

    for c in coins:
        cur.execute("""
            INSERT INTO prices (symbol, name, price, change24h, market_cap, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            c.get("symbol"),
            c.get("name"),
            c["quotes"][0]["price"],
            c["quotes"][0]["percentChange24h"],
            c["quotes"][0]["marketCap"],
            now
        ))

    conn.commit()
    conn.close()

def main():
    init_db()
    print("🔁 Scraping toutes les 3 secondes (écrasement complet à chaque cycle)...\n")
    while True:
        try:
            coins = fetch_data()
            save_to_db(coins)
            print(f"{len(coins)} cryptos mises à jour à {time.strftime('%H:%M:%S')}")
        except Exception as e:
            print("Erreur :", e)
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()
