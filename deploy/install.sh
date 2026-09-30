#!/usr/bin/env bash
# פריסת "חיבורים" על השרת — מתקין Caddy + מגדיר reverse proxy + מפעיל את הבק-אנד כשירות.
# שימוש (כמשתמש root/sudo):  sudo bash deploy/install.sh <הדומיין>
set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "שימוש: sudo bash deploy/install.sh <הדומיין>"
  echo "דוגמה: sudo bash deploy/install.sh games.shiri.co.il"
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "יש להריץ כ-root: sudo bash deploy/install.sh $DOMAIN"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> [1/4] התקנת Caddy (reverse proxy + TLS אוטומטי)"
apt-get update -y
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update -y
apt-get install -y caddy

echo "==> [2/4] הגדרת Caddyfile עבור $DOMAIN"
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    reverse_proxy 127.0.0.1:8787
}
EOF
systemctl reload caddy

echo "==> [3/4] התקנת שירות הבק-אנד (systemd)"
cp "$SCRIPT_DIR/connections-backend.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now connections-backend

echo "==> [4/4] פתיחת פירוול 80/443 (אם ufw פעיל)"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp
  ufw allow 443/tcp
else
  echo "    (ufw לא פעיל — מדלג; ודאי שפורט 80/443 פתוח בפאנל ה-KVM אם יש פירוול חיצוני)"
fi

echo ""
echo "✓ הפריסה הושלמה."
echo "  בדיקה:  curl -s https://$DOMAIN/ -o /dev/null -w '%{http_code}\n'   (אמור 401)"
echo "  סטטוס:  systemctl status connections-backend"
echo ""
echo "⚠️  ודאי שרשומת DNS מסוג A עבור '$DOMAIN' מצביעה ל-37.60.247.8"
