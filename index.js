const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');

// Vérifie que le fichier gagnants.json existe
if (!fs.existsSync('./gagnants.json')) {
    fs.writeFileSync('./gagnants.json', JSON.stringify([]));
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
    console.error("❌ TOKEN manquant ! Ajoute TOKEN dans les variables d'environnement");
    process.exit(1);
}

const ID_SALON = "1493593666155970590";

// MET TON ID DISCORD ICI (active le mode développeur dans Discord > clic droit sur ton nom > Copier l'ID)
const ADMIN_ID = "1476237690079936683"; // ← REMPLACE PAR TON VRAI ID

let codesTickets = [
    "RO-ANICCA07", "RO-ANTWORRD19", "RO-MORZINE42", "RO-LINA95-483", "RO-LINA95-771", 
    "RO-LINA95-206", "RO-PETER188PGM88", "RO-PARANO33", "RO-PAFO61", "RO-AKAZA14", 
    "RO-HANABI57", "RO-OEHT09", "RO-MASHA72", "RO-Z1OOM21", "RO-OCHO66", "RO-MIRYXEM11", 
    "RO-ANONIMO90", "RO-ILLUMINATED38", "RO-BLOOM25", "RO-RUNONLY17", "RO-VOID04", 
    "RO-CARSRUN73", "RO-GEEKRUN58", "RO-CITYLOVE12", "RO-SWEZZY99", "RO-SOS08", 
    "RO-NADJ46", "RO-TESNIME30", "RO-RAY46", "RO-FINALE46"
];

let mesRecompenses = [
    "GIFT-ALPHA-01", "GIFT-BETA-02", "GIFT-GAMMA-03", "GIFT-DELTA-04", "GIFT-EPSILON-05",
    "GIFT-ZETA-06", "GIFT-ETA-07", "GIFT-THETA-08", "GIFT-IOTA-09", "GIFT-KAPPA-10",
    "GIFT-LAMBDA-11", "GIFT-MU-12", "GIFT-NU-13", "GIFT-XI-14", "GIFT-OMICRON-15",
    "GIFT-PI-16", "GIFT-RHO-17", "GIFT-SIGMA-18", "GIFT-TAU-19", "GIFT-UPSILON-20",
    "GIFT-PHI-21", "GIFT-CHI-22", "GIFT-PSI-23", "GIFT-OMEGA-24", "GIFT-NEON-25",
    "GIFT-SOLAR-26", "GIFT-LUNAR-27", "GIFT-VOID-28", "GIFT-PRISM-29", "GIFT-ZENITH-30"
];

client.once('ready', () => {
    console.log(`✅ Bot prêt ! Connecté en tant que ${client.user.tag}`);
    console.log(`📦 Stock : ${codesTickets.length} tickets disponibles`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // === COMMANDE !stats ===
    if (message.content === '!stats') {
        const gagnants = JSON.parse(fs.readFileSync('./gagnants.json', 'utf-8'));
        const codesUtilises = gagnants.length;
        const codesRestants = codesTickets.length;
        const total = codesUtilises + codesRestants;
        
        await message.channel.send(`
📊 **STATISTIQUES DES CODES**
━━━━━━━━━━━━━━━━━━━━━
✅ Codes utilisés : **${codesUtilises}**
🎫 Codes restants : **${codesRestants}**
📦 Total des codes : **${total}**
━━━━━━━━━━━━━━━━━━━━━
        `);
        return;
    }

    // === COMMANDE !reset (admin seulement) ===
    if (message.content === '!reset' && message.author.id === ADMIN_ID) {
        // Réinitialise gagnants.json
        fs.writeFileSync('./gagnants.json', JSON.stringify([]));
        
        // Réinitialise les listes de codes
        codesTickets = [
            "RO-ANICCA07", "RO-ANTWORRD19", "RO-MORZINE42", "RO-LINA95-483", "RO-LINA95-771", 
            "RO-LINA95-206", "RO-PETER188PGM88", "RO-PARANO33", "RO-PAFO61", "RO-AKAZA14", 
            "RO-HANABI57", "RO-OEHT09", "RO-MASHA72", "RO-Z1OOM21", "RO-OCHO66", "RO-MIRYXEM11", 
            "RO-ANONIMO90", "RO-ILLUMINATED38", "RO-BLOOM25", "RO-RUNONLY17", "RO-VOID04", 
            "RO-CARSRUN73", "RO-GEEKRUN58", "RO-CITYLOVE12", "RO-SWEZZY99", "RO-SOS08", 
            "RO-NADJ46", "RO-TESNIME30", "RO-RAY46", "RO-FINALE46"
        ];
        
        mesRecompenses = [
            "GIFT-ALPHA-01", "GIFT-BETA-02", "GIFT-GAMMA-03", "GIFT-DELTA-04", "GIFT-EPSILON-05",
            "GIFT-ZETA-06", "GIFT-ETA-07", "GIFT-THETA-08", "GIFT-IOTA-09", "GIFT-KAPPA-10",
            "GIFT-LAMBDA-11", "GIFT-MU-12", "GIFT-NU-13", "GIFT-XI-14", "GIFT-OMICRON-15",
            "GIFT-PI-16", "GIFT-RHO-17", "GIFT-SIGMA-18", "GIFT-TAU-19", "GIFT-UPSILON-20",
            "GIFT-PHI-21", "GIFT-CHI-22", "GIFT-PSI-23", "GIFT-OMEGA-24", "GIFT-NEON-25",
            "GIFT-SOLAR-26", "GIFT-LUNAR-27", "GIFT-VOID-28", "GIFT-PRISM-29", "GIFT-ZENITH-30"
        ];
        
        await message.channel.send("✅ **Réinitialisation complète !** 30 codes disponibles, 0 utilisé.");
        console.log("🔄 Bot réinitialisé par " + message.author.tag);
        return;
    }

    // Si ce n'est pas une commande, on vérifie si c'est un ticket
    if (message.channel.id !== ID_SALON) return;

    const codeEntre = message.content.trim().toUpperCase();

    if (codesTickets.includes(codeEntre)) {
        try { 
            await message.delete(); 
        } catch (e) { 
            console.log("❌ Permission 'Manage Messages' manquante"); 
        }

        let gagnants = JSON.parse(fs.readFileSync('./gagnants.json', 'utf-8'));
        
        if (gagnants.includes(message.author.id)) {
            return message.channel.send(`❌ ${message.author}, tu as déjà utilisé un CODE !`).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }

        if (mesRecompenses.length > 0) {
            const indexTicket = codesTickets.indexOf(codeEntre);
            codesTickets.splice(indexTicket, 1);

            const indexRec = Math.floor(Math.random() * mesRecompenses.length);
            const cadeau = mesRecompenses.splice(indexRec, 1)[0];

            try {
                await message.author.send(`🎯 Code **${codeEntre}** validé ! Voici ton code : **${cadeau}**`);
                
                gagnants.push(message.author.id);
                fs.writeFileSync('./gagnants.json', JSON.stringify(gagnants));

                await message.channel.send(`✅ **${message.author.username}** a validé un ticket de jeu !`);
                console.log(`🎉 ${message.author.tag} a utilisé ${codeEntre} → récompense: ${cadeau}`);
                console.log(`📊 Progression: ${gagnants.length}/30 codes utilisés`);
            } catch (error) {
                await message.channel.send(`❌ ${message.author}, tes MP sont fermés !`).then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                });
            }
        } else {
            await message.channel.send("😭 Plus de récompenses disponibles !");
        }
    }
});

client.login(TOKEN);
