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

// PNG flag images from public/flags/ — missing teams fall back to emoji
export const FLAG_IMGS = {
  'Mexico':'/flags/mexico.png','South Korea':'/flags/south_korea.png',
  'South Africa':'/flags/south_africa.png','Czechia':'/flags/czechia.png',
  'Canada':'/flags/canada.png','Switzerland':'/flags/switzerland.png',
  'Qatar':'/flags/qatar.png','Bosnia and Herzegovina':'/flags/bosnia.png',
  'Brazil':'/flags/brazil.png','Morocco':'/flags/morocco.png',
  'Scotland':'/flags/scotland.png','Haiti':'/flags/haiti.png',
  'United States':'/flags/usa.png','Australia':'/flags/australia.png',
  'Paraguay':'/flags/paraguay.png','Turkey':'/flags/turkiye.png',
  'Germany':'/flags/germany.png','Ecuador':'/flags/ecuador.png',
  'Ivory Coast':'/flags/cote_divoire.png','Curaçao':'/flags/curacao.png',
  'Netherlands':'/flags/netherlands.png','Japan':'/flags/japan.png',
  'Tunisia':'/flags/tunisia.png','Sweden':'/flags/sweden.png',
  'Belgium':'/flags/belgium.png','Iran':'/flags/iran.png',
  'Egypt':'/flags/egypt.png','New Zealand':'/flags/new_zealand.png',
  'Spain':'/flags/spain.png','Uruguay':'/flags/uruguay.png',
  'Saudi Arabia':'/flags/saudi_arabia.png','France':'/flags/france.png',
  'Senegal':'/flags/senegal.png','Norway':'/flags/norway.png',
  'Iraq':'/flags/iraq.png','Argentina':'/flags/argentina.png',
  'Algeria':'/flags/algeria.png','Austria':'/flags/austria.png',
  'Portugal':'/flags/portugal.png','Colombia':'/flags/colombia.png',
  'Uzbekistan':'/flags/uzbekistan.png','England':'/flags/england.png',
  'Croatia':'/flags/croatia.png','Panama':'/flags/panama.png',
  'Ghana':'/flags/ghana.png','Jordan':'/flags/jordan.png',
  'DR Congo':'/flags/dr_congo.png','Cape Verde':'/flags/cape_verde.png'
};

// ISO country code for each team
export const TEAM_CC = {
  'Mexico':'MX','South Korea':'KR','South Africa':'ZA','Czechia':'CZ',
  'Canada':'CA','Switzerland':'CH','Qatar':'QA','Bosnia and Herzegovina':'BA',
  'Brazil':'BR','Morocco':'MA','Scotland':'SCO','Haiti':'HT',
  'United States':'US','Australia':'AU','Paraguay':'PY','Turkey':'TR',
  'Germany':'DE','Ecuador':'EC','Ivory Coast':'CI','Curaçao':'CW',
  'Netherlands':'NL','Japan':'JP','Tunisia':'TN','Sweden':'SE',
  'Belgium':'BE','Iran':'IR','Egypt':'EG','New Zealand':'NZ',
  'Spain':'ES','Uruguay':'UY','Saudi Arabia':'SA','Cape Verde':'CV',
  'France':'FR','Senegal':'SN','Norway':'NO','Iraq':'IQ',
  'Argentina':'AR','Algeria':'DZ','Austria':'AT','Jordan':'JO',
  'Portugal':'PT','DR Congo':'CD','Uzbekistan':'UZ','Colombia':'CO',
  'England':'ENG','Croatia':'HR','Ghana':'GH','Panama':'PA',
};

export const COUNTRY_FLAGS = {
  AG:'🇦🇬', BS:'🇧🇸', BB:'🇧🇧', BZ:'🇧🇿', CA:'🇨🇦', CR:'🇨🇷', CU:'🇨🇺', DM:'🇩🇲', DO:'🇩🇴',
  SV:'🇸🇻', GD:'🇬🇩', GT:'🇬🇹', HT:'🇭🇹', HN:'🇭🇳', JM:'🇯🇲', MX:'🇲🇽', NI:'🇳🇮', PA:'🇵🇦',
  KN:'🇰🇳', LC:'🇱🇨', VC:'🇻🇨', TT:'🇹🇹', US:'🇺🇸'
};

export const NORTH_AMERICA_COUNTRIES = [
  { code: 'CA', name: 'Canada', x: 620, y: 330 },
  { code: 'US', name: 'United States', x: 653, y: 582 },
  { code: 'MX', name: 'Mexico', x: 596, y: 766 },
  { code: 'GT', name: 'Guatemala', x: 720, y: 870 },
  { code: 'BZ', name: 'Belize', x: 735, y: 855 },
  { code: 'SV', name: 'El Salvador', x: 730, y: 888 },
  { code: 'HN', name: 'Honduras', x: 750, y: 882 },
  { code: 'NI', name: 'Nicaragua', x: 760, y: 895 },
  { code: 'CR', name: 'Costa Rica', x: 772, y: 900 },
  { code: 'PA', name: 'Panama', x: 807, y: 895 },
  { code: 'CU', name: 'Cuba', x: 807, y: 792 },
  { code: 'JM', name: 'Jamaica', x: 823, y: 840 },
  { code: 'HT', name: 'Haiti', x: 864, y: 828 },
  { code: 'DO', name: 'Dominican Republic', x: 882, y: 832 },
  { code: 'BS', name: 'Bahamas', x: 827, y: 756 },
  { code: 'KN', name: 'Saint Kitts and Nevis', x: 944, y: 850 },
  { code: 'AG', name: 'Antigua and Barbuda', x: 952, y: 855 },
  { code: 'DM', name: 'Dominica', x: 955, y: 870 },
  { code: 'LC', name: 'Saint Lucia', x: 958, y: 882 },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', x: 956, y: 890 },
  { code: 'BB', name: 'Barbados', x: 966, y: 888 },
  { code: 'GD', name: 'Grenada', x: 952, y: 898 },
  { code: 'TT', name: 'Trinidad and Tobago', x: 954, y: 898 }
];

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
  azteca:{name:'Estadio Banorte',city:'Mexico City',cc:'MX',cap:'83,000',x:647,y:827},
  akron:{name:'Estadio Akron',city:'Guadalajara',cc:'MX',cap:'49,850',x:612,y:812},
  bbva:{name:'Estadio BBVA',city:'Monterrey',cc:'MX',cap:'53,500',x:637,y:751},
  sofi:{name:'SoFi Stadium',city:'Los Angeles',cc:'US',cap:'70,240',x:490,y:651},
  levis:{name:"Levi's Stadium",city:'Bay Area',cc:'US',cap:'68,500',x:460,y:609},
  lumen:{name:'Lumen Field',city:'Seattle',cc:'US',cap:'68,740',x:457,y:486},
  arrowhead:{name:'GEHA Field at Arrowhead Stadium',city:'Kansas City',cc:'US',cap:'76,416',x:685,y:589},
  att:{name:'AT&T Stadium',city:'Dallas',cc:'US',cap:'80,000',x:663,y:666},
  nrg:{name:'NRG Stadium',city:'Houston',cc:'US',cap:'72,220',x:677,y:703},
  mercedes:{name:'Mercedes-Benz Stadium',city:'Atlanta',cc:'US',cap:'71,000',x:767,y:654},
  hardrock:{name:'Hard Rock Stadium',city:'Miami',cc:'US',cap:'64,767',x:801,y:748},
  lincoln:{name:'Lincoln Financial Field',city:'Philadelphia',cc:'US',cap:'69,796',x:842,y:579},
  gillette:{name:'Gillette Stadium',city:'Boston',cc:'US',cap:'65,878',x:874,y:553},
  metlife:{name:'MetLife Stadium',city:'New York / NJ',cc:'US',cap:'82,500',x:851,y:568},
  bmo:{name:'BMO Field',city:'Toronto',cc:'CA',cap:'45,736',x:808,y:534},
  bcplace:{name:'BC Place',city:'Vancouver',cc:'CA',cap:'54,500',x:451,y:466}
};

export const MATCHES = [
  // ── Round 1 ─────────────────────────────────────────────────────────────────
  {id:1,d:'2026-06-11',t:'3:00 PM ET',h:'Mexico',a:'South Africa',g:'A',v:'azteca'},
  {id:2,d:'2026-06-11',t:'9:00 PM ET',h:'South Korea',a:'Czechia',g:'A',v:'akron'},
  {id:3,d:'2026-06-12',t:'3:00 PM ET',h:'Canada',a:'Bosnia and Herzegovina',g:'B',v:'bmo'},
  {id:4,d:'2026-06-12',t:'9:00 PM ET',h:'United States',a:'Paraguay',g:'D',v:'sofi'},
  {id:5,d:'2026-06-13',t:'3:00 PM ET',h:'Qatar',a:'Switzerland',g:'B',v:'levis'},
  {id:6,d:'2026-06-13',t:'6:00 PM ET',h:'Brazil',a:'Morocco',g:'C',v:'metlife'},
  {id:7,d:'2026-06-13',t:'9:00 PM ET',h:'Haiti',a:'Scotland',g:'C',v:'gillette'},
  {id:8,d:'2026-06-13',t:'11:00 PM ET',h:'Australia',a:'Turkey',g:'D',v:'bcplace'},
  {id:9,d:'2026-06-14',t:'3:00 PM ET',h:'Germany',a:'Curaçao',g:'E',v:'nrg'},
  {id:10,d:'2026-06-14',t:'6:00 PM ET',h:'Netherlands',a:'Japan',g:'F',v:'att'},
  {id:11,d:'2026-06-14',t:'8:00 PM ET',h:'Ivory Coast',a:'Ecuador',g:'E',v:'lincoln'},
  {id:12,d:'2026-06-14',t:'11:00 PM ET',h:'Sweden',a:'Tunisia',g:'F',v:'bbva'},
  {id:13,d:'2026-06-15',t:'12:00 PM ET',h:'Spain',a:'Cape Verde',g:'H',v:'mercedes'},
  {id:14,d:'2026-06-15',t:'3:00 PM ET',h:'Belgium',a:'Egypt',g:'G',v:'lumen'},
  {id:15,d:'2026-06-15',t:'6:00 PM ET',h:'Uruguay',a:'Saudi Arabia',g:'H',v:'hardrock'},
  {id:16,d:'2026-06-15',t:'9:00 PM ET',h:'Iran',a:'New Zealand',g:'G',v:'sofi'},
  {id:17,d:'2026-06-16',t:'3:00 PM ET',h:'France',a:'Senegal',g:'I',v:'metlife'},
  {id:18,d:'2026-06-16',t:'6:00 PM ET',h:'Norway',a:'Iraq',g:'I',v:'gillette'},
  {id:19,d:'2026-06-16',t:'9:00 PM ET',h:'Argentina',a:'Algeria',g:'J',v:'arrowhead'},
  {id:20,d:'2026-06-16',t:'9:00 PM ET',h:'Austria',a:'Jordan',g:'J',v:'levis'},
  {id:21,d:'2026-06-17',t:'4:00 PM ET',h:'Portugal',a:'DR Congo',g:'K',v:'nrg'},
  {id:22,d:'2026-06-17',t:'4:00 PM ET',h:'England',a:'Croatia',g:'L',v:'att'},
  {id:23,d:'2026-06-17',t:'7:00 PM ET',h:'Ghana',a:'Panama',g:'L',v:'bmo'},
  {id:24,d:'2026-06-17',t:'10:00 PM ET',h:'Uzbekistan',a:'Colombia',g:'K',v:'azteca'},

  // ── Round 2 ─────────────────────────────────────────────────────────────────
  {id:25,d:'2026-06-18',t:'12:00 PM ET',h:'Czechia',a:'South Africa',g:'A',v:'mercedes'},
  {id:26,d:'2026-06-18',t:'3:00 PM ET',h:'Switzerland',a:'Bosnia and Herzegovina',g:'B',v:'sofi'},
  {id:27,d:'2026-06-18',t:'6:00 PM ET',h:'Canada',a:'Qatar',g:'B',v:'bcplace'},
  {id:28,d:'2026-06-18',t:'9:00 PM ET',h:'Mexico',a:'South Korea',g:'A',v:'akron'},
  {id:29,d:'2026-06-19',t:'3:00 PM ET',h:'United States',a:'Australia',g:'D',v:'lumen'},
  {id:30,d:'2026-06-19',t:'6:00 PM ET',h:'Scotland',a:'Morocco',g:'C',v:'gillette'},
  {id:31,d:'2026-06-19',t:'8:30 PM ET',h:'Brazil',a:'Haiti',g:'C',v:'lincoln'},
  {id:32,d:'2026-06-19',t:'11:00 PM ET',h:'Turkey',a:'Paraguay',g:'D',v:'levis'},
  {id:33,d:'2026-06-20',t:'1:00 PM ET',h:'Netherlands',a:'Sweden',g:'F',v:'nrg'},
  {id:34,d:'2026-06-20',t:'4:00 PM ET',h:'Germany',a:'Ivory Coast',g:'E',v:'bmo'},
  {id:35,d:'2026-06-20',t:'8:00 PM ET',h:'Ecuador',a:'Curaçao',g:'E',v:'arrowhead'},
  {id:104,d:'2026-06-20',t:'12:00 AM ET',h:'Tunisia',a:'Japan',g:'F',v:'bbva'},
  {id:36,d:'2026-06-21',t:'12:00 PM ET',h:'Spain',a:'Saudi Arabia',g:'H',v:'mercedes'},
  {id:37,d:'2026-06-21',t:'3:00 PM ET',h:'Belgium',a:'Iran',g:'G',v:'sofi'},
  {id:38,d:'2026-06-21',t:'6:00 PM ET',h:'Uruguay',a:'Cape Verde',g:'H',v:'hardrock'},
  {id:39,d:'2026-06-21',t:'9:00 PM ET',h:'New Zealand',a:'Egypt',g:'G',v:'bcplace'},
  {id:40,d:'2026-06-22',t:'1:00 PM ET',h:'Argentina',a:'Austria',g:'J',v:'att'},
  {id:41,d:'2026-06-22',t:'5:00 PM ET',h:'France',a:'Iraq',g:'I',v:'lincoln'},
  {id:42,d:'2026-06-22',t:'8:00 PM ET',h:'Norway',a:'Senegal',g:'I',v:'metlife'},
  {id:43,d:'2026-06-22',t:'11:00 PM ET',h:'Jordan',a:'Algeria',g:'J',v:'levis'},
  {id:44,d:'2026-06-23',t:'1:00 PM ET',h:'Portugal',a:'Uzbekistan',g:'K',v:'nrg'},
  {id:45,d:'2026-06-23',t:'4:00 PM ET',h:'England',a:'Ghana',g:'L',v:'gillette'},
  {id:46,d:'2026-06-23',t:'7:00 PM ET',h:'Panama',a:'Croatia',g:'L',v:'bmo'},
  {id:47,d:'2026-06-23',t:'10:00 PM ET',h:'Colombia',a:'DR Congo',g:'K',v:'akron'},

  // ── Round 3 ─────────────────────────────────────────────────────────────────
  {id:48,d:'2026-06-24',t:'3:00 PM ET',h:'Bosnia and Herzegovina',a:'Qatar',g:'B',v:'lumen'},
  {id:49,d:'2026-06-24',t:'3:00 PM ET',h:'Switzerland',a:'Canada',g:'B',v:'bcplace'},
  {id:50,d:'2026-06-24',t:'6:00 PM ET',h:'Morocco',a:'Haiti',g:'C',v:'mercedes'},
  {id:51,d:'2026-06-24',t:'6:00 PM ET',h:'Scotland',a:'Brazil',g:'C',v:'hardrock'},
  {id:52,d:'2026-06-24',t:'9:00 PM ET',h:'Czechia',a:'Mexico',g:'A',v:'azteca'},
  {id:53,d:'2026-06-24',t:'9:00 PM ET',h:'South Korea',a:'South Africa',g:'A',v:'bbva'},
  {id:54,d:'2026-06-25',t:'4:00 PM ET',h:'Curaçao',a:'Ivory Coast',g:'E',v:'lincoln'},
  {id:55,d:'2026-06-25',t:'4:00 PM ET',h:'Ecuador',a:'Germany',g:'E',v:'metlife'},
  {id:56,d:'2026-06-25',t:'7:00 PM ET',h:'Japan',a:'Sweden',g:'F',v:'att'},
  {id:57,d:'2026-06-25',t:'7:00 PM ET',h:'Tunisia',a:'Netherlands',g:'F',v:'arrowhead'},
  {id:58,d:'2026-06-25',t:'10:00 PM ET',h:'Paraguay',a:'Australia',g:'D',v:'levis'},
  {id:59,d:'2026-06-25',t:'10:00 PM ET',h:'Turkey',a:'United States',g:'D',v:'sofi'},
  {id:60,d:'2026-06-26',t:'3:00 PM ET',h:'Norway',a:'France',g:'I',v:'gillette'},
  {id:61,d:'2026-06-26',t:'3:00 PM ET',h:'Iraq',a:'Senegal',g:'I',v:'bmo'},
  {id:62,d:'2026-06-26',t:'8:00 PM ET',h:'Cape Verde',a:'Saudi Arabia',g:'H',v:'nrg'},
  {id:63,d:'2026-06-26',t:'8:00 PM ET',h:'Uruguay',a:'Spain',g:'H',v:'akron'},
  {id:64,d:'2026-06-26',t:'11:00 PM ET',h:'Iran',a:'Egypt',g:'G',v:'lumen'},
  {id:65,d:'2026-06-26',t:'11:00 PM ET',h:'Belgium',a:'New Zealand',g:'G',v:'bcplace'},
  {id:66,d:'2026-06-27',t:'5:00 PM ET',h:'Ghana',a:'Croatia',g:'L',v:'lincoln'},
  {id:67,d:'2026-06-27',t:'5:00 PM ET',h:'Panama',a:'England',g:'L',v:'metlife'},
  {id:68,d:'2026-06-27',t:'7:30 PM ET',h:'Portugal',a:'Colombia',g:'K',v:'hardrock'},
  {id:69,d:'2026-06-27',t:'7:30 PM ET',h:'Uzbekistan',a:'DR Congo',g:'K',v:'mercedes'},
  {id:70,d:'2026-06-27',t:'10:00 PM ET',h:'Austria',a:'Algeria',g:'J',v:'arrowhead'},
  {id:71,d:'2026-06-27',t:'10:00 PM ET',h:'Argentina',a:'Jordan',g:'J',v:'att'},

  // ── Round of 32 ─────────────────────────────────────────────────────────────
  {id:72,d:'2026-06-28',t:'3:00 PM ET',h:'South Africa',a:'Canada',round:'R32',v:'sofi'},
  {id:73,d:'2026-06-29',t:'1:00 PM ET',h:'Brazil',a:'Japan',round:'R32',v:'nrg'},
  {id:74,d:'2026-06-29',t:'4:30 PM ET',h:'Germany',a:'Paraguay',round:'R32',v:'gillette'},
  {id:75,d:'2026-06-29',t:'9:00 PM ET',h:'Netherlands',a:'Morocco',round:'R32',v:'bbva'},
  {id:76,d:'2026-06-30',t:'1:00 PM ET',h:'Ivory Coast',a:'Norway',round:'R32',v:'att'},
  {id:77,d:'2026-06-30',t:'5:00 PM ET',h:'France',a:'Sweden',round:'R32',v:'metlife'},
  {id:78,d:'2026-06-30',t:'9:00 PM ET',h:'Mexico',a:'Ecuador',round:'R32',v:'azteca'},
  {id:79,d:'2026-07-01',t:'12:00 PM ET',h:'England',a:'DR Congo',round:'R32',v:'mercedes'},
  {id:80,d:'2026-07-01',t:'4:00 PM ET',h:'Belgium',a:'Senegal',round:'R32',v:'lumen'},
  {id:81,d:'2026-07-01',t:'8:00 PM ET',h:'United States',a:'Bosnia and Herzegovina',round:'R32',v:'levis'},
  {id:82,d:'2026-07-02',t:'3:00 PM ET',h:'Spain',a:'Austria',round:'R32',v:'sofi'},
  {id:83,d:'2026-07-02',t:'7:00 PM ET',h:'Portugal',a:'Croatia',round:'R32',v:'bmo'},
  {id:84,d:'2026-07-02',t:'11:00 PM ET',h:'Switzerland',a:'Algeria',round:'R32',v:'bcplace'},
  {id:85,d:'2026-07-03',t:'2:00 PM ET',h:'Australia',a:'Egypt',round:'R32',v:'att'},
  {id:86,d:'2026-07-03',t:'6:00 PM ET',h:'Argentina',a:'Cape Verde',round:'R32',v:'hardrock'},
  {id:87,d:'2026-07-03',t:'9:30 PM ET',h:'Colombia',a:'Ghana',round:'R32',v:'arrowhead'},

  // ── Round of 16 ─────────────────────────────────────────────────────────────
  {id:88,d:'2026-07-04',t:'1:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'nrg'},
  {id:89,d:'2026-07-04',t:'5:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'lincoln'},
  {id:90,d:'2026-07-05',t:'4:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'metlife'},
  {id:91,d:'2026-07-05',t:'8:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'azteca'},
  {id:92,d:'2026-07-06',t:'3:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'att'},
  {id:93,d:'2026-07-06',t:'8:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'lumen'},
  {id:94,d:'2026-07-07',t:'12:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'mercedes'},
  {id:95,d:'2026-07-07',t:'4:00 PM ET',h:'TBD',a:'TBD',round:'R16',v:'bcplace'},

  // ── Quarterfinals ────────────────────────────────────────────────────────────
  {id:96,d:'2026-07-09',t:'4:00 PM ET',h:'TBD',a:'TBD',round:'QF',v:'gillette'},
  {id:97,d:'2026-07-10',t:'3:00 PM ET',h:'TBD',a:'TBD',round:'QF',v:'sofi'},
  {id:98,d:'2026-07-11',t:'5:00 PM ET',h:'TBD',a:'TBD',round:'QF',v:'hardrock'},
  {id:99,d:'2026-07-11',t:'9:00 PM ET',h:'TBD',a:'TBD',round:'QF',v:'arrowhead'},

  // ── Semifinals ───────────────────────────────────────────────────────────────
  {id:100,d:'2026-07-14',t:'3:00 PM ET',h:'TBD',a:'TBD',round:'SF',v:'att'},
  {id:101,d:'2026-07-15',t:'3:00 PM ET',h:'TBD',a:'TBD',round:'SF',v:'mercedes'},

  // ── Third Place + Final ──────────────────────────────────────────────────────
  {id:102,d:'2026-07-18',t:'5:00 PM ET',h:'TBD',a:'TBD',round:'Bronze',v:'hardrock'},
  {id:103,d:'2026-07-19',t:'3:00 PM ET',h:'TBD',a:'TBD',round:'Final',v:'metlife'},
];

export function todayStr() {
  // Use the user's local timezone so "Today" matches their local calendar date.
  // The ET-forcing approach caused PT/CT users to see the next day's date 1–3 h
  // before their local midnight. Past-match detection in useWorldCup.js now also
  // checks cachedEvents so today's finished games still show their scores.
  return new Date().toLocaleDateString('en-CA');
}

export function clampDate(d) {
  if (d < '2026-06-11') return '2026-06-11';
  if (d > '2026-07-19') return '2026-07-19';
  return d;
}

// FIFA Men's World Ranking — June 11 2026 (published on tournament start date)
// Source: ESPN / whereig.com / FIFA.com
export const FIFA_RANKING = {
  'Argentina': 1, 'Spain': 2, 'France': 3, 'England': 4, 'Portugal': 5,
  'Brazil': 6, 'Morocco': 7, 'Netherlands': 8, 'Belgium': 9, 'Germany': 10,
  'Croatia': 11, 'Colombia': 13, 'Mexico': 14, 'Senegal': 15, 'Uruguay': 16,
  'United States': 17, 'Japan': 18, 'Switzerland': 19, 'Iran': 20,
  'Turkey': 22, 'Ecuador': 23, 'Austria': 24, 'South Korea': 25,
  'Australia': 27, 'Algeria': 28, 'Egypt': 29, 'Canada': 30, 'Norway': 31,
  'Ivory Coast': 33, 'Panama': 34, 'Sweden': 38, 'Czechia': 40,
  'Paraguay': 41, 'Scotland': 42, 'Tunisia': 45, 'DR Congo': 46,
  'Uzbekistan': 50, 'Qatar': 56, 'Iraq': 57, 'South Africa': 60,
  'Saudi Arabia': 61, 'Jordan': 63, 'Bosnia and Herzegovina': 64,
  'Cape Verde': 67, 'Ghana': 73, 'Curaçao': 82, 'Haiti': 83, 'New Zealand': 85,
};

// Canonical group-stage sort: Pts → GF → FIFA ranking (lower = better)
export function cmpTeams(a, b) {
  return (
    b.pts - a.pts ||
    b.gf - a.gf ||
    (FIFA_RANKING[a.name] || 999) - (FIFA_RANKING[b.name] || 999)
  );
}

// Factory version that accepts a live rankings map (from public/fifa_ranking.yaml)
export function makeCmpTeams(rankings) {
  return function cmp(a, b) {
    return (
      b.pts - a.pts ||
      b.gf - a.gf ||
      (rankings[a.name] || 999) - (rankings[b.name] || 999)
    );
  };
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
  // compute from finished group stage matches
  matches.forEach(m => {
    if (m.status !== 'finished' || !m.g || m.homeScore === undefined || m.awayScore === undefined) return;
    const h = stand[m.h], a = stand[m.a];
    if (!h || !a) return;
    h.mp++; a.mp++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;
    if (m.homeScore > m.awayScore)      { h.w++; h.pts += 3; a.l++; }
    else if (m.homeScore < m.awayScore) { a.w++; a.pts += 3; h.l++; }
    else                                { h.d++; h.pts++;    a.d++; a.pts++; }
  });
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
    .sort(cmpTeams);
}
