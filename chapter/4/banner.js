(function(){
  "use strict";
  var isFrench = window.location.pathname.indexOf("/fr/") === 0;
  var chapterPath = isFrench ? "/fr/chapter/4/" : "/chapter/4/";
  var titleText = isFrench ? "04.anniversaire de tifa" : "04.tifa's birthday";
  var subtitleText = isFrench ? "Chapitre spécial" : "Special Chapter";
  var pageText = "8 pages";

  function activateChapterFour(){
    var lockedCard = document.querySelector('.chapters-button[data-index="3"]');
    var activeCard = document.querySelector('.chapters-button[data-index="2"]');
    if(!lockedCard || !activeCard || lockedCard.classList.contains("chapter4-card")) return;

    var card = activeCard.cloneNode(true);
    card.dataset.index = "3";
    card.classList.add("chapter4-card");
    card.querySelectorAll("a").forEach(function(link){
      link.href = chapterPath;
      link.setAttribute("aria-label", isFrench ? "Lire le chapitre anniversaire de Tifa" : "Read Tifa's birthday chapter");
    });

    var title = card.querySelector(".chapters-button__title .chapters-button__text-inner");
    var subtitle = card.querySelector(".chapters-button__subtitle .chapters-button__text-inner");
    var timecode = card.querySelector(".chapters-button__timecode .chapters-button__text-inner");
    if(title) title.textContent = titleText;
    if(subtitle) subtitle.textContent = subtitleText;
    if(timecode) timecode.textContent = pageText;
    lockedCard.replaceWith(card);
  }

  function scheduleActivation(){
    if(document.readyState === "complete") window.setTimeout(activateChapterFour, 0);
    else window.addEventListener("load", activateChapterFour, {once:true});
  }
  scheduleActivation();
})();
