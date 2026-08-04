/* ===================================================================
   KEMET — Culture Day — behaviour
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. VIEW SWITCHING  (only one of the 6 sections + home is visible)
  --------------------------------------------------------------- */
  const views = document.querySelectorAll('.view');
  const navlinks = document.querySelectorAll('.navlink');
  const doors = document.querySelectorAll('.door');
  const brandBtn = document.querySelector('.brand');
  const mainnav = document.querySelector('.mainnav');
  const navtoggle = document.querySelector('.navtoggle');

  function showView(name){
    views.forEach(v => v.classList.toggle('is-active', v.dataset.view === name));
    navlinks.forEach(n => n.classList.toggle('is-active', n.dataset.target === name));
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainnav.classList.remove('is-open');
    navtoggle.setAttribute('aria-expanded', 'false');
    positionIndicator(document.querySelector(`.navlink.is-active`));
  }

  navlinks.forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.target));
  });
  doors.forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.target));
  });
  brandBtn.addEventListener('click', () => showView('home'));

  navtoggle.addEventListener('click', () => {
    const open = mainnav.classList.toggle('is-open');
    navtoggle.setAttribute('aria-expanded', String(open));
  });

  /* ---------------------------------------------------------------
     2. NAV UNDERLINE — the small line under the hovered/active item
  --------------------------------------------------------------- */
  const indicator = document.querySelector('.nav-indicator');

  function positionIndicator(el){
    if (!el || window.innerWidth <= 900){
      indicator.classList.remove('is-visible');
      return;
    }
    const navRect = mainnav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    indicator.style.width = elRect.width + 'px';
    indicator.style.transform = `translateX(${elRect.left - navRect.left}px)`;
    indicator.classList.add('is-visible');
  }

  navlinks.forEach(btn => {
    btn.addEventListener('mouseenter', () => positionIndicator(btn));
    btn.addEventListener('focus', () => positionIndicator(btn));
  });
  mainnav.addEventListener('mouseleave', () => {
    positionIndicator(document.querySelector('.navlink.is-active'));
  });
  window.addEventListener('resize', () => {
    positionIndicator(document.querySelector('.navlink.is-active'));
  });

  /* ---------------------------------------------------------------
     3. THE SCRIBE'S DESK — name → Arabic calligraphy + hieroglyphs
  --------------------------------------------------------------- */
  const nameInput = document.getElementById('nameInput');
  const arabicOutput = document.getElementById('arabicOutput');
  const hieroOutput = document.getElementById('hieroOutput');

  // 24 genuine Gardiner uniliteral signs (Unicode Egyptian Hieroglyphs block)
  const HIERO_MAP = {
    A: '\u1313F', // G1  vulture        a
    B: '\u130C0', // D58 foot           b
    C: '\u133A1', // V31 basket         k  (approx.)
    D: '\u130A7', // D46 hand           d
    E: '\u131CB', // M17 reed leaf      i  (approx.)
    F: '\u13191', // I9  horned viper   f
    G: '\u133BC', // W11 jar stand      g
    H: '\u13254', // O4  reed shelter   h
    I: '\u131CB', // M17 reed leaf      i
    J: '\u13193', // I10 cobra          dj (approx.)
    K: '\u133A1', // V31 basket         k
    L: '\u130ED', // E23 lion           rw (approx. — Egyptian had no true L)
    M: '\u13153', // G17 owl            m
    N: '\u13216', // N35 water ripple   n
    O: '\u13171', // G43 quail chick    w  (approx.)
    P: '\u132AA', // Q3  stool          p
    Q: '\u1320E', // N29 hill           q
    R: '\u1308B', // D21 mouth          r
    S: '\u13283', // O34 door bolt      s
    T: '\u133CF', // X1  bread loaf     t
    U: '\u13171', // G43 quail chick    w  (approx.)
    V: '\u13191', // I9  horned viper   f  (approx. — no true V)
    W: '\u13171', // G43 quail chick    w
    X: '\u1340D', // Aa1 sieve          kh (approx.)
    Y: '\u133ED', // Z4  two strokes    y
    Z: '\u13283'  // O34 door bolt      s/z
  };

  function toHieroglyphs(raw){
    const letters = raw.toUpperCase().replace(/[^A-Z]/g, '').split('');
    if (!letters.length) return '𓇋𓋴𓅓';
    return letters.map(ch => HIERO_MAP[ch] || '').join('');
  }

  // Simple, greedy, longest-match phonetic transliteration to Arabic.
  // Digraphs first, then single letters. Approximate by design.
  const AR_DIGRAPHS = [
    ['kh', 'خ'], ['gh', 'غ'], ['sh', 'ش'], ['ch', 'تش'],
    ['th', 'ث'], ['ph', 'ف'], ['ck', 'ك'],
    ['oo', 'و'], ['ee', 'ي'], ['ou', 'و'],
    ['ay', 'اي'], ['ai', 'اي']
  ];
  const AR_SINGLE = {
    a:'ا', b:'ب', c:'ك', d:'د', e:'ي', f:'ف', g:'ج', h:'ه',
    i:'ي', j:'ج', k:'ك', l:'ل', m:'م', n:'ن', o:'و', p:'ب',
    q:'ق', r:'ر', s:'س', t:'ت', u:'و', v:'ف', w:'و', x:'كس',
    y:'ي', z:'ز'
  };

  function toArabic(raw){
    const clean = raw.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return 'اسمك هنا';
    let out = '';
    let i = 0;
    outer:
    while (i < clean.length){
      for (const [pat, ar] of AR_DIGRAPHS){
        if (clean.startsWith(pat, i)){
          out += ar;
          i += pat.length;
          continue outer;
        }
      }
      out += AR_SINGLE[clean[i]] || '';
      i += 1;
    }
    return out;
  }

  function updateScribe(){
    const val = nameInput.value.trim();
    hieroOutput.textContent = toHieroglyphs(val);
    arabicOutput.textContent = toArabic(val);
  }
  nameInput.addEventListener('input', updateScribe);
  updateScribe();

  /* ---------------------------------------------------------------
     4. GODS & SYMBOLS — animated inline-SVG pantheon
  --------------------------------------------------------------- */
  const pantheon = [
    {
      name: 'Ra', domain: 'Sun & Creation',
      info: 'The sun god, who sailed across the sky by day and through the underworld by night, battling chaos to rise again every dawn.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-glow" style="animation:glow-pulse 3.2s ease-in-out infinite">
        <circle cx="50" cy="50" r="19" fill="var(--gold)"/>
        ${[0,45,90,135,180,225,270,315].map(a=>`<line x1="50" y1="50" x2="${50+34*Math.cos(a*Math.PI/180)}" y2="${50+34*Math.sin(a*Math.PI/180)}" stroke="var(--gold)" stroke-width="3.5" stroke-linecap="round" transform="translate(0,0)"/>`).join('')}
        </g></svg>`
    },
    {
      name: 'Osiris', domain: 'Afterlife & Rebirth',
      info: 'Lord of the underworld and judge of the dead, killed and resurrected — the god who made eternal life possible for every Egyptian after him.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-drift" style="animation:drift-y 3.6s ease-in-out infinite">
        <path d="M30 30 Q18 40 30 50" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <line x1="30" y1="30" x2="30" y2="70" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="30" x2="72" y2="42" stroke="var(--turquoise)" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="30" x2="60" y2="70" stroke="var(--turquoise)" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="30" x2="48" y2="42" stroke="var(--turquoise)" stroke-width="4" stroke-linecap="round"/>
        </g></svg>`
    },
    {
      name: 'Isis', domain: 'Magic & Motherhood',
      info: 'The great enchantress, who pieced her husband Osiris back together with magic and protected her son Horus until he could claim his throne.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-shimmer" style="animation:shimmer 3s ease-in-out infinite">
        <path d="M50 20 C20 30 15 55 30 78" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M50 20 C80 30 85 55 70 78" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="42" y="14" width="16" height="14" fill="var(--turquoise)"/>
        <line x1="50" y1="28" x2="50" y2="78" stroke="var(--turquoise)" stroke-width="4"/>
        </g></svg>`
    },
    {
      name: 'Horus', domain: 'Sky & Kingship',
      info: 'The falcon god of the sky, whose eyes were said to be the sun and moon — every living pharaoh was considered his earthly embodiment.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-rotate" style="animation:gentle-rotate 3.4s ease-in-out infinite; transform-origin:50px 55px">
        <circle cx="50" cy="38" r="10" fill="var(--gold)"/>
        <path d="M40 45 Q10 40 8 62 Q28 58 42 52" fill="var(--turquoise)"/>
        <path d="M60 45 Q90 40 92 62 Q72 58 58 52" fill="var(--turquoise)"/>
        <path d="M50 48 L44 72 L56 72 Z" fill="var(--gold)"/>
        </g></svg>`
    },
    {
      name: 'Anubis', domain: 'Embalming & the Afterlife Journey',
      info: 'The jackal-headed god of mummification, who guided souls through the underworld and weighed their hearts against the feather of truth.',
      svg: `<svg viewBox="0 0 100 100"><g>
        <path d="M50 20 L38 45 L50 40 L62 45 Z" fill="var(--gold)"/>
        <path d="M40 40 Q35 60 45 75 L50 85 L55 75 Q65 60 60 40 Q50 34 40 40 Z" fill="var(--lapis-2)" stroke="var(--gold)" stroke-width="2.5"/>
        <path d="M50 55 L36 62 L46 66 Z" fill="var(--gold)"/>
        <circle class="anim-glow" cx="43" cy="52" r="2.6" fill="var(--turquoise)" style="animation:glow-pulse 2.4s ease-in-out infinite"/>
        <circle class="anim-glow" cx="57" cy="52" r="2.6" fill="var(--turquoise)" style="animation:glow-pulse 2.4s ease-in-out infinite"/>
        </g></svg>`
    },
    {
      name: 'Thoth', domain: 'Wisdom & Writing',
      info: 'The ibis-headed god of writing, wisdom and the moon, credited with inventing hieroglyphs and recording the verdict at every judgment of the dead.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-drift" style="animation:drift-y 4s ease-in-out infinite">
        <path d="M35 24 Q10 20 8 32 Q28 34 40 42" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="46" cy="46" r="14" fill="var(--lapis-2)" stroke="var(--gold)" stroke-width="2.5"/>
        <path d="M62 30 A14 14 0 0 1 62 54 A10 10 0 0 0 62 30" fill="var(--turquoise)"/>
        </g></svg>`
    },
    {
      name: 'Bastet', domain: 'Protection & the Home',
      info: 'The cat goddess who guarded the household, women and children — cats were so sacred to her that harming one was once a capital offence.',
      svg: `<svg viewBox="0 0 100 100"><g>
        <path d="M35 30 L44 44 L28 44 Z" fill="var(--gold)"/>
        <path d="M65 30 L56 44 L72 44 Z" fill="var(--gold)"/>
        <ellipse cx="50" cy="52" rx="18" ry="16" fill="var(--lapis-2)" stroke="var(--gold)" stroke-width="2.5"/>
        <path class="anim-rotate" d="M64 62 Q88 60 84 40" stroke="var(--turquoise)" stroke-width="4" fill="none" stroke-linecap="round" style="animation:gentle-rotate 2.6s ease-in-out infinite; transform-origin:64px 62px"/>
        </g></svg>`
    },
    {
      name: 'Sekhmet', domain: 'War & Healing',
      info: 'The lioness goddess of war, plague and healing in one — worshipped as fiercely protective, and appealed to for both destruction and cures.',
      svg: `<svg viewBox="0 0 100 100"><g>
        <circle cx="50" cy="30" r="9" fill="var(--gold)"/>
        ${[20,55,90,125,160,200,235,270,305,340].map(a=>`<line class="anim-flicker" x1="50" y1="50" x2="${50+30*Math.cos(a*Math.PI/180)}" y2="${50+30*Math.sin(a*Math.PI/180)}" stroke="var(--carnelian)" stroke-width="3" stroke-linecap="round" style="animation:flicker 1.6s ease-in-out infinite; transform-origin:50px 50px"/>`).join('')}
        <circle cx="50" cy="50" r="15" fill="var(--lapis-2)" stroke="var(--gold)" stroke-width="2.5"/>
        </g></svg>`
    },
    {
      name: 'Ankh', domain: 'Symbol · Life', symbol: true,
      info: 'The looped cross meaning "life" — held in the hands of gods and offered to pharaohs as the breath of eternal existence.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-glow" style="animation:glow-pulse 3s ease-in-out infinite">
        <circle cx="50" cy="30" r="15" fill="none" stroke="var(--gold)" stroke-width="6"/>
        <line x1="50" y1="45" x2="50" y2="85" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>
        <line x1="30" y1="58" x2="70" y2="58" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>
        </g></svg>`
    },
    {
      name: 'Eye of Horus', domain: 'Symbol · Protection & Health', symbol: true,
      info: 'The Wedjat eye, worn as an amulet for protection and healing — its fractional parts were even used by scribes as measurement notation.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-blink" style="animation:blink 4.5s ease-in-out infinite; transform-origin:50px 45px">
        <path d="M14 45 Q50 22 86 45 Q50 60 14 45 Z" fill="var(--turquoise)" stroke="var(--gold)" stroke-width="2.5"/>
        <circle cx="50" cy="45" r="9" fill="var(--night)"/>
        <path d="M14 45 Q6 50 4 62" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M50 60 L46 78 L54 78 Z" fill="var(--gold)"/>
        <path d="M78 46 Q90 40 92 30" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g></svg>`
    },
    {
      name: 'Scarab', domain: 'Symbol · Rebirth & Renewal', symbol: true,
      info: 'The dung beetle became a symbol of rebirth: Egyptians watched it roll its ball across the sand and saw the sun god rolling the sun across the sky.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-shimmer" style="animation:shimmer 2.8s ease-in-out infinite">
        <ellipse cx="50" cy="55" rx="24" ry="20" fill="var(--carnelian)" stroke="var(--gold)" stroke-width="2.5"/>
        <line x1="50" y1="38" x2="50" y2="72" stroke="var(--gold)" stroke-width="2.5"/>
        <path d="M30 40 Q50 26 70 40" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${[36,50,64].map(x=>`<line x1="${x}" y1="70" x2="${x-8}" y2="82" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>`).join('')}
        </g></svg>`
    },
    {
      name: 'Was Scepter', domain: 'Symbol · Power & Dominion', symbol: true,
      info: 'A staff topped with an animal head, carried by gods and kings as a mark of authority and control over the forces of chaos.',
      svg: `<svg viewBox="0 0 100 100"><g class="anim-drift" style="animation:drift-y 3.2s ease-in-out infinite">
        <line x1="50" y1="20" x2="50" y2="80" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>
        <path d="M50 20 Q40 8 34 18" stroke="var(--gold)" stroke-width="5" fill="none" stroke-linecap="round"/>
        <line x1="50" y1="80" x2="40" y2="92" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>
        <line x1="50" y1="80" x2="60" y2="92" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>
        </g></svg>`
    }
  ];

  const grid = document.getElementById('pantheonGrid');
  grid.innerHTML = pantheon.map(g => `
    <article class="gcard">
      <div class="gcard-icon">${g.svg}</div>
      <div class="gcard-body">
        <h3>${g.name}</h3>
        <span class="gcard-domain">${g.domain}</span>
        <p>${g.info}</p>
      </div>
    </article>
  `).join('');

});
