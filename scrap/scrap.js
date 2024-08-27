// copy outerhtml of the 3 divs class - "h2h__section section" in input.html + add "scrap.js" at bottom
// save the scrap json here in "?????????????????????" folder to be parsed in node app

let saveAsFile = (filename, dataObject) => {
  let blob = new Blob([JSON.stringify(dataObject)], { type: 'text/json' });
  let link = document.createElement('a');
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

  let evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  link.dispatchEvent(evt);
  link.remove();
};

document.addEventListener('DOMContentLoaded', () => {
  let dataToExport = [];
  let rows = document.querySelectorAll('.h2h__row');
  rows.forEach((row) => {
    let meci = {
      matchDate: row.querySelector('.h2h__date').innerHTML.replace(/(\d{2})\.(\d{2})\.(\d{2})/, '20$3-$2-$1'),
      event: row.querySelector('.h2h__event').getAttribute('title'),
      home: row.querySelector('.h2h__homeParticipant .h2h__participantInner').innerHTML,
      away: row.querySelector('.h2h__awayParticipant .h2h__participantInner').innerHTML,
      homeScore: row.querySelector('.h2h__result').firstElementChild.innerHTML,
      awayScore: row.querySelector('.h2h__result').lastElementChild.innerHTML,
    };
    dataToExport.push(meci);
    row.remove();
  });

  saveAsFile('export.json', dataToExport);
});
