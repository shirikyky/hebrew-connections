// נקודת כניסה CLI — מריץ את שרת הבק-אנד.
import { startServer } from './app.js';

const port = Number(process.env.PORT || 8787);
startServer(port).then((s) => {
  console.log(`✓ חיבורים backend מאזין על :${s.address().port}`);
});
