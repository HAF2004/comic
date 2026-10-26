const fs = require('fs');

function generateChapter4Shell(sourcePath, targetPath, isFr) {
  let html = fs.readFileSync(sourcePath, 'utf8');

  if (isFr) {
    html = html.replace(/#3: Sheep Don&#x27;t Sleep/g, '#4: Un anniversaire pour Tifa');
    html = html.replace(/#3: Sheep Don't Sleep/g, '#4: Un anniversaire pour Tifa');
    html = html.replace(/03\.\s*sheep don&#39;t sleep/g, '04. Un anniversaire pour Tifa');
    html = html.replace(/03\.sheep don&#39;t sleep/g, '04.Un anniversaire pour Tifa');
    html = html.replace(/\/fr\/chapter\/3/g, '/fr/chapter/4');
  } else {
    html = html.replace(/#3: Sheep Don&#x27;t Sleep/g, '#4: A Birthday for Tifa');
    html = html.replace(/#3: Sheep Don't Sleep/g, '#4: A Birthday for Tifa');
    html = html.replace(/03\.\s*sheep don&#39;t sleep/g, '04. A Birthday for Tifa');
    html = html.replace(/03\.sheep don&#39;t sleep/g, '04.A Birthday for Tifa');
    html = html.replace(/\/chapter\/3/g, '/chapter/4');
  }

  // Cover image
  html = html.replace(/\/images\/album-3-sm\.jpg/g, '/images/album-4-sm.jpg');

  // Timecode
  html = html.replace(/03:01/g, '04:01');

  // Next chapter URL in timeline
  if (isFr) {
    html = html.replace(/\/fr\/chapter\/4"/g, '/fr/chapter/4"');
  }

  // Write target
  fs.mkdirSync(require('path').dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, html, 'utf8');
  console.log('Successfully generated ' + targetPath + ' (' + html.length + ' bytes)');
}

generateChapter4Shell('chapter/3/index.html', 'chapter/4/index.html', false);
generateChapter4Shell('fr/chapter/3/index.html', 'fr/chapter/4/index.html', true);
