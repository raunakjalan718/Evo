/* Front-end mock demo:
   - maps symptom keywords to sample differentials
   - shows confidences + rationale chips
   - fetches demo presets from /data/demo-presets.json (optional)
*/
const el = sel => document.querySelector(sel);

const SAMPLE_MAP = {
  "cough sore throat nasal": [
    {dx:"Upper respiratory infection", p:0.42, why:["cough","throat irritation","nasal congestion"], next:"Fluids, rest; red-flags: dyspnea, high fever"},
    {dx:"Strep throat", p:0.21, why:["sore throat","fever"], next:"Rapid antigen if exudate/fever"},
    {dx:"Allergic rhinitis", p:0.17, why:["nasal congestion","sneezing"], next:"Trial antihistamine"}
  ],
  "chest pain shortness breath": [
    {dx:"Pneumonia", p:0.31, why:["chest pain","fever","productive cough"], next:"CXR if focal signs"},
    {dx:"Anxiety/panic", p:0.22, why:["dyspnea","non-exertional"], next:"Rule out cardiac first"},
    {dx:"GERD", p:0.16, why:["burning pain"], next:"PPI trial; alarm sx → endoscopy"}
  ],
  "fever rash joint pain": [
    {dx:"Viral exanthem", p:0.37, why:["fever","rash"], next:"Supportive care"},
    {dx:"Lyme disease", p:0.18, why:["rash","arthralgia"], next:"Consider ELISA if exposure"}
  ]
};

function normalize(text){
  return text.toLowerCase().replace(/[^a-z\s,]/g,'').replace(/\s+/g,' ').trim();
}
function suggestFrom(text){
  const key = Object.keys(SAMPLE_MAP).find(k => k.split(' ').every(tok => text.includes(tok)));
  return key ? SAMPLE_MAP[key] : [
    {dx:"No strong pattern — needs clinical review", p:0.34, why:["insufficient features"], next:"Add more symptoms / vitals"},
    {dx:"Viral URI", p:0.18, why:["common cluster"], next:"Supportive care"},
  ];
}

window.addEventListener('DOMContentLoaded', () => {
  const input = el('#symptomsInput');
  const btn = el('#demoSuggest');
  const clr = el('#demoClear');
  const res = el('#demoResults');
  const loading = el('#demoLoading');

  btn.addEventListener('click', () => {
    const text = normalize(input.value || '');
    if (!text){ input.focus(); return; }
    loading.hidden = false; res.innerHTML = '';
    setTimeout(() => {
      const items = suggestFrom(text);
      loading.hidden = true;
      items.forEach(item => {
        const card = document.createElement('div'); card.className='result-card';
        card.innerHTML = `
          <div>
            <div class="result-meta"><strong>${item.dx}</strong> <span class="badge">${(item.p*100|0)}%</span></div>
            <div class="chips">${item.why.map(w=>`<span class="badge">${w}</span>`).join(' ')}</div>
          </div>
          <div class="badge">${item.next}</div>
        `;
        res.appendChild(card);
      });
    }, 700); // fake latency
  });

  clr.addEventListener('click', () => {
    input.value = ''; res.innerHTML=''; loading.hidden=true;
  });
});
