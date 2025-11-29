async function sendToContent(action){
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  return chrome.tabs.sendMessage(tab.id, {action});
}

const extractBtn = document.getElementById('extractBtn');
const sendBtn = document.getElementById('sendBtn');
const summaryEl = document.getElementById('summary');
const statusEl = document.getElementById('status');

let draft = null;

extractBtn.addEventListener('click', async () => {
  statusEl.textContent = 'Extracting…';
  try{
    draft = await sendToContent('extract');
    if(!draft || draft.error){
      statusEl.textContent = 'Could not extract from this page.';
      return;
    }
    const key = (k,v)=>`<div><strong>${k}:</strong> ${v ?? ''}</div>`;
    summaryEl.innerHTML = [
      key('Address', draft.address),
      key('Price', draft.price ?? draft.rentMonthly),
      key('Type', draft.type),
      key('MLS', draft.mlsId),
      key('Images', (draft.images||[]).length)
    ].join('');
    sendBtn.disabled = false;
    statusEl.textContent = 'Ready to send.';
  }catch(e){
    statusEl.textContent = 'Error: '+e.message;
  }
});

sendBtn.addEventListener('click', async () => {
  if(!draft) return;
  statusEl.textContent = 'Sending…';
  sendBtn.disabled = true;
  try{
    const {apiBase, token} = await chrome.storage.local.get(['apiBase','token']);
    if(!apiBase || !token){
      statusEl.textContent = 'Open Options to set API URL and token.';
      return;
    }
    const res = await fetch(`${apiBase.replace(/\/$/,'')}/api/import/neon/receive`,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-import-admin-token':token},
      body: JSON.stringify(draft)
    });
    if(!res.ok){
      const t = await res.text();
      statusEl.textContent = 'Server error: '+t;
      return;
    }
    const data = await res.json();
    const href = new URL((data.previewUrl || '/nms-admin#imports'), apiBase).toString();
    const note = data.wrote === true ? `Saved (${data.importsCount||''}).` : (data.wrote===false?`Queued (write pending).`:'Sent.');
    statusEl.innerHTML = `<span class="ok">${note}</span> <a href="${href}" target="_blank">Open Preview</a>`;
  }catch(e){
    statusEl.textContent = 'Error: '+e.message;
  }finally{
    sendBtn.disabled = false;
  }
});


