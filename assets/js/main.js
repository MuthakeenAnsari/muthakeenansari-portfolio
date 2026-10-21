/* Portfolio behavior: navigation, Skills Explorer, certifications, scroll progress and decorative effects. */
(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(pointer:fine)').matches;
const root=document.documentElement;root.classList.add('js');$('#year').textContent=String(new Date().getFullYear());
/* Responsive navigation */
const nav=$('#primary-nav'),menu=$('#menu-toggle');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
document.addEventListener('click',e=>{if(!nav.classList.contains('open'))return;if(nav.contains(e.target)||menu.contains(e.target))return;closeMenu()});
const desktopNav=window.matchMedia('(min-width:1101px)');
if(desktopNav.addEventListener){desktopNav.addEventListener('change',e=>{if(e.matches)closeMenu()})}
const navLinks=$$('nav a');
if('IntersectionObserver'in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active){a.setAttribute('aria-current','location')}else{a.removeAttribute('aria-current')}})}),{rootMargin:'-36% 0px -55% 0px'});$$('main section[id]').forEach(s=>navObserver.observe(s));}
/* Progressive reveal: no content remains hidden if observer support is missing. */
if('IntersectionObserver'in window&&!reduced.matches){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.1});$$('.reveal').forEach((el,i)=>{el.classList.add('ready');el.style.transitionDelay=(i%3)*25+'ms';revealObserver.observe(el)});const tl=$('#timeline');if(tl){const timelineObserver=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){tl.classList.add('visible');timelineObserver.disconnect()}}),{threshold:.2});timelineObserver.observe(tl)}}
/* Scroll progress: read document geometry only on resize/content changes, not on every scroll frame. */
let progressFrame=0,scrollRange=1;const progress=$('#progress');
function refreshScrollRange(){scrollRange=Math.max(1,document.documentElement.scrollHeight-innerHeight)}
refreshScrollRange();addEventListener('resize',refreshScrollRange,{passive:true});addEventListener('load',refreshScrollRange,{once:true});
if('ResizeObserver'in window){const pageSizeObserver=new ResizeObserver(()=>refreshScrollRange());pageSizeObserver.observe(document.body)}
addEventListener('scroll',()=>{if(progressFrame)return;progressFrame=requestAnimationFrame(()=>{progress.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/scrollRange))})`;progressFrame=0})},{passive:true});
/* Delegated pointer tracking: cache bounds, coalesce mouse work to one animation frame, and avoid layout reads while scrolling. */
const magnetSelector='.btn:not(.menu-toggle),.magnetic:not(.menu-toggle),.magnetic-card,.skill-btn,.contact-action';
let activeMagnet=null,activeRect=null,magnetFrame=0,pointerX=0,pointerY=0;
function releaseMagnet(){if(activeMagnet){activeMagnet.style.translate='';activeMagnet.style.setProperty('--mx','50%');activeMagnet.style.setProperty('--my','50%')}activeMagnet=null;activeRect=null}
function setMagnetTarget(target){if(target===activeMagnet)return;if(activeMagnet)activeMagnet.style.translate='';activeMagnet=target;if(target){const r=target.getBoundingClientRect();activeRect={left:r.left,top:r.top,width:r.width,height:r.height}}else activeRect=null}
if(finePointer&&!reduced.matches){
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const target=e.target.closest(magnetSelector);if(target!==activeMagnet)setMagnetTarget(target);if(!target||!activeMagnet||!activeRect)return;pointerX=e.clientX;pointerY=e.clientY;if(magnetFrame)return;magnetFrame=requestAnimationFrame(()=>{magnetFrame=0;if(!activeMagnet||!activeRect)return;const el=activeMagnet,rect=activeRect;el.style.setProperty('--mx',`${pointerX-rect.left}px`);el.style.setProperty('--my',`${pointerY-rect.top}px`);if(el.matches('.magnetic-card')&&!el.matches('.contact-action')){const dx=(pointerX-(rect.left+rect.width/2))*.018,dy=(pointerY-(rect.top+rect.height/2))*.018;el.style.translate=`${Math.max(-2.2,Math.min(2.2,dx))}px ${Math.max(-2.2,Math.min(2.2,dy))}px`}else{const factor=el.matches('.contact-action')?.045:el.matches('.skill-btn')?.055:el.matches('.filter-btn')?.035:.075;const max=el.matches('.contact-action')?3.2:el.matches('.skill-btn')?3.4:el.matches('.filter-btn')?2.2:5;const dx=(pointerX-(rect.left+rect.width/2))*factor,dy=(pointerY-(rect.top+rect.height/2))*factor;el.style.translate=`${Math.max(-max,Math.min(max,dx))}px ${Math.max(-max,Math.min(max,dy))}px`}})},{passive:true});
 document.addEventListener('pointerout',e=>{if(!activeMagnet)return;const next=e.relatedTarget;const nextMagnet=next&&next.closest?next.closest(magnetSelector):null;if(nextMagnet)return;if(next&&activeMagnet.contains(next))return;if(e.target===activeMagnet||activeMagnet.contains(e.target))releaseMagnet()},{passive:true});
 document.addEventListener('pointercancel',releaseMagnet,{passive:true});
 addEventListener('scroll',releaseMagnet,{passive:true});
 addEventListener('resize',releaseMagnet,{passive:true});
 addEventListener('blur',releaseMagnet);
}
/* Shared particle field: one lightweight canvas, exactly 24 tasteful particles per activation. */
const canvas=$('#particle-canvas'),ctx=canvas?.getContext('2d',{alpha:true});let cw=0,ch=0,dpr=1,particles=[],particleFrame=0;const particleColors=['#D6A63A','#F6D98D','#7A263D','#D97941','#FFFCF9'];
function resizeCanvas(){if(!ctx)return;dpr=1;cw=innerWidth;ch=innerHeight;canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);canvas.style.width=cw+'px';canvas.style.height=ch+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles.length=0;if(particleFrame){cancelAnimationFrame(particleFrame);particleFrame=0}ctx.clearRect(0,0,cw,ch)}
if(ctx){resizeCanvas();let resizeTimer=0;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resizeCanvas,100)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)return;if(particleFrame){cancelAnimationFrame(particleFrame);particleFrame=0}particles.length=0;ctx.clearRect(0,0,cw,ch)});}
function scatter(x,y){if(!ctx||reduced.matches)return;if(particles.length>72){particles.length=0;ctx.clearRect(0,0,cw,ch)}for(let i=0;i<24;i++){const angle=(Math.PI*2*i/24)+(Math.random()-.5)*.23,speed=.65+Math.random()*1.9;particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-1.1,life:1,decay:.055+Math.random()*.018,size:1.1+Math.random()*1.6,color:particleColors[i%particleColors.length],shape:i%4===0?'diamond':'circle'})}if(!particleFrame)particleFrame=requestAnimationFrame(drawParticles)}
function drawParticles(){particleFrame=0;if(!ctx||!particles.length)return;let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const p of particles){p.px=p.x;p.py=p.y;p.x+=p.vx;p.y+=p.vy;p.vx*=.94;p.vy=p.vy*.94+.018;p.life-=p.decay;minX=Math.min(minX,p.px,p.x);minY=Math.min(minY,p.py,p.y);maxX=Math.max(maxX,p.px,p.x);maxY=Math.max(maxY,p.py,p.y)}if(Number.isFinite(minX)){const pad=6,left=Math.max(0,minX-pad),top=Math.max(0,minY-pad),right=Math.min(cw,maxX+pad),bottom=Math.min(ch,maxY+pad);if(right>left&&bottom>top)ctx.clearRect(left,top,right-left,bottom-top)}particles=particles.filter(p=>p.life>0);for(const p of particles){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;if(p.shape==='diamond'){ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size)}else{ctx.beginPath();ctx.arc(p.x,p.y,p.size/2,0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=1;if(particles.length)particleFrame=requestAnimationFrame(drawParticles)}
document.addEventListener('click',e=>{const target=e.target.closest('a,button,[role="button"]');if(!target||target.disabled||target.getAttribute('aria-disabled')==='true')return;const rect=target.getBoundingClientRect(),x=Number.isFinite(e.clientX)&&e.clientX!==0?e.clientX:rect.left+rect.width/2,y=Number.isFinite(e.clientY)&&e.clientY!==0?e.clientY:rect.top+rect.height/2;scatter(x,y)},{passive:true});
/* Skill catalogue. Official logo images are used where available, with an acronym fallback if offline. */
const skills=[
{category:'Programming & Web',effect:'foil',icon:'code',items:[
['Python','Python is a general-purpose language used for scripting, automation, data processing and AI, valued for its readable syntax and large library ecosystem.','python','Py'],
['C++','C++ is a compiled language used when programs need fine-grained control over memory and performance, as in systems software.','cplusplus','C++'],
['HTML','HTML defines the structure and meaning of web content so browsers and assistive technologies can interpret pages consistently.','html5','H5'],
['CSS','CSS controls the layout, colors, typography and responsive presentation of web interfaces across screen sizes.','css3','CSS'],
['JavaScript','JavaScript adds behavior and interactivity to websites, from forms and navigation to full application interfaces.','javascript','JS'],
['TypeScript','TypeScript adds static type checking to JavaScript so many mistakes are caught earlier and larger codebases stay maintainable.','typescript','TS']]},
{category:'QA & Automation',effect:'soft',icon:'check',items:[
['Functional Testing','Functional testing checks that each feature behaves according to its requirements, confirming the software does what users expect.','','FT'],
['Regression Testing','Regression testing re-runs earlier checks after changes to confirm that existing behavior has not been broken.','','RT'],
['Smoke Testing','Smoke testing is a quick pass over core functions that decides whether a build is stable enough for deeper testing.','','ST'],
['UI Testing','UI testing verifies that screens, controls and user flows work and look correct from the user’s point of view.','','UI'],
['API Testing','API testing sends requests straight to service endpoints to verify responses, data and error handling without using the interface.','','API'],
['Load Testing','Load testing simulates many concurrent users to show how a system performs and where it slows down under pressure.','','LT'],
['CodeceptJS','CodeceptJS is an end-to-end testing framework with readable, scenario-style tests that can run on drivers such as Playwright.','codeceptjs','CJ'],
['Playwright','Playwright automates browser interactions and assertions across supported browsers, making repeatable end-to-end UI tests easier to maintain.','','PW'],
['Postman','Postman helps create, send and validate API requests so developers and testers can check endpoints, responses and workflows.','postman','P'],
['UiPath Studio','UiPath Studio is a visual environment for building robotic process automation workflows that take over repetitive digital tasks.','uipath','Ui'],
['Apache JMeter','Apache JMeter is an open-source tool for load and performance testing of web applications and services.','apachejmeter','JM'],
['Allure Report','Allure Report turns test results into readable reports with steps and attachments, so failures are quicker to understand.','','AR'],
['Test Case Design','Test case design is writing clear inputs, steps and expected results that cover requirements and edge cases efficiently.','','TC'],
['Test Execution','Test execution is running planned test cases and recording outcomes, which gives evidence about the quality of a build.','','TE'],
['Bug Reporting','Bug reporting documents a defect with steps to reproduce and expected versus actual results so developers can fix it quickly.','','BR'],
['Defect Tracking','Defect tracking follows each reported issue through triage, fixing and retesting so nothing is lost.','','DT'],
['Test Reporting','Test reporting summarizes what was tested and what was found, helping teams make informed release decisions.','','TR']]},
{category:'Cybersecurity Tools',effect:'chase',icon:'shield',items:[
['Burp Suite','Burp Suite is a web security testing platform whose intercepting proxy lets testers inspect and modify HTTP traffic in authorized assessments.','burpsuite','BS'],
['OWASP ZAP','OWASP ZAP is a free open-source web application scanner and proxy used to find common vulnerabilities in authorized tests.','owasp','ZAP'],
['Nmap','Nmap discovers hosts and scans network services in authorized assessments, helping teams understand which systems and ports are exposed.','','N'],
['Nikto','Nikto is an open-source web server scanner that checks for outdated software, risky files and common misconfigurations.','','Ni'],
['WhatWeb','WhatWeb identifies the technologies a website runs, such as servers, frameworks and CMS platforms, to guide security assessment.','','WW'],
['Wireshark','Wireshark captures and analyzes network packets so users can investigate protocols, connectivity issues and suspicious traffic.','wireshark','W'],
['OpenSSL','OpenSSL is a toolkit for TLS and cryptography used to create keys and certificates and to inspect secure connections.','openssl','SSL'],
['testssl.sh','testssl.sh is a command-line tool that checks a server’s TLS/SSL setup for weak protocols, ciphers and known flaws.','','tS'],
['Metasploit','Metasploit is a penetration-testing framework used in authorized environments to verify whether known vulnerabilities can really be exploited.','metasploit','M'],
['SQLmap','SQLmap automates detection of SQL injection flaws in authorized tests, showing where database queries handle input unsafely.','','SQL'],
['Gobuster','Gobuster tries wordlists to find directories, files and subdomains in authorized tests, revealing content that is not publicly linked.','','GB'],
['Dirsearch','Dirsearch is a command-line scanner that finds hidden web paths and files by trying many likely names.','','DS'],
['Hydra','Hydra tests login credentials against network services in authorized assessments, showing where weak passwords put accounts at risk.','','HY'],
['Hashcat','Hashcat is a fast password-recovery tool used in authorized work to audit how well hashed passwords resist guessing.','hashcat','HC'],
['Aircrack-ng','Aircrack-ng is a suite for assessing Wi-Fi security in authorized tests, including capturing traffic and checking key strength.','','A'],
['Netcat','Netcat reads and writes data across network connections, making it a handy tool for testing ports and debugging services.','','NC']]},
{category:'Security Concepts',effect:'fill',icon:'lock',items:[
['OWASP Top 10','The OWASP Top 10 is a widely referenced list of the most critical web application security risks, used to prioritize testing and fixes.','owasp','O10'],
['Vulnerability Assessment','Vulnerability assessment systematically identifies and ranks weaknesses in systems so they can be fixed in order of risk.','','VA'],
['Web Application Security','Web application security is the practice of protecting websites and web services from attacks on their code, data and sessions.','','WAS'],
['SQL Injection','SQL injection is an attack where crafted input alters a database query, prevented by parameterized queries and input validation.','','SQLi'],
['Cross-Site Scripting (XSS)','Cross-site scripting lets attackers run script in another user’s browser through unsafe output, and proper output encoding prevents it.','','XSS'],
['Cross-Site Request Forgery (CSRF)','CSRF tricks a logged-in user’s browser into sending unwanted requests, and anti-forgery tokens help prevent it.','','CSRF'],
['Command Injection','Command injection happens when untrusted input reaches a system shell, and avoiding shell calls with user data prevents it.','','CI'],
['Directory Traversal','Directory traversal uses path sequences to read files outside the intended folder, and strict path validation blocks it.','','DT'],
['Authentication','Authentication verifies who a user is, using passwords, tokens or multi-factor methods, before access is granted.','','AUTH'],
['Access Control','Access control decides which authenticated users may perform which actions, enforcing least privilege on data and features.','','AC'],
['Session Management','Session management keeps users securely signed in across requests, relying on safe token handling, expiry and logout.','','SM'],
['Encryption','Encryption scrambles data with a key so only authorized parties can read it, protecting information in storage and in transit.','','ENC'],
['Hashing','Hashing turns data into a fixed-size fingerprint used to verify integrity and to store passwords without keeping them in plain text.','','HASH'],
['Privilege Escalation','Privilege escalation is gaining higher access than intended, which least privilege and prompt patching help to prevent.','','PE'],
['Threat Modeling','Threat modeling maps what could go wrong in a design and how to prevent it, finding risks before code is written.','','TM'],
['Risk Assessment','Risk assessment weighs how likely and how damaging each threat is, helping teams spend effort where it matters most.','','RA'],
['Incident Response','Incident response is the structured process of detecting, containing and recovering from a security event and learning from it.','','IR']]},
{category:'Networking & Security',effect:'glass',icon:'network',items:[
['TCP/IP','TCP/IP is the core protocol suite of the internet, defining how data is addressed, delivered reliably and routed between devices.','','TCP'],
['OSI Model','The OSI model describes networking in seven layers, giving a shared vocabulary for locating where a problem occurs.','','OSI'],
['DNS','DNS translates human-readable domain names into IP addresses so people don’t need to remember numbers.','','DNS'],
['DHCP','DHCP automatically assigns IP addresses and network settings to devices, removing manual configuration.','','DHCP'],
['HTTP/HTTPS','HTTP is the request-response protocol of the web, and HTTPS adds TLS encryption to protect data in transit.','','HTTP'],
['IP Addressing','IP addressing gives every device on a network a unique identifier so traffic can be delivered to the right place.','','IP'],
['Subnetting','Subnetting splits a network into smaller segments, improving organization, performance and security boundaries.','','SUB'],
['Routing','Routing chooses the paths packets take between networks, which joins separate networks into one internet.','','RT'],
['Ports & Protocols','Ports and protocols define which service on a host receives traffic and the rules it speaks, so exposed services can be identified.','','PORT'],
['Network Troubleshooting','Network troubleshooting methodically isolates faults in connectivity, DNS or routing using tools such as ping and traceroute.','','NET'],
['SSL/TLS','SSL/TLS encrypts and authenticates connections between clients and servers, protecting data from eavesdropping and tampering.','','TLS']]},
{category:'Operating Systems',effect:'clay',icon:'monitor',items:[
['Windows','Windows is Microsoft’s desktop and server operating system, the platform many business applications are built for.','','Win'],
['Debian','Debian is a community-developed Linux distribution known for its package management, broad software repository and stable base.','debian','Deb'],
['Ubuntu','Ubuntu is a Debian-based Linux distribution known for ease of use, regular releases and wide community support.','ubuntu','U'],
['Kali Linux','Kali Linux is a Debian-based distribution bundled with security-testing tools for authorized penetration testing.','kalilinux','Kali'],
['Linux Server Environments','Linux server environments run services such as web and database servers, with command-line administration and strong stability.','linux','Linux'],
['Arch Linux','Arch Linux is a minimalist rolling-release distribution that gives users fine control over what is installed.','archlinux','Arch']]},
{category:'Professional Skills',effect:'weight',icon:'user',items:[
['Problem-Solving','Problem-solving means breaking an issue into parts, testing ideas and finding a workable fix.','','PS'],
['Analytical Thinking','Analytical thinking examines evidence carefully to find root causes instead of stopping at symptoms.','','AT'],
['Quick Learning','Quick learning means picking up new tools and concepts efficiently, which keeps skills current as technology changes.','','QL'],
['Teamwork','Teamwork is collaborating with developers, testers and others toward shared goals, which gives better results than working alone.','','TW'],
['Communication','Clear communication turns findings into reports and conversations that others can understand and act on.','','COM']]}];
const effectFor={foil:'effect-foil',soft:'effect-soft',clay:'effect-clay',glass:'effect-glass',roll:'effect-roll',underline:'effect-underline',weight:'effect-weight',fill:'effect-fill',chase:'effect-chase'};
const skillFilters=$('#skill-filters'),skillGrid=$('#skills-grid'),skillQuery=$('#skill-query'),clearSkill=$('#clear-skill-search');let selectedCategory='All',selectedSkill=null,searchTerm='';
function logoHTML(slug,fallback){if(!slug)return `<span class="fallback">${escapeHTML(fallback)}</span>`;const safe=slug.replace(/[^a-z0-9-]/g,'');return `<img src="assets/icons/skills/${safe}.svg" alt="" width="20" height="20" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="fallback" hidden>${escapeHTML(fallback)}</span>`}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderSkillFilters(){const styles={'All':'effect-foil','Programming & Web':'effect-foil','QA & Automation':'effect-soft','Cybersecurity Tools':'effect-chase','Security Concepts':'effect-fill','Networking & Security':'effect-glass','Operating Systems':'effect-clay','Professional Skills':'effect-weight'};skillFilters.innerHTML=['All',...skills.map(s=>s.category)].map(c=>`<button class="filter-btn ${styles[c]||'effect-underline'}" type="button" data-category="${escapeHTML(c)}" aria-pressed="${String(c===selectedCategory)}"><span class="btn-label">${escapeHTML(c)}</span></button>`).join('')}
function renderSkills(){let html='',count=0;skills.forEach(group=>{if(selectedCategory!=='All'&&selectedCategory!==group.category)return;const matches=group.items.filter(item=>!searchTerm||(item[0]+' '+item[1]+' '+group.category).toLowerCase().includes(searchTerm));if(!matches.length)return;html+=`<p class="skill-group-title">${escapeHTML(group.category)}</p>`;for(const [name,description,logo,mark] of matches){count++;const active=selectedSkill===name;html+=`<button type="button" class="skill-btn ${effectFor[group.effect]}" data-skill="${escapeHTML(name)}" data-group="${escapeHTML(group.category)}" data-desc="${escapeHTML(description)}" data-logo="${escapeHTML(logo)}" data-mark="${escapeHTML(mark)}" aria-pressed="${String(active)}"><span class="brand-logo">${logoHTML(logo,mark)}</span><span class="skill-name">${escapeHTML(name)}</span></button>`}});skillGrid.innerHTML=html||'<p class="empty-state">No skills match that search. Try another term or clear the search.</p>';clearSkill.hidden=!searchTerm;const countEl=$('#skill-count');if(countEl)countEl.textContent=count?count+' skills shown':'No skills match that search.';if(selectedSkill&&!$$('[data-skill]',skillGrid).some(el=>el.dataset.skill===selectedSkill)){selectedSkill=null;setSkillDetail(null)}}
function setSkillDetail(item){const mark=$('#detail-mark');if(!item){$('#detail-category').textContent='Start exploring';$('#detail-name').textContent='Choose a skill';$('#detail-description').textContent='Select any skill button to see a clear, one-sentence explanation of what it does and why it is useful.';mark.textContent='✦';return}$('#detail-category').textContent=item.group;$('#detail-name').textContent=item.name;$('#detail-description').textContent=item.description;mark.innerHTML=logoHTML(item.logo,item.mark);}
renderSkillFilters();renderSkills();
skillFilters.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;selectedCategory=b.dataset.category;$$('[data-category]',skillFilters).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderSkills()});
skillGrid.addEventListener('click',e=>{const b=e.target.closest('[data-skill]');if(!b)return;selectedSkill=b.dataset.skill;setSkillDetail({name:b.dataset.skill,group:b.dataset.group,description:b.dataset.desc,logo:b.dataset.logo,mark:b.dataset.mark});$$('[data-skill]',skillGrid).forEach(x=>x.setAttribute('aria-pressed',String(x===b))) });
skillQuery.addEventListener('input',()=>{searchTerm=skillQuery.value.trim().toLowerCase();renderSkills()});
skillQuery.addEventListener('keydown',e=>{if(e.key==='Escape'&&skillQuery.value){skillQuery.value='';searchTerm='';renderSkills()}});
clearSkill.addEventListener('click',()=>{skillQuery.value='';searchTerm='';renderSkills();skillQuery.focus()});
/* Certifications remain grouped and searchable; the company project is intentionally not listed. */
const certifications={
'NPTEL':['Ethical Hacking','The Joy of Computing Using Python'],
'RedTeam Hacker Academy':['RedTeam Certified Penetration Tester (CPT)'],
'Oracle':['Oracle Cloud Infrastructure 2025 Certified Foundations Associate'],
'Simplilearn':['ChatGPT for Cybersecurity','Introduction to Kali Linux Basics','Trust and Security with Google Cloud','Introduction to Copilot for Startups','Databricks for Machine Learning'],
'HCL GUVI':['Python','ChatGPT for Everyone','Game Development Using PyGame'],
'Cognitive Class':['Deep Learning Fundamentals'],
'Imperial Info System Pvt. Ltd.':['Diploma in Computer Education'],
'LMES Academy':['Diploma Certification in Electronics Mastery'],
'LinkedIn Learning':['ISC2 Certified in Cybersecurity']};
const certGrid=$('#cert-grid'),certQuery=$('#cert-query');function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function renderCerts(){let count=0;const variants=['panel-foil','panel-soft','panel-clay','panel-glass','panel-wine','panel-gold'];certGrid.innerHTML=Object.entries(certifications).map(([provider,list],index)=>{const filtered=list.filter(name=>!certQuery.value.trim()||(provider+' '+name).toLowerCase().includes(certQuery.value.trim().toLowerCase()));count+=filtered.length;if(!filtered.length)return '';return `<article class="panel ${variants[index%variants.length]} cert-provider magnetic-card"><h3><span class="provider-mark">${escapeHTML(initials(provider))}</span>${escapeHTML(provider)}</h3><ul>${filtered.map(name=>`<li>${escapeHTML(name)}</li>`).join('')}</ul></article>`}).join('');$('#cert-empty').hidden=count>0}
renderCerts();certQuery.addEventListener('input',renderCerts);
certQuery.addEventListener('keydown',e=>{if(e.key==='Escape'&&certQuery.value){certQuery.value='';renderCerts()}});
})();