const fs = require("fs");

const c = fs.readFileSync("reference.html", "utf8");
const start = c.indexOf('id="rec827148828"');
const end = c.indexOf('id="rec827283363"');
const part = c.slice(start, end > start ? end : undefined);

const shapeRe =
  /data-elem-id='(\d+)'[\s\S]*?data-elem-type='shape'[\s\S]*?data-field-top-value="([^"]+)"[\s\S]*?data-field-left-value="([^"]+)"[\s\S]*?background-image:url\('([^']+)'\)/g;
const textRe =
  /data-elem-id='(\d+)'[\s\S]*?data-elem-type='text'[\s\S]*?data-field-top-value="([^"]+)"[\s\S]*?data-field-left-value="([^"]+)"[\s\S]*?<div class='tn-atom'[^>]*>([^<]+)<\/div>/g;

const shapes = [...part.matchAll(shapeRe)].map((m) => ({
  id: m[1],
  top: Number(m[2]),
  left: Number(m[3]),
  img: m[4].split("/").pop(),
}));

const texts = [...part.matchAll(textRe)]
  .map((m) => ({
    id: m[1],
    top: Number(m[2]),
    left: Number(m[3]),
    txt: m[4].replace(/\s+/g, " ").trim(),
  }))
  .filter((t) => /^[А-ЯЁ\s]{6,}$/.test(t.txt));

console.log(
  JSON.stringify(
    {
      shapes: shapes.sort((a, b) => a.top - b.top || a.left - b.left),
      texts: texts.sort((a, b) => a.top - b.top || a.left - b.left),
    },
    null,
    2
  )
);
