export const interests = [
 {icon:'⚽',name:'Football',text:'Ronaldo, Messi, Real Madrid — and the beautiful game.'},
 {icon:'𓂀',name:'History & mythology',text:'The Mahabharata is my favorite text. Greek mythology is another rabbit hole.'},
 {icon:'ϟ',name:'Other worlds',text:'Percy Jackson, Harry Potter, and stories worth getting lost in.'},
 {icon:'✧',name:'What’s next',text:'AI agents, new software, and ideas that turn into useful things.'}
];
export const funFacts = [
 {type:'ARYAN LORE',text:'Aryan’s favorite text? The Mahabharata. There’s always another layer to explore.'},
 {type:'OFF THE KEYBOARD',text:'Aryan likes soccer. A football conversation is always a good side quest.'},
 {type:'ARYAN LORE',text:'History, mythology, AI agents. Aryan’s reading list covers a lot of timelines.'},
 {type:'BOOKISH SIDE QUEST',text:'Percy Jackson and Harry Potter are on Aryan’s list of favorite worlds to explore.'},
 {type:'MAHABHARATA MOMENT',text:'Arjuna’s charioteer is Krishna. Even a great archer needs a good guide.'},
 {type:'GREEK MYTHOLOGY',text:'Athena is associated with wisdom and strategy. A fitting patron for a little debugging.'},
 {type:'PERCY JACKSON',text:'Percy is a son of Poseidon. Somewhere, a water-type Pokémon approves.'},
 {type:'HARRY POTTER',text:'Hogwarts has four houses. This portfolio has a whole party of projects.'},
 {type:'FOOTBALL ARCHIVE · 2022',text:'Ronaldo became the first man to score in five World Cup editions in 2022.',url:'https://inside.fifa.com/tournament-organisation/world-cup-2022-in-numbers/fifa-world-cup-qatar-2022-at-a-glance',label:'FIFA'},
 {type:'FOOTBALL ARCHIVE · 2022',text:'Messi scored seven goals at Qatar 2022, including two in the final.',url:'https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022/articles/world-cup-2022-qatar-the-stats-behind-argentina-triumph',label:'FIFA'},
 {type:'MADRID ARCHIVE · 2024',text:'Real Madrid’s 2024 Champions League win was their 15th European crown.',url:'https://www.uefa.com/news/0275-1541637ad1db-88aeeefefefd-1000--all-time-european-cup-honours-board/',label:'UEFA'},
 {type:'BUILDER LORE',text:'Aryan built a narrative game with 10+ cooperating AI agents. Worldbuilding, but make it distributed systems.'},
 {type:'A SMALL TROPHY CABINET',text:'Aryan won a four-hour Claude hackathon and was first runner-up at a quantum hackathon.'},
 {type:'FROM DATA TO DECISIONS',text:'Before USC, Aryan worked on data pipelines and clustering at Deloitte in Mumbai.'}
];
export function themeForHour(hour){return hour>=7&&hour<19?'day':'night';}
export function nextFact(previous,random=Math.random){if(funFacts.length<2)return 0;return (previous+1+Math.floor(random()*(funFacts.length-1)))%funFacts.length;}
