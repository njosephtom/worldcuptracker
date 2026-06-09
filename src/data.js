export const FLAGS = {
  Mexico:'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷',Czechia:'🇨🇿',
  Canada:'🇨🇦',Switzerland:'🇨🇭',Qatar:'🇶🇦','Bosnia and Herzegovina':'🇧🇦',
  Brazil:'🇧🇷',Morocco:'🇲🇦',Scotland:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',Haiti:'🇭🇹',
  'United States':'🇺🇸',Australia:'🇦🇺',Paraguay:'🇵🇾',Turkey:'🇹🇷',
  Germany:'🇩🇪',Ecuador:'🇪🇨','Ivory Coast':'🇨🇮','Curaçao':'🇨🇼',
  Netherlands:'🇳🇱',Japan:'🇯🇵',Tunisia:'🇹🇳',Sweden:'🇸🇪',
  Belgium:'🇧🇪',Iran:'🇮🇷',Egypt:'🇪🇬','New Zealand':'🇳🇿',
  Spain:'🇪🇸',Uruguay:'🇺🇾','Saudi Arabia':'🇸🇦','Cape Verde':'🇨🇻',
  France:'🇫🇷',Senegal:'🇸🇳',Norway:'🇳🇴',Iraq:'🇮🇶',
  Argentina:'🇦🇷',Austria:'🇦🇹',Algeria:'🇩🇿',Jordan:'🇯🇴',
  Portugal:'🇵🇹','DR Congo':'🇨🇩',Uzbekistan:'🇺🇿',Colombia:'🇨🇴',
  England:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',Croatia:'🇭🇷',Ghana:'🇬🇭',Panama:'🇵🇦'
};

export const COUNTRY_FLAGS = { US:'🇺🇸', CA:'🇨🇦', MX:'🇲🇽' };

export const GROUPS = {
  A:{teams:['Mexico','South Korea','South Africa','Czechia']},
  B:{teams:['Canada','Switzerland','Qatar','Bosnia and Herzegovina']},
  C:{teams:['Brazil','Morocco','Scotland','Haiti']},
  D:{teams:['United States','Australia','Paraguay','Turkey']},
  E:{teams:['Germany','Ecuador','Ivory Coast','Curaçao']},
  F:{teams:['Netherlands','Japan','Tunisia','Sweden']},
  G:{teams:['Belgium','Egypt','Iran','New Zealand']},
  H:{teams:['Spain','Uruguay','Saudi Arabia','Cape Verde']},
  I:{teams:['France','Senegal','Norway','Iraq']},
  J:{teams:['Argentina','Algeria','Austria','Jordan']},
  K:{teams:['Portugal','DR Congo','Colombia','Uzbekistan']},
  L:{teams:['England','Croatia','Ghana','Panama']}
};

export function flagOf(name) {
  return FLAGS[name] || '🏳️';
}

export function flagLabel(name) {
  return `${flagOf(name)} ${name}`;
}

export const VENUES = {
  azteca:{name:'Estadio Azteca',city:'Mexico City',cc:'MX',cap:'83,000',x:175,y:247},
  akron:{name:'Estadio Akron',city:'Guadalajara',cc:'MX',cap:'49,850',x:152,y:228},
  bbva:{name:'Estadio BBVA',city:'Monterrey',cc:'MX',cap:'53,500',x:196,y:210},
  sofi:{name:'SoFi Stadium',city:'Los Angeles',cc:'US',cap:'70,240',x:76,y:195},
  levis:{name:"Levi's Stadium",city:'Bay Area',cc:'US',cap:'68,500',x:68,y:170},
  lumen:{name:'Lumen Field',city:'Seattle',cc:'US',cap:'68,740',x:70,y:126},
  arrowhead:{name:'Arrowhead Stadium',city:'Kansas City',cc:'US',cap:'76,416',x:236,y:172},
  att:{name:'AT&T Stadium',city:'Dallas',cc:'US',cap:'80,000',x:222,y:200},
  nrg:{name:'NRG Stadium',city:'Houston',cc:'US',cap:'72,220',x:228,y:227},
  mercedes:{name:'Mercedes-Benz Stadium',city:'Atlanta',cc:'US',cap:'71,000',x:295,y:193},
  hardrock:{name:'Hard Rock Stadium',city:'Miami',cc:'US',cap:'64,767',x:312,y:244},
  lincoln:{name:'Lincoln Financial Field',city:'Philadelphia',cc:'US',cap:'69,796',x:366,y:163},
  gillette:{name:'Gillette Stadium',city:'Boston',cc:'US',cap:'65,878',x:376,y:145},
  metlife:{name:'MetLife Stadium',city:'New York / NJ',cc:'US',cap:'82,500',x:370,y:155},
  bmo:{name:'BMO Field',city:'Toronto',cc:'CA',cap:'45,736',x:348,y:140},
  bcplace:{name:'BC Place',city:'Vancouver',cc:'CA',cap:'54,500',x:70,y:118}
};

export const MATCHES = [
  {id:1,d:'2026-06-11',t:'3:00 PM ET',h:'Mexico',a:'South Africa',g:'A',v:'azteca'},
  {id:2,d:'2026-06-11',t:'10:00 PM ET',h:'South Korea',a:'Czechia',g:'A',v:'akron'},
  {id:3,d:'2026-06-12',t:'3:00 PM ET',h:'Canada',a:'Bosnia and Herzegovina',g:'B',v:'bmo'},
  {id:4,d:'2026-06-12',t:'9:00 PM ET',h:'United States',a:'Paraguay',g:'D',v:'sofi'},
  {id:5,d:'2026-06-13',t:'3:00 PM ET',h:'Qatar',a:'Switzerland',g:'B',v:'levis'},
  {id:6,d:'2026-06-13',t:'6:00 PM ET',h:'Brazil',a:'Morocco',g:'C',v:'metlife'},
  {id:7,d:'2026-06-13',t:'9:00 PM ET',h:'Haiti',a:'Scotland',g:'C',v:'gillette'},
  {id:8,d:'2026-06-13',t:'12:00 AM ET',h:'Australia',a:'Turkey',g:'D',v:'levis'},
  {id:9,d:'2026-06-14',t:'1:00 PM ET',h:'Germany',a:'Curaçao',g:'E',v:'metlife'},
  {id:10,d:'2026-06-14',t:'4:00 PM ET',h:'Netherlands',a:'Sweden',g:'F',v:'att'},
  {id:11,d:'2026-06-14',t:'7:00 PM ET',h:'Ivory Coast',a:'Ecuador',g:'E',v:'nrg'},
  {id:12,d:'2026-06-15',t:'12:00 PM ET',h:'Spain',a:'Cape Verde',g:'H',v:'metlife'},
  {id:13,d:'2026-06-15',t:'3:00 PM ET',h:'Japan',a:'Tunisia',g:'F',v:'levis'},
  {id:14,d:'2026-06-15',t:'6:00 PM ET',h:'Saudi Arabia',a:'Uruguay',g:'H',v:'gillette'},
  {id:15,d:'2026-06-15',t:'11:00 PM ET',h:'Belgium',a:'New Zealand',g:'G',v:'bcplace'},
  {id:16,d:'2026-06-15',t:'11:00 PM ET',h:'Egypt',a:'Iran',g:'G',v:'lumen'},
  {id:17,d:'2026-06-16',t:'3:00 PM ET',h:'France',a:'Senegal',g:'I',v:'sofi'},
  {id:18,d:'2026-06-16',t:'6:00 PM ET',h:'Iraq',a:'Norway',g:'I',v:'mercedes'},
  {id:19,d:'2026-06-16',t:'9:00 PM ET',h:'Argentina',a:'Algeria',g:'J',v:'nrg'},
  {id:20,d:'2026-06-16',t:'12:00 AM ET',h:'Austria',a:'Jordan',g:'J',v:'lumen'},
  {id:21,d:'2026-06-17',t:'1:00 PM ET',h:'Portugal',a:'DR Congo',g:'K',v:'lincoln'},
  {id:22,d:'2026-06-17',t:'5:00 PM ET',h:'England',a:'Panama',g:'L',v:'hardrock'},
  {id:23,d:'2026-06-17',t:'9:00 PM ET',h:'Croatia',a:'Ghana',g:'L',v:'nrg'},
  {id:24,d:'2026-06-17',t:'10:00 PM ET',h:'Uzbekistan',a:'Colombia',g:'K',v:'sofi'},
  {id:25,d:'2026-06-18',t:'12:00 PM ET',h:'Czechia',a:'South Africa',g:'A',v:'sofi'},
  {id:26,d:'2026-06-18',t:'9:00 PM ET',h:'Mexico',a:'South Korea',g:'A',v:'bbva'},
  {id:27,d:'2026-06-19',t:'3:00 PM ET',h:'United States',a:'Australia',g:'D',v:'mercedes'},
  {id:28,d:'2026-06-19',t:'3:00 PM ET',h:'Canada',a:'Qatar',g:'B',v:'bcplace'},
  {id:29,d:'2026-06-19',t:'9:00 PM ET',h:'Switzerland',a:'Bosnia and Herzegovina',g:'B',v:'metlife'},
  {id:30,d:'2026-06-19',t:'12:00 AM ET',h:'Turkey',a:'Paraguay',g:'D',v:'nrg'},
  {id:31,d:'2026-06-20',t:'3:00 PM ET',h:'Brazil',a:'Haiti',g:'C',v:'sofi'},
  {id:32,d:'2026-06-20',t:'4:00 PM ET',h:'Germany',a:'Ivory Coast',g:'E',v:'mercedes'},
  {id:33,d:'2026-06-20',t:'8:00 PM ET',h:'Ecuador',a:'Curaçao',g:'E',v:'sofi'},
  {id:34,d:'2026-06-20',t:'9:00 PM ET',h:'Morocco',a:'Scotland',g:'C',v:'lumen'},
  {id:35,d:'2026-06-21',t:'12:00 PM ET',h:'Spain',a:'Saudi Arabia',g:'H',v:'hardrock'},
  {id:36,d:'2026-06-21',t:'3:00 PM ET',h:'Netherlands',a:'Japan',g:'F',v:'sofi'},
  {id:37,d:'2026-06-21',t:'6:00 PM ET',h:'Uruguay',a:'Cape Verde',g:'H',v:'levis'},
  {id:38,d:'2026-06-22',t:'1:00 PM ET',h:'Argentina',a:'Austria',g:'J',v:'att'},
  {id:39,d:'2026-06-22',t:'5:00 PM ET',h:'France',a:'Iraq',g:'I',v:'att'},
  {id:40,d:'2026-06-22',t:'6:00 PM ET',h:'Belgium',a:'Egypt',g:'G',v:'att'},
  {id:41,d:'2026-06-22',t:'8:00 PM ET',h:'Norway',a:'Senegal',g:'I',v:'nrg'},
  {id:42,d:'2026-06-22',t:'9:00 PM ET',h:'Iran',a:'New Zealand',g:'G',v:'mercedes'},
  {id:43,d:'2026-06-22',t:'11:00 PM ET',h:'Jordan',a:'Algeria',g:'J',v:'sofi'},
  {id:44,d:'2026-06-23',t:'1:00 PM ET',h:'Portugal',a:'Uzbekistan',g:'K',v:'hardrock'},
  {id:45,d:'2026-06-23',t:'3:00 PM ET',h:'England',a:'Croatia',g:'L',v:'lincoln'},
  {id:46,d:'2026-06-23',t:'4:00 PM ET',h:'Colombia',a:'DR Congo',g:'K',v:'arrowhead'},
  {id:47,d:'2026-06-23',t:'6:00 PM ET',h:'Ghana',a:'Panama',g:'L',v:'att'},
  {id:48,d:'2026-06-24',t:'6:00 PM ET',h:'Scotland',a:'Brazil',g:'C',v:'sofi'},
  {id:49,d:'2026-06-24',t:'6:00 PM ET',h:'Morocco',a:'Haiti',g:'C',v:'arrowhead'},
  {id:50,d:'2026-06-24',t:'9:00 PM ET',h:'Czechia',a:'Mexico',g:'A',v:'att'},
  {id:51,d:'2026-06-24',t:'9:00 PM ET',h:'South Africa',a:'South Korea',g:'A',v:'lumen'},
  {id:52,d:'2026-06-25',t:'4:00 PM ET',h:'Ecuador',a:'Germany',g:'E',v:'lincoln'},
  {id:53,d:'2026-06-25',t:'4:00 PM ET',h:'Curaçao',a:'Ivory Coast',g:'E',v:'arrowhead'},
  {id:54,d:'2026-06-25',t:'6:00 PM ET',h:'Bosnia and Herzegovina',a:'Qatar',g:'B',v:'hardrock'},
  {id:55,d:'2026-06-25',t:'6:00 PM ET',h:'Switzerland',a:'Canada',g:'B',v:'gillette'},
  {id:56,d:'2026-06-25',t:'10:00 PM ET',h:'Turkey',a:'United States',g:'D',v:'arrowhead'},
  {id:57,d:'2026-06-25',t:'10:00 PM ET',h:'Paraguay',a:'Australia',g:'D',v:'lincoln'},
  {id:58,d:'2026-06-26',t:'3:00 PM ET',h:'Norway',a:'France',g:'I',v:'metlife'},
  {id:59,d:'2026-06-26',t:'3:00 PM ET',h:'Senegal',a:'Iraq',g:'I',v:'bcplace'},
  {id:60,d:'2026-06-26',t:'6:00 PM ET',h:'Sweden',a:'Japan',g:'F',v:'hardrock'},
  {id:61,d:'2026-06-26',t:'6:00 PM ET',h:'Tunisia',a:'Netherlands',g:'F',v:'bmo'},
  {id:62,d:'2026-06-26',t:'8:00 PM ET',h:'Cape Verde',a:'Saudi Arabia',g:'H',v:'lincoln'},
  {id:63,d:'2026-06-26',t:'8:00 PM ET',h:'Uruguay',a:'Spain',g:'H',v:'arrowhead'},
  {id:64,d:'2026-06-26',t:'11:00 PM ET',h:'New Zealand',a:'Belgium',g:'G',v:'bcplace'},
  {id:65,d:'2026-06-26',t:'11:00 PM ET',h:'Iran',a:'Egypt',g:'G',v:'sofi'},
  {id:66,d:'2026-06-27',t:'5:00 PM ET',h:'Panama',a:'England',g:'L',v:'mercedes'},
  {id:67,d:'2026-06-27',t:'5:00 PM ET',h:'Croatia',a:'Ghana',g:'L',v:'lumen'},
  {id:68,d:'2026-06-27',t:'5:00 PM ET',h:'DR Congo',a:'Uzbekistan',g:'K',v:'bmo'},
  {id:69,d:'2026-06-27',t:'5:00 PM ET',h:'Colombia',a:'Portugal',g:'K',v:'bcplace'},
  {id:70,d:'2026-06-27',t:'10:00 PM ET',h:'Algeria',a:'Austria',g:'J',v:'gillette'},
  {id:71,d:'2026-06-27',t:'10:00 PM ET',h:'Jordan',a:'Argentina',g:'J',v:'att'}
];

export function todayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
}

export function clampDate(d) {
  if (d < '2026-06-11') return '2026-06-11';
  if (d > '2026-07-19') return '2026-07-19';
  return d;
}

export function fmtDate(d) {
  const [y,m,dd] = d.split('-');
  return new Date(y, m-1, dd).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}

export function shiftDate(d, n) {
  const [y,m,dd] = d.split('-').map(Number);
  const dt = new Date(y, m-1, dd);
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}

export function computeStandings(matches, liveData) {
  const stand = {};
  Object.values(GROUPS).forEach(g => g.teams.forEach(t => {
    stand[t] = {mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};
  }));
  // merge live data results
  if (liveData?.standings) {
    Object.entries(liveData.standings).forEach(([k,v]) => {
      if (stand[k]) stand[k] = {...stand[k], ...v};
    });
  }
  return stand;
}

export function getGroupStandings(group, standings) {
  return GROUPS[group].teams
    .map(t => ({name:t, ...(standings[t]||{mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0})}))
    .sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf - a.gf);
}
