import { parse } from 'yaml';

export const TEAM_SQUADS = {
  Mexico: {
    coach: "Javier Aguirre",
    players: ["Guillermo Ochoa", "Hirving Lozano", "Raul Jimenez", "Edson Alvarez", "Cesar Montes"],
  },
  "South Korea": {
    coach: "Jurgen Klinsmann",
    players: ["Son Heung-min", "Kim Min-jae", "Lee Kang-in", "Hwang Hee-chan", "Kim Seung-gyu"],
  },
  "South Africa": {
    coach: "Hugo Broos",
    players: ["Ronwen Williams", "Percy Tau", "Themba Zwane", "Khuliso Mudau", "Teboho Mokoena"],
  },
  Czechia: {
    coach: "Ivan Hasek",
    players: ["Tomas Soucek", "Patrik Schick", "Tomas Holes", "Vaclav Cerny", "Antonin Barak"],
  },
  Canada: {
    coach: "Jesse Marsch",
    players: ["Alphonso Davies", "Jonathan David", "Tajon Buchanan", "Stephen Eustaquio", "Cyle Larin"],
  },
  Switzerland: {
    coach: "Murat Yakin",
    players: ["Granit Xhaka", "Yann Sommer", "Xherdan Shaqiri", "Manuel Akanji", "Breel Embolo"],
  },
  Qatar: {
    coach: "Tintin Marquez",
    players: ["Almoez Ali", "Akram Afif", "Hassan Al-Haydos", "Abdelkarim Hassan", "Saad Al-Sheeb"],
  },
  "Bosnia and Herzegovina": {
    coach: "Sergej Barbarez",
    players: ["Edin Dzeko", "Miralem Pjanic", "Asmir Begovic", "Sead Kolasinac", "Rade Krunic"],
  },
  Brazil: {
    coach: "Dorival Junior",
    players: ["Vinicius Junior", "Neymar", "Alisson", "Casemiro", "Marquinhos"],
  },
  Morocco: {
    coach: "Walid Regragui",
    players: ["Achraf Hakimi", "Hakim Ziyech", "Yassine Bounou", "Sofyan Amrabat", "Youssef En-Nesyri"],
  },
  Scotland: {
    coach: "Steve Clarke",
    players: ["Andy Robertson", "Scott McTominay", "Kieran Tierney", "John McGinn", "Che Adams"],
  },
  Haiti: {
    coach: "Gabriel Calderon",
    players: ["Duckens Nazon", "Derrick Etienne", "Stephane Lambese", "Ricardo Ade", "Wilde-Donald Guerrier"],
  },
  "United States": {
    coach: "Mauricio Pochettino",
    players: ["Christian Pulisic", "Weston McKennie", "Tyler Adams", "Gio Reyna", "Folarin Balogun"],
  },
  Australia: {
    coach: "Tony Popovic",
    players: ["Mat Ryan", "Aaron Mooy", "Mathew Leckie", "Jackson Irvine", "Awer Mabil"],
  },
  Paraguay: {
    coach: "Gustavo Alfaro",
    players: ["Miguel Almiron", "Gustavo Gomez", "Richard Sanchez", "Julio Enciso", "Carlos Coronel"],
  },
  Turkey: {
    coach: "Vincenzo Montella",
    players: ["Hakan Calhanoglu", "Arda Guler", "Kenan Yildiz", "Orkun Kokcu", "Baris Yilmaz"],
  },
  Germany: {
    coach: "Julian Nagelsmann",
    players: ["Joshua Kimmich", "Jamal Musiala", "Kai Havertz", "Florian Wirtz", "Antonio Rudiger"],
  },
  Ecuador: {
    coach: "Sebastian Beccacece",
    players: ["Moises Caicedo", "Enner Valencia", "Pervis Estupinan", "Gonzalo Plata", "Piero Hincapie"],
  },
  "Ivory Coast": {
    coach: "Emerse Fae",
    players: ["Franck Kessie", "Nicolas Pepe", "Sebastien Haller", "Wilfried Zaha", "Serge Aurier"],
  },
  "Curaçao": {
    coach: "Remko Bicentini",
    players: ["Leandro Bacuna", "Gervane Kastaneer", "Rangelo Janga", "Cuco Martina", "Eloy Room"],
  },
  Netherlands: {
    coach: "Ronald Koeman",
    players: ["Virgil van Dijk", "Frenkie de Jong", "Cody Gakpo", "Memphis Depay", "Denzel Dumfries"],
  },
  Japan: {
    coach: "Hajime Moriyasu",
    players: ["Takefusa Kubo", "Takumi Minamino", "Kaoru Mitoma", "Wataru Endo", "Ritsu Doan"],
  },
  Tunisia: {
    coach: "Faouzi Benzarti",
    players: ["Youssef Msakni", "Wahbi Khazri", "Ellyes Skhiri", "Dylan Bronn", "Aissa Laidouni"],
  },
  Sweden: {
    coach: "Jon Dahl Tomasson",
    players: ["Viktor Gyokeres", "Alexander Isak", "Dejan Kulusevski", "Emil Forsberg", "Robin Olsen"],
  },
  Belgium: {
    coach: "Domenico Tedesco",
    players: ["Kevin De Bruyne", "Romelu Lukaku", "Thibaut Courtois", "Jeremy Doku", "Amadou Onana"],
  },
  Iran: {
    coach: "Amir Ghalenoei",
    players: ["Sardar Azmoun", "Mehdi Taremi", "Alireza Jahanbakhsh", "Saman Ghoddos", "Alireza Beiranvand"],
  },
  Egypt: {
    coach: "Hossam Hassan",
    players: ["Mohamed Salah", "Mohamed Elneny", "Omar Marmoush", "Mahmoud Trezeguet", "Mohamed El-Shenawy"],
  },
  "New Zealand": {
    coach: "Darren Bazeley",
    players: ["Chris Wood", "Winston Reid", "Ryan Thomas", "Liberato Cacace", "Joe Bell"],
  },
  Spain: {
    coach: "Luis de la Fuente",
    players: ["Rodri", "Pedri", "Gavi", "Alvaro Morata", "Dani Carvajal"],
  },
  Uruguay: {
    coach: "Marcelo Bielsa",
    players: ["Federico Valverde", "Darwin Nunez", "Ronald Araujo", "Luis Suarez", "Jose Gimenez"],
  },
  "Saudi Arabia": {
    coach: "Roberto Mancini",
    players: ["Salem Al-Dawsari", "Salman Al-Faraj", "Saud Abdulhamid", "Mohammed Al-Owais", "Firas Al-Buraikan"],
  },
  "Cape Verde": {
    coach: "Bubista",
    players: ["Bebeto", "Ryan Mendes", "Jamiro Monteiro", "Garry Rodrigues", "Vozinha"],
  },
  France: {
    coach: "Didier Deschamps",
    players: ["Kylian Mbappe", "Antoine Griezmann", "Aurelien Tchouameni", "Eduardo Camavinga", "Mike Maignan"],
  },
  Senegal: {
    coach: "Aliou Cisse",
    players: ["Sadio Mane", "Kalidou Koulibaly", "Edouard Mendy", "Idrissa Gueye", "Ismaila Sarr"],
  },
  Norway: {
    coach: "Stale Solbakken",
    players: ["Erling Haaland", "Martin Odegaard", "Alexander Sorloth", "Leo Ostigard", "Orjan Nyland"],
  },
  Iraq: {
    coach: "Jesus Casas",
    players: ["Ayman Hussein", "Ali Jasim", "Ibrahim Bayesh", "Jalal Hassan", "Amjad Attwan"],
  },
  Argentina: {
    coach: "Lionel Scaloni",
    players: ["Lionel Messi", "Julian Alvarez", "Emiliano Martinez", "Rodrigo De Paul", "Alexis Mac Allister"],
  },
  Algeria: {
    coach: "Vladimir Petkovic",
    players: ["Riyad Mahrez", "Islam Slimani", "Youcef Belaili", "Aissa Mandi", "Rais M'Bolhi"],
  },
  Austria: {
    coach: "Ralf Rangnick",
    players: ["Marcel Sabitzer", "David Alaba", "Marko Arnautovic", "Konrad Laimer", "Patrick Wimmer"],
  },
  Jordan: {
    coach: "Jamal Sellami",
    players: ["Mousa Al-Tamari", "Yazan Al-Naimat", "Yazeed Abu Laila", "Anas Bani Yaseen", "Abdallah Nasib"],
  },
  Portugal: {
    coach: "Roberto Martinez",
    players: ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Joao Cancelo", "Ruben Dias"],
  },
  "DR Congo": {
    coach: "Sebastien Desabre",
    players: ["Yoane Wissa", "Chancel Mbemba", "Cedric Bakambu", "Arthur Masuaku", "Lionel Mpasi"],
  },
  Uzbekistan: {
    coach: "Srecko Katanec",
    players: ["Eldor Shomurodov", "Otabek Shukurov", "Jaloliddin Masharipov", "Odil Ahmedov", "Utkir Yusupov"],
  },
  Colombia: {
    coach: "Nestor Lorenzo",
    players: ["James Rodriguez", "Luis Diaz", "Juan Cuadrado", "Davinson Sanchez", "Yerry Mina"],
  },
  England: {
    coach: "Gareth Southgate",
    players: ["Harry Kane", "Jude Bellingham", "Phil Foden", "Bukayo Saka", "Declan Rice"],
  },
  Croatia: {
    coach: "Zlatko Dalic",
    players: ["Luka Modric", "Mateo Kovacic", "Josko Gvardiol", "Ivan Perisic", "Dominik Livakovic"],
  },
  Ghana: {
    coach: "Otto Addo",
    players: ["Thomas Partey", "Mohammed Kudus", "Andre Ayew", "Jordan Ayew", "Alexander Djiku"],
  },
  Panama: {
    coach: "Thomas Christiansen",
    players: ["Anibal Godoy", "Jose Fajardo", "Ismael Diaz", "Eric Davis", "Luis Mejia"],
  },
};

const YAML_SQUADS_URL = '/fifa_world_cup_2026_squads.yaml';
const TEAM_NAME_ALIASES = {
  Turkey: 'Türkiye',
  'Ivory Coast': "Côte d'Ivoire",
};

function buildYamlTeamSquads(doc) {
  const confederations = doc?.confederations || {};
  const teams = {};

  Object.values(confederations).forEach((confedTeams) => {
    if (!confedTeams || typeof confedTeams !== 'object') return;

    Object.entries(confedTeams).forEach(([teamName, teamInfo]) => {
      teams[teamName] = {
        coach: teamInfo?.manager || 'Unknown',
        players: (teamInfo?.squad || []).map((player) => `${player.name} (${player.position})`),
      };
    });
  });

  return teams;
}

async function loadYamlTeamSquads() {
  return fetch(`${YAML_SQUADS_URL}?ts=${Date.now()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${YAML_SQUADS_URL}`);
      }
      return response.text();
    })
    .then((text) => parse(text))
    .then((doc) => buildYamlTeamSquads(doc))
    .catch(() => ({}));
}

function resolveTeamName(teamName, yamlTeamSquads) {
  if (yamlTeamSquads[teamName]) return teamName;
  const alias = TEAM_NAME_ALIASES[teamName];
  if (alias && yamlTeamSquads[alias]) return alias;
  return teamName;
}

export function getFallbackTeamSquad(teamName) {
  return TEAM_SQUADS[teamName] || { coach: 'Unknown', players: [] };
}

export async function getTeamSquad(teamName) {
  const yamlTeamSquads = await loadYamlTeamSquads();
  const resolvedTeam = resolveTeamName(teamName, yamlTeamSquads);
  const yamlData = yamlTeamSquads[resolvedTeam];

  if (yamlData) {
    const fallback = TEAM_SQUADS[teamName];
    return {
      coach: yamlData.coach,
      players: yamlData.players.length > 0 ? yamlData.players : (fallback?.players || []),
    };
  }
  return getFallbackTeamSquad(teamName);
}
