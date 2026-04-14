const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// --- CONFIGURATION À MODIFIER ---
const TOKEN = process.env.TOKEN;
const ID_SALON = "1493593666155970590";  

// 1. Les 30 Tickets (à mettre sur tes boutons en jeu)
let codesTickets = [
"RO-ANICCA07", "RO-ANTWORRD19", "RO-MORZINE42", "RO-LINA95-483", "RO-LINA95-771", "RO-LINA95-206", "RO-PETER188PGM88", "RO-PARANO33", "RO-PAFO61", "RO-AKAZA14", "RO-HANABI57", "RO-OEHT09", "RO-MASHA72", "RO-Z1OOM21", "RO-OCHO66", "RO-MIRYXEM11", "RO-ANONIMO90", "RO-ILLUMINATED38", "RO-BLOOM25", "RO-RUNONLY17", "RO-VOID04", "RO-CARSRUN73", "RO-GEEKRUN58", "RO-CITYLOVE12", "RO-SWEZZY99", "RO-SOS08", "RO-NADJ46", "RO-TESNIME30", "RO-RAY46", "RO-FINALE46"

];

// 2. Les 30 Récompenses (ce que le bot donne en MP)
let mesRecompenses = [
  "GIFT-ALPHA-01", "GIFT-BETA-02", "GIFT-GAMMA-03", "GIFT-DELTA-04", "GIFT-EPSILON-05",
  "GIFT-ZETA-06", "GIFT-ETA-07", "GIFT-THETA-08", "GIFT-IOTA-09", "GIFT-KAPPA-10",
  "GIFT-LAMBDA-11", "GIFT-MU-12", "GIFT-NU-13", "GIFT-XI-14", "GIFT-OMICRON-15",
  "GIFT-PI-16", "GIFT-RHO-17", "GIFT-SIGMA-18", "GIFT-TAU-19", "GIFT-UPSILON-20",
  "GIFT-PHI-21", "GIFT-CHI-22", "GIFT-PSI-23", "GIFT-OMEGA-24", "GIFT-NEON-25",
  "GIFT-SOLAR-26", "GIFT-LUNAR-27", "GIFT-VOID-28", "GIFT-PRISM-29", "GIFT-ZENITH-30"
];

client.once('ready', () => {
    console.log(`✅ Bot prêt ! Stock : ${codesTickets.length} tickets en attente.`);
});

client.on('messageCreate', async (message) => {
    // On ignore les bots et les autres salons
    if (message.author.bot || message.channel.id !== ID_SALON) return;

    const codeEntre = message.content.trim().toUpperCase();

    // Vérifie si le message est un ticket valide
    if (codesTickets.includes(codeEntre)) {
        
        // Supprime le message de l'utilisateur instantanément
        try { await message.delete(); } catch (e) { console.log("Manque permission Gérer Messages"); }

        // Vérifie si l'utilisateur a déjà eu sa récompense (mémoire JSON)
        let gagnants = JSON.parse(fs.readFileSync('./gagnants.json', 'utf-8'));
        if (gagnants.includes(message.author.id)) {
            return message.channel.send(`❌ ${message.author}, tu as déjà utilisé un CODE !`).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }

        if (mesRecompenses.length > 0) {
            // Retire le ticket utilisé de la liste
            const indexTicket = codesTickets.indexOf(codeEntre);
            codesTickets.splice(indexTicket, 1);

            // Donne une récompense au hasard
            const indexRec = Math.floor(Math.random() * mesRecompenses.length);
            const cadeau = mesRecompenses.splice(indexRec, 1)[0];

            try {
                // Envoi en DM
                await message.author.send(`🎯 Code  **${codeEntre}** validé ! Voici ton code à utiliser dans le QG.  : **${cadeau}**`);
                
                // Sauvegarde l'utilisateur dans le JSON
                gagnants.push(message.author.id);
                fs.writeFileSync('./gagnants.json', JSON.stringify(gagnants));

                // Annonce publique qui RESTE dans le salon
                await message.channel.send(`✅ **${message.author.username}** a validé un ticket de jeu !`);
                console.log(`${message.author.tag} a utilisé ${codeEntre}`);
            } catch (error) {
                await message.channel.send(`❌ ${message.author}, tes MP sont fermés !`).then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                });
            }
        } else {
            await message.channel.send("😭 Plus de récompenses disponibles !");
        }
    } else {
        // Optionnel : Supprime les messages qui ne sont pas des tickets valides pour garder le salon propre
        // try { await message.delete(); } catch (e) {}
    }
});

client.login(TOKEN);