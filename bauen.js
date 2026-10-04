// Baut aus index.html, css/ und js/ eine einzige Datei:
//   dist/gefuehlstraeger.html   eigenständige Seite (zum Hochladen oder Einbetten)
//   dist/artefakt.html          dieselbe Seite ohne Kopf, zum Veröffentlichen als Claude-Artefakt
// Aufruf:  node bauen.js
const fs=require('fs'),path=require('path'),hier=__dirname;
let html=fs.readFileSync(path.join(hier,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g,(_,f)=>'<style>\n'+fs.readFileSync(path.join(hier,f),'utf8')+'</style>');
html=html.replace(/<script src="(js\/[^"]+)"><\/script>/g,(_,f)=>'<script>\n'+fs.readFileSync(path.join(hier,f),'utf8')+'</script>');
fs.mkdirSync(path.join(hier,'dist'),{recursive:true});
fs.writeFileSync(path.join(hier,'dist','gefuehlstraeger.html'),html);
const kopf=html.match(/<title>[\s\S]*?(?=<\/head>)/)[0],rumpf=html.match(/<body>\n([\s\S]*)<\/body>/)[1];
fs.writeFileSync(path.join(hier,'dist','artefakt.html'),kopf+rumpf);
console.log('dist/gefuehlstraeger.html',Math.round(html.length/1024)+' KB');
