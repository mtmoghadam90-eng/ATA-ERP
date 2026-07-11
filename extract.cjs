const fs = require('fs');
const content = fs.readFileSync('recovered_file.js', 'utf8');
const match = content.match(/sourceMappingURL=data:application\/json;base64,(.*)$/);
if (match) {
  const json = Buffer.from(match[1], 'base64').toString('utf8');
  const sourcemap = JSON.parse(json);
  fs.writeFileSync('src/components/PackagingDeliveryView.tsx', sourcemap.sourcesContent[0]);
  console.log('Recovered!');
}
