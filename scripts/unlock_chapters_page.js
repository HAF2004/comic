const fs = require('fs');

function unlockChaptersPage(filePath, isFr) {
  let html = fs.readFileSync(filePath, 'utf8');
  const target = '<div class="chapters-button chapters-button--locked" data-index="3">';
  const endTarget = 'data-index="4"';

  const startIdx = html.indexOf(target);
  if (startIdx === -1) {
    console.log(filePath + ': already unlocked or target not found');
    return;
  }

  const nextIdx = html.indexOf(endTarget, startIdx);
  const closingIdx = html.lastIndexOf('</div></div></div>', nextIdx);
  const oldSnippet = html.substring(startIdx, closingIdx + 18);

  const prefix = isFr ? '/fr/chapter/4' : '/chapter/4';
  const title = isFr ? '04.Un anniversaire pour Tifa' : '04.A Birthday for Tifa';

  const newSnippet = `<div class="chapters-button" data-index="3"><div class="chapters-button__container"><a href="${prefix}" class=""><svg class="chapters-button__icon" width="112" height="129" viewBox="0 0 112 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M111.67 64.32L56.1 96.71L0.27 128.64L0 64.32L0.27 0L56.1 31.93L111.67 64.32Z" fill="#FDEDE2"></path></svg></a><a href="${prefix}" class=""><div class="chapters-button__texts"><div class="chapters-button__title-container"><span class="chapters-button__title"><span class="chapters-button__text-inner">${title}</span></span></div><span class="chapters-button__subtitle"><span class="chapters-button__text-inner">PonponMania Vol. I</span></span><span class="chapters-button__timecode"><span class="chapters-button__text-inner">04:08</span></span></div></a><div class="chapters-button__navigation"><svg width="34" height="37" viewBox="0 0 34 37" fill="none" class="" xmlns="http://www.w3.org/2000/svg"><path d="M33.6 18.24L17.2 28.98L0.79 36.8L0.71 18.24L0.79 0L17.2 9.22L33.6 18.24Z" fill="#FDEDE2"></path></svg></div></div></div>`;

  html = html.substring(0, startIdx) + newSnippet + html.substring(closingIdx + 18);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully unlocked button in ' + filePath);
}

unlockChaptersPage('chapters/index.html', false);
unlockChaptersPage('fr/chapters/index.html', true);
