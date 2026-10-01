/* index.html + css + js + fotoğrafı tek bir beyza-a1.html dosyasında birleştirir.
   Çalıştırma: node scripts/build-standalone.js */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const inlineScript = code => code.replace(/<\/script/gi, "<\\/script");

let html = read("index.html");
const replace = (from, to) => {
  if (!html.includes(from)) throw new Error("index.html içinde bulunamadı: " + from);
  html = html.replace(from, () => to);
};

replace('<link rel="manifest" href="/manifest.json">\n', "");
replace('<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n', "");
replace('<link rel="stylesheet" href="/css/style.css">', `<style>\n${read("css/style.css")}\n</style>`);
const photo = fs.readFileSync(path.join(root, "assets/couple.jpg")).toString("base64");
replace('src="/assets/couple.jpg"', `src="data:image/jpeg;base64,${photo}"`);
replace('<script src="/js/words.js"></script>', `<script>\n${inlineScript(read("js/words.js"))}\n</script>`);
replace('<script src="/js/app.js"></script>', `<script>\n${inlineScript(read("js/app.js"))}\n</script>`);

const banner = "<!-- Bu dosya otomatik üretilir, elle düzenleme: node scripts/build-standalone.js -->\n";
fs.writeFileSync(path.join(root, "beyza-a1.html"), html.replace("<!DOCTYPE html>\n", m => m + banner));
console.log("beyza-a1.html oluşturuldu (" + Math.round(Buffer.byteLength(html) / 1024) + " KB)");
