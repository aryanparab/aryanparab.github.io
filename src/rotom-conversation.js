// Fast conversational intents are not profile lookups or generated biography answers.
export function conversationalReply(question){
 const q=question.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
 let answer;
 if(/^(?:hi|hey|hello|hiya|heya|yo|sup|good morning|good afternoon|good evening)(?: there| rotom| rotom dex| friend)?$/.test(q))
  answer='Bzzt! Hey there — I’m Rotom, Aryan’s personal Dex. Want to explore his projects, his journey, or a little Aryan lore?';
 else if(/^(?:(?:hi|hey|hello) )?(?:who are you|what are you|who is rotom|who is rotom dex|introduce yourself|whats your name|what is your name|are you a bot|are you an ai)(?: rotom)?$/.test(q))
  answer='I’m Rotom Dex — your guide to Aryan Parab! I specialize in his work, projects, skills, and interests. I can explain a project, compare his experience with a role, or point you to the relevant details. What would you like to explore?';
 else if(/^(?:how are you|how are you doing|hows it going|how is it going)(?: rotom)?$/.test(q))
  answer='Fully charged and ready to explore! What brings you here — Aryan’s engineering work, his leadership experience, or something off the clock?';
 else if(/^(?:what can you do|how can you help|help|help me|what can i ask|how do you work)(?: me)?$/.test(q))
  answer='Think of me as Aryan’s personal Pokédex. Ask me to explain his projects, explore his experience, compare his skills with a role, or discover his interests. For example: “What did he build at Cadence?” or “Which project shows his systems skills?”';
 else if(/^(?:thanks|thank you|thank you rotom|thanks rotom|ty|cheers|awesome|cool|nice|great)$/.test(q))
  answer='Anytime! There’s more in this Dex whenever you’re curious.';
 else if(/^(?:bye|goodbye|see you|see you later|good night)$/.test(q))
  answer='Catch you on the next route! Come back whenever you want to explore more about Aryan.';
 return answer?{mode:'conversation',answer,sources:[],toolRounds:0}:null;
}
