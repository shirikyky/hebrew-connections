// נקודת כניסה CLI — מריץ את שרת הבק-אנד.
import { startServer } from './app.js';

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '127.0.0.1';
startServer(port, host).then((s) => {
  console.log(`✓ חיבורים backend מאזין על http://${host}:${s.address().port}`);
});
