const apiBaseEl = document.getElementById('apiBase');
const tokenEl = document.getElementById('token');
const statusEl = document.getElementById('status');

chrome.storage.local.get(['apiBase','token'], (cfg)=>{
  if(cfg.apiBase) apiBaseEl.value = cfg.apiBase;
  if(cfg.token) tokenEl.value = cfg.token;
});

document.getElementById('save').addEventListener('click', async ()=>{
  const apiBase = apiBaseEl.value.trim();
  const token = tokenEl.value.trim();
  await chrome.storage.local.set({apiBase, token});
  statusEl.textContent = 'Saved.';
  setTimeout(()=> statusEl.textContent = '', 1500);
});


