# פריסה על השרת שלך (self-host)

הבק-אנד רץ על Node (אפס תלות). כדי לחשוף אותו לרשת עם HTTPS צריך:
1. דומיין שמצביע לשרת (A record → `37.60.247.8`)
2. Caddy — reverse proxy עם TLS אוטומטי
3. שירות systemd שמריץ את הבק-אנד

## מצב נוכחי של השרת (נבדק בפועל)

- Node v26.10.0 ✓ (ב-`/home/hermes/.local/bin/node`)
- Caddy/nginx/Docker — **לא מותקנים**
- `systemctl` קיים ✓
- פורט 80/443 — סגור (אין מאזין + ייתכן פירוול)
- sudo — דורש סיסמה (אין גישת sudo אוטומטית)

## שלבי פריסה

### 1. DNS (את עושה בפאנל הדומיין)
צרי רשומת `A` שמצביעה ל-`37.60.247.8`.

### 2. התקנת Caddy (דורש sudo)
```bash
sudo apt-get update && sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy
```

### 3. Caddyfile
עדכני את הדומיין ב-`deploy/Caddyfile`, ואז:
```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 4. שירות הבק-אנד
```bash
sudo cp deploy/connections-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now connections-backend
sudo systemctl status connections-backend
```

### 5. פירוול (אם ufw פעיל)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## אימות
```bash
curl -s http://127.0.0.1:8787/ -o /dev/null -w "%{http_code}\n"   # 401 (שרת חי — דורש auth)
curl -s https://<הדומיין>/ -o /dev/null -w "%{http_code}\n"        # 401 דרך Caddy
```

## מה צריך ממך
1. **שם הדומיין** — בלעדיו אי אפשר להגדיר TLS.
2. **גישת sudo** — או שתעניקי לי sudo ללא סיסמה, או שתריצי את הפקודות למעלה בעצמך.
