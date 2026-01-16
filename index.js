import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // Config optimisée pour connexions mobiles instables
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
  upgradeTimeout: 30000
});

// ==================== SCÉNARIO AVEC CHOIX ====================

const scenarios = [
  {
    id: 'maintenance-urgente',
    title: 'La maintenance urgente',
    context: "Un scanner IRM est tombé en panne ce matin. Une situation tendue se profile entre l'assistant ingénieur et l'ingénieur biomédical...",
    
    briefings: {
      assistant: {
        role: "Assistant Ingénieur Biomédical",
        name: "Alex",
        situation: `Tu es Alex, assistant ingénieur biomédical depuis 2 ans.

🔴 CE QUI S'EST PASSÉ :
Ce matin, le scanner IRM est tombé en panne. Tu as diagnostiqué le problème (système de refroidissement) et commandé la pièce - elle arrive demain matin.

😤 TA FRUSTRATION :
- Ton responsable Morgan remet toujours en question tes décisions
- Tu as l'impression de ne jamais avoir de reconnaissance
- Tu veux plus d'autonomie

🎯 TON OBJECTIF :
Défendre ta décision tout en maintenant une relation professionnelle.`
      },
      ingenieur: {
        role: "Ingénieur Biomédical",
        name: "Morgan",
        situation: `Tu es Morgan, ingénieur biomédical responsable du service.

🔴 CE QUI S'EST PASSÉ :
Le scanner IRM est en panne. Tu étais en réunion toute la matinée. Tu découvres qu'Alex a commandé une pièce sans te consulter. Le directeur t'a convoqué à 17h.

😤 TA FRUSTRATION :
- Alex prend des décisions seul sans t'informer
- Tu te retrouves à justifier des choix que tu n'as pas faits
- Tu es sous pression de la direction

🎯 TON OBJECTIF :
Comprendre la situation et recadrer la communication, sans braquer Alex.`
      }
    },
    
    // Étapes pour chaque rôle
    steps: {
      assistant: [
        {
          id: 1,
          context: "Morgan t'appelle. Tu décroches et tu sens déjà une tension dans sa voix.",
          otherMessage: "Alex, je sors de réunion et j'apprends que le scanner est en panne depuis ce matin. Tu peux m'expliquer ce qui se passe ? Et pourquoi je ne suis pas au courant ?",
          question: "Comment réagis-tu ?",
          choices: [
            {
              text: "C'est bon, j'ai géré. La pièce arrive demain. Pas besoin de paniquer.",
              score: 0,
              feedback: "Cette réponse est défensive et minimise les préoccupations de Morgan. Elle risque d'escalader le conflit.",
              tip: "Même si tu as bien géré, reconnaître le besoin d'information de l'autre aide à désamorcer."
            },
            {
              text: "Oui, j'aurais dû te prévenir plus tôt. Voilà la situation : panne du système de refroidissement, j'ai diagnostiqué et commandé la pièce, livraison demain 8h.",
              score: 3,
              feedback: "Excellent ! Tu reconnais le manque de communication tout en présentant les faits de manière structurée. C'est assertif sans être agressif.",
              tip: "Commencer par reconnaître un point valide de l'autre désarme souvent la tension."
            },
            {
              text: "Tu étais en réunion, j'ai fait ce qu'il fallait. Qu'est-ce que tu aurais voulu que je fasse, que j'attende ?",
              score: 1,
              feedback: "Tu te justifies mais de manière accusatoire. La question rhétorique finale peut être perçue comme agressive.",
              tip: "Les questions rhétoriques en situation de tension sont rarement productives."
            },
            {
              text: "Je comprends que c'est frustrant de ne pas avoir été informé. J'ai pris la décision de commander la pièce car c'était urgent. On peut en discuter ?",
              score: 2,
              feedback: "Bonne approche empathique, mais tu pourrais être plus factuel sur ce qui s'est passé avant de proposer de discuter.",
              tip: "L'empathie + les faits + la proposition = combo gagnant."
            }
          ]
        },
        {
          id: 2,
          otherMessage: "Le chef de radiologie m'est tombé dessus. Il a 12 patients à reprogrammer. Tu as pensé à une solution temporaire ?",
          context: "Morgan semble stressé. Tu sais qu'une réparation temporaire existe mais elle est risquée (50% de chance d'échec qui casserait tout pour 3 semaines).",
          question: "Que réponds-tu ?",
          choices: [
            {
              text: "Non, la pièce arrive demain, c'est la meilleure solution. Point.",
              score: 1,
              feedback: "Tu as raison sur le fond, mais la communication est trop sèche et ne prend pas en compte la pression que subit Morgan.",
              tip: "Avoir raison ne suffit pas - la façon de communiquer compte autant."
            },
            {
              text: "Il existe une réparation temporaire, mais elle a 50% de chance d'échouer et de casser le scanner pour 3 semaines. Je peux te montrer mon analyse si tu veux.",
              score: 3,
              feedback: "Parfait ! Tu partages une information importante avec transparence et proposes de collaborer sur la décision.",
              tip: "Partager les risques permet une prise de décision éclairée ensemble."
            },
            {
              text: "Tu veux que je tente un truc risqué juste pour calmer le chef de radio ? C'est toi qui assumeras si ça casse tout ?",
              score: 0,
              feedback: "Réponse défensive et accusatoire. Tu mets Morgan dans une position difficile plutôt que de chercher une solution ensemble.",
              tip: "Évite de mettre l'autre 'au pied du mur' - ça bloque la collaboration."
            },
            {
              text: "Je comprends la pression. Il y a une option temporaire mais risquée. Qu'est-ce qui est le plus important : tenter le coup ou sécuriser la réparation définitive ?",
              score: 2,
              feedback: "Bonne approche collaborative. Tu aurais pu donner plus de détails sur le risque pour que Morgan puisse vraiment décider.",
              tip: "Poser la bonne question aide l'autre à réfléchir avec toi."
            }
          ]
        },
        {
          id: 3,
          otherMessage: "Ok, je comprends ton raisonnement. Mais à l'avenir, j'ai besoin d'être informé de ce type de décision, même si je suis en réunion. Un SMS suffit.",
          context: "Morgan fait un pas vers toi. C'est l'occasion de clarifier les choses pour l'avenir.",
          question: "Comment conclus-tu ?",
          choices: [
            {
              text: "D'accord, je t'enverrai un SMS. Mais j'aimerais aussi qu'on définisse clairement ce que je peux décider seul ou pas.",
              score: 3,
              feedback: "Excellent ! Tu acceptes le feedback ET tu proposes d'améliorer le cadre de travail. C'est constructif et professionnel.",
              tip: "Transformer un recadrage en opportunité d'amélioration montre ta maturité."
            },
            {
              text: "Ok, si tu veux.",
              score: 1,
              feedback: "Réponse minimale qui ne construit rien. Tu acceptes passivement sans t'engager vraiment.",
              tip: "Un conflit bien géré peut renforcer la relation - ne rate pas cette opportunité."
            },
            {
              text: "Entendu. Et de mon côté, j'apprécierais d'avoir plus de retours positifs quand je gère bien une situation. Ça me motiverait.",
              score: 2,
              feedback: "Bien de formuler ton besoin de reconnaissance. Le timing est bon car Morgan vient de faire un pas vers toi.",
              tip: "Exprimer ses besoins de façon assertive (pas plaintive) est une compétence clé."
            },
            {
              text: "Si tu me faisais plus confiance, on n'en serait pas là. Mais ok, je t'enverrai un SMS.",
              score: 0,
              feedback: "Tu gâches le moment de réconciliation en remettant une couche de reproche. Morgan faisait un effort.",
              tip: "Quand l'autre fait un pas, fais-en un aussi. Ne rouvre pas les plaies."
            }
          ]
        },
        {
          id: 4,
          otherMessage: "Je vais appeler le chef de radio pour lui expliquer la situation. Tu veux qu'on le fasse ensemble ou tu préfères que je gère ?",
          context: "Morgan te propose de t'impliquer dans la communication avec le chef de radiologie.",
          question: "Que choisis-tu ?",
          choices: [
            {
              text: "Je préfère que tu gères, c'est toi le responsable. Je reste dispo si tu as besoin d'infos techniques.",
              score: 2,
              feedback: "Réponse raisonnable qui respecte la hiérarchie tout en restant disponible. Un peu en retrait peut-être.",
              tip: "Parfois s'impliquer davantage montre ton engagement et ta maturité."
            },
            {
              text: "On peut le faire ensemble. Je t'explique le diagnostic technique, tu gères la partie relationnelle ?",
              score: 3,
              feedback: "Parfait ! Tu proposes une collaboration qui valorise les compétences de chacun. C'est un vrai travail d'équipe.",
              tip: "Proposer une répartition claire des rôles facilite la collaboration."
            },
            {
              text: "Je peux le faire seul si tu veux, j'ai toutes les infos.",
              score: 1,
              feedback: "Tu veux montrer ton autonomie, mais dans ce contexte, ça peut sembler vouloir court-circuiter Morgan.",
              tip: "L'autonomie c'est bien, mais le timing compte. Ici, collaborer renforce la relation."
            },
            {
              text: "C'est toi qui t'es fait engueuler, c'est à toi de gérer.",
              score: 0,
              feedback: "Réponse passive-agressive qui ne construit rien. Tu rates une opportunité de montrer ton professionnalisme.",
              tip: "Même si c'est vrai, le dire ainsi est contre-productif."
            }
          ]
        }
      ],
      
      ingenieur: [
        {
          id: 1,
          context: "Tu viens de sortir de réunion. Tu as 15 messages du chef de radiologie, furieux. Tu découvres que le scanner est en panne depuis ce matin et qu'Alex a pris des décisions sans te consulter.",
          otherMessage: null,
          question: "Tu appelles Alex. Comment ouvres-tu la conversation ?",
          choices: [
            {
              text: "Alex, c'est quoi ce bordel ? Pourquoi je ne suis au courant de rien ?!",
              score: 0,
              feedback: "Tu décharges ta frustration sur Alex alors que tu ne connais pas encore tous les faits. Ça va braquer la conversation.",
              tip: "Même sous stress, prendre 10 secondes pour formuler calmement change tout."
            },
            {
              text: "Alex, je sors de réunion et j'apprends que le scanner est en panne depuis ce matin. Tu peux m'expliquer ce qui se passe ? Et pourquoi je ne suis pas au courant ?",
              score: 3,
              feedback: "Parfait. Tu exprimes le problème (manque d'info) sans accuser, et tu demandes des explications. Ton ton est ferme mais ouvert.",
              tip: "Décrire les faits + poser une question ouverte = bon début."
            },
            {
              text: "Alex, j'ai besoin de comprendre la situation avec le scanner. Qu'est-ce qui s'est passé exactement ?",
              score: 2,
              feedback: "Bonne approche factuelle, mais tu ne mentionnes pas ton besoin d'être informé. Le problème de communication reste implicite.",
              tip: "Être explicite sur ce qui t'a posé problème aide l'autre à comprendre."
            },
            {
              text: "Alex, le chef de radio m'a hurlé dessus. Tu réalises dans quelle position tu me mets ?",
              score: 1,
              feedback: "Tu partages ta frustration mais de manière accusatoire. Alex risque de se mettre sur la défensive.",
              tip: "Exprimer son ressenti c'est bien, mais 'tu me mets' est accusateur."
            }
          ]
        },
        {
          id: 2,
          otherMessage: "Oui, j'aurais dû te prévenir plus tôt. Voilà la situation : panne du système de refroidissement, j'ai diagnostiqué et commandé la pièce, livraison demain 8h.",
          context: "Alex reconnaît le manque de communication et t'explique la situation. Le chef de radiologie attend une réponse.",
          question: "Comment réagis-tu ?",
          choices: [
            {
              text: "Ok, merci pour l'explication. Demain 8h, c'est noté. Mais on a 12 patients aujourd'hui. Il y a une solution temporaire possible ?",
              score: 3,
              feedback: "Excellent ! Tu accuses réception positivement, puis tu cherches des solutions sans t'attarder sur le passé.",
              tip: "Une fois le problème reconnu, passer en mode solution est très efficace."
            },
            {
              text: "Demain ?! Et aujourd'hui on fait quoi ? Tu aurais dû me consulter avant de commander !",
              score: 1,
              feedback: "Tu reviens sur le passé alors qu'Alex a déjà reconnu son erreur. Ça ne fait pas avancer la situation.",
              tip: "Quand l'autre reconnaît une erreur, inutile d'en rajouter."
            },
            {
              text: "Bon, c'est fait maintenant. On verra pour la suite. Je vais gérer le chef de radio.",
              score: 1,
              feedback: "Tu fermes la discussion sans vraiment collaborer. Alex reste à l'écart de la résolution.",
              tip: "Impliquer l'autre dans la solution renforce l'équipe."
            },
            {
              text: "D'accord. Le chef de radiologie m'est tombé dessus - il a 12 patients à reprogrammer. Tu as pensé à une solution temporaire ?",
              score: 2,
              feedback: "Bonne transition vers le problème concret. Tu aurais pu d'abord accuser réception de son explication.",
              tip: "Un petit 'merci pour l'explication' avant de passer au problème suivant adoucit l'échange."
            }
          ]
        },
        {
          id: 3,
          otherMessage: "Il existe une réparation temporaire, mais elle a 50% de chance d'échouer et de casser le scanner pour 3 semaines. Je peux te montrer mon analyse si tu veux.",
          context: "Alex te partage une info importante avec transparence. C'est une décision à prendre ensemble.",
          question: "Que décides-tu ?",
          choices: [
            {
              text: "50% de risque de tout casser ? Non, on attend demain. C'est la bonne décision. Bien vu d'avoir identifié ce risque.",
              score: 3,
              feedback: "Tu prends une décision claire en reconnaissant le bon travail d'Alex. Tu renforces sa confiance tout en assumant ton rôle.",
              tip: "Valider le travail de l'autre tout en décidant renforce le lien hiérarchique sain."
            },
            {
              text: "Ok, on attend demain. Je vais devoir expliquer ça au directeur à 17h.",
              score: 2,
              feedback: "Tu décides mais sans vraiment reconnaître l'apport d'Alex. Tu restes centré sur ta propre pression.",
              tip: "Reconnaître l'effort des autres ne coûte rien et rapporte beaucoup."
            },
            {
              text: "Pourquoi tu ne m'as pas parlé de cette option plus tôt ?",
              score: 0,
              feedback: "Tu cherches encore à reprocher alors qu'Alex vient de faire preuve de transparence. Tu décourages ce comportement.",
              tip: "Punir la transparence garantit qu'on ne te dira plus rien à l'avenir."
            },
            {
              text: "Tente la réparation temporaire. Au moins on aura essayé.",
              score: 1,
              feedback: "Tu prends un risque important (3 semaines de panne potentielle) pour une solution court-terme. La pression t'a fait décider trop vite.",
              tip: "Sous pression, on a tendance à agir vite plutôt que bien. Prends le temps de peser."
            }
          ]
        },
        {
          id: 4,
          context: "Le conflit immédiat est résolu. C'est le moment de clarifier les choses pour l'avenir.",
          otherMessage: null,
          question: "Comment conclus-tu l'échange avec Alex ?",
          choices: [
            {
              text: "Bon, c'est réglé pour cette fois. On en reparle plus tard.",
              score: 1,
              feedback: "Tu fermes la discussion sans tirer les leçons. Le même problème risque de se reproduire.",
              tip: "Prendre 2 minutes pour clarifier l'avenir évite des heures de conflits futurs."
            },
            {
              text: "À l'avenir, j'ai besoin d'être informé de ce type de décision, même si je suis en réunion. Un SMS suffit. On est d'accord ?",
              score: 3,
              feedback: "Parfait ! Tu poses un cadre clair et concret pour l'avenir, sans être punitif. C'est du management constructif.",
              tip: "Un recadrage efficace est spécifique, actionnable et tourné vers l'avenir."
            },
            {
              text: "La prochaine fois, tu me consultes. Point.",
              score: 1,
              feedback: "Tu poses une règle mais de façon autoritaire et vague. Ça peut créer de la frustration sans vraiment clarifier.",
              tip: "Les règles vagues ('tu me consultes') laissent trop de place à l'interprétation."
            },
            {
              text: "Merci d'avoir géré la situation. À l'avenir, tiens-moi informé même en réunion, un SMS suffit. Et si tu veux, on peut définir ensemble ce que tu peux décider seul.",
              score: 3,
              feedback: "Excellent ! Tu reconnais le travail, tu poses le cadre, et tu proposes d'améliorer le fonctionnement ensemble. Management exemplaire.",
              tip: "Reconnaissance + cadre + proposition = recadrage qui renforce la relation."
            }
          ]
        },
        {
          id: 5,
          otherMessage: "D'accord, je t'enverrai un SMS. Mais j'aimerais aussi qu'on définisse clairement ce que je peux décider seul ou pas.",
          context: "Alex accepte ton feedback et propose d'améliorer le cadre de travail.",
          question: "Comment réagis-tu à cette demande ?",
          choices: [
            {
              text: "Bonne idée. On prend un café demain matin pour en discuter ? Comme ça on sera au clair pour la suite.",
              score: 3,
              feedback: "Tu accueilles positivement la proposition et tu t'engages concrètement. C'est une excellente façon de transformer un conflit en amélioration.",
              tip: "Proposer un moment précis montre que tu prends la demande au sérieux."
            },
            {
              text: "On verra ça plus tard, là j'ai le directeur à gérer.",
              score: 1,
              feedback: "Tu repousses une demande légitime. Alex risque de penser que tu ne prends pas ses besoins au sérieux.",
              tip: "Dire 'plus tard' sans date précise = souvent 'jamais'."
            },
            {
              text: "C'est simple : les décisions techniques de moins de 1000€, tu gères. Au-dessus, tu me consultes.",
              score: 2,
              feedback: "Tu donnes une règle claire, ce qui est bien. Mais une discussion plus approfondie permettrait de couvrir plus de cas.",
              tip: "Une règle simple c'est bien, mais un échange permet de s'assurer qu'on se comprend."
            },
            {
              text: "Tu veux plus d'autonomie ? Montre-moi d'abord que je peux te faire confiance.",
              score: 0,
              feedback: "Réponse conditionnelle et vaguement menaçante. Tu ignores qu'Alex vient justement de bien gérer une situation difficile.",
              tip: "Demander de 'prouver' sans critères clairs crée de l'insécurité, pas de la motivation."
            }
          ]
        }
      ]
    },
    
    // Points d'apprentissage basés sur le cours
    learningPoints: [
      {
        title: "Définition du conflit (Larousse)",
        content: "Un conflit c'est une opposition d'intérêts entre deux ou plusieurs parties dont la solution peut être recherchée soit par des mesures de violence, soit par des négociations, soit par l'appel à une tierce personne. Dans notre scénario, la négociation directe était la meilleure approche."
      },
      {
        title: "Les causes de conflits",
        content: "Ce scénario illustrait plusieurs causes classiques : mauvaise communication / manque d'information (Alex n'a pas prévenu Morgan), différences de personnalité et de valeurs (autonomie vs contrôle), et conflits liés à l'organisation du travail (qui décide de quoi ?)."
      },
      {
        title: "Type de conflit : Interpersonnel",
        content: "Ce conflit entre Alex et Morgan est un conflit interpersonnel classique - entre deux individus ayant des intérêts ou perceptions divergentes. C'est le type le plus fréquent en entreprise et celui où vos compétences relationnelles font la différence."
      },
      {
        title: "Effets négatifs évités",
        content: "Un conflit mal géré aurait pu causer : baisse de productivité, détérioration du climat de travail, voire turnover. Heureusement, une bonne gestion transforme le conflit en opportunité d'amélioration."
      },
      {
        title: "Effets positifs d'un conflit bien géré",
        content: "Ce conflit a permis : une meilleure clarification des rôles et attentes (qui décide quoi), un renforcement potentiel de la cohésion après résolution, et même une source d'amélioration des processus (le SMS pour informer)."
      },
      {
        title: "Stratégies de prévention",
        content: "Pour éviter ce type de conflit à l'avenir : bonne communication (informer même en urgence), management participatif (impliquer dans les décisions), identifier les causes rapidement, et organiser des points réguliers (réunions)."
      },
      {
        title: "L'iceberg du conflit",
        content: "Dans un conflit, on ne voit que 10% de la situation de l'autre. Alex ne savait pas que Morgan était sous pression du directeur. Morgan ne savait pas qu'Alex avait travaillé 3h sur le diagnostic. Toujours chercher ce qu'on ne voit pas."
      },
      {
        title: "Les besoins derrière les positions",
        content: "Alex défendait sa décision, mais son vrai besoin était la reconnaissance et l'autonomie. Morgan voulait être consulté, mais son vrai besoin était de ne pas être mis en difficulté. Identifier les besoins permet de trouver des solutions gagnant-gagnant."
      }
    ],
    
    // Profils de personnalité basés sur les choix
    personalityProfiles: {
      collaborative: {
        name: "Le Collaboratif",
        emoji: "🤝",
        description: "Tu cherches naturellement le dialogue et la compréhension mutuelle. Tu reconnais facilement tes torts et tu proposes des solutions constructives.",
        strengths: ["Empathie", "Écoute active", "Recherche de consensus"],
        advice: "Attention à ne pas trop céder pour éviter le conflit - tes besoins comptent aussi !"
      },
      assertive: {
        name: "L'Assertif",
        emoji: "💪",
        description: "Tu sais défendre ta position tout en restant respectueux. Tu exprimes clairement tes besoins sans agresser l'autre.",
        strengths: ["Communication claire", "Confiance en soi", "Équilibre"],
        advice: "Continue comme ça ! L'assertivité est la compétence clé en gestion de conflit."
      },
      defensive: {
        name: "Le Défensif",
        emoji: "🛡️",
        description: "Face au conflit, tu as tendance à te justifier et à protéger ta position. C'est humain, mais ça peut escalader la tension.",
        strengths: ["Conviction", "Ténacité", "Protection de ses intérêts"],
        advice: "Essaie d'abord d'écouter et comprendre l'autre avant de te défendre. Reconnaître un point valide désarme souvent l'adversaire."
      },
      avoiding: {
        name: "L'Évitant",
        emoji: "🏃",
        description: "Tu préfères minimiser le conflit ou t'en retirer. Ça peut fonctionner à court terme mais les problèmes non résolus reviennent souvent.",
        strengths: ["Calme", "Non-escalade", "Patience"],
        advice: "Certains conflits méritent d'être affrontés. Exprimer tes besoins n'est pas agressif, c'est sain."
      },
      aggressive: {
        name: "Le Combatif",
        emoji: "⚔️",
        description: "Tu n'hésites pas à confronter directement, parfois de manière trop frontale. Ta franchise est une force, mais le ton peut blesser.",
        strengths: ["Franchise", "Détermination", "Pas peur du conflit"],
        advice: "Essaie la méthode CNV : Observation (faits) → Sentiment → Besoin → Demande. Ça garde ta franchise tout en respectant l'autre."
      }
    }
  }
];

// ==================== CALCUL DU PROFIL DE PERSONNALITÉ ====================

function calculatePersonality(choices, totalScore, maxScore) {
  const percentage = (totalScore / maxScore) * 100;
  
  // Analyser les patterns de réponses
  let aggressiveCount = 0;
  let defensiveCount = 0;
  let collaborativeCount = 0;
  let avoidingCount = 0;
  
  choices?.forEach(choice => {
    const score = choice.score;
    const text = choice.choice?.text?.toLowerCase() || '';
    
    // Analyser le score et le contenu
    if (score === 0) {
      // Réponses à 0 points = souvent agressives ou très défensives
      if (text.includes('?!') || text.includes('tu ') || text.includes('c\'est toi')) {
        aggressiveCount++;
      } else {
        defensiveCount++;
      }
    } else if (score === 1) {
      // Réponses à 1 point = défensives ou évitantes
      if (text.includes('ok') && text.length < 50) {
        avoidingCount++;
      } else {
        defensiveCount++;
      }
    } else if (score === 2) {
      // Réponses à 2 points = bonnes mais pas optimales
      collaborativeCount += 0.5;
      defensiveCount += 0.5;
    } else if (score === 3) {
      // Réponses à 3 points = collaboratives/assertives
      collaborativeCount++;
    }
  });
  
  // Déterminer le profil dominant
  const profiles = scenarios[0].personalityProfiles;
  
  if (percentage >= 75) {
    // Excellent score = Assertif ou Collaboratif
    return collaborativeCount > (choices?.length || 1) * 0.6 
      ? profiles.collaborative 
      : profiles.assertive;
  } else if (percentage >= 50) {
    // Score moyen
    if (collaborativeCount >= defensiveCount) {
      return profiles.collaborative;
    } else {
      return profiles.defensive;
    }
  } else if (percentage >= 25) {
    // Score faible
    if (aggressiveCount >= defensiveCount && aggressiveCount >= avoidingCount) {
      return profiles.aggressive;
    } else if (avoidingCount >= defensiveCount) {
      return profiles.avoiding;
    } else {
      return profiles.defensive;
    }
  } else {
    // Très faible score
    return aggressiveCount > avoidingCount ? profiles.aggressive : profiles.defensive;
  }
}

// ==================== GESTION DES SESSIONS ====================

const sessions = new Map();
const players = new Map();

function createSession() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const session = {
    code,
    players: [],
    scenario: scenarios[0],
    phase: 'waiting',
    results: {}
  };
  sessions.set(code, session);
  return session;
}

function joinSession(sessionCode, socketId, playerName) {
  const session = sessions.get(sessionCode.toUpperCase());
  if (!session) return { error: 'Session introuvable' };
  if (session.players.length >= 2) return { error: 'Session complète' };
  
  const role = session.players.length === 0 
    ? (Math.random() > 0.5 ? 'assistant' : 'ingenieur')
    : (session.players[0].role === 'assistant' ? 'ingenieur' : 'assistant');
  
  const player = {
    id: socketId,
    name: playerName,
    role,
    ready: false
  };
  
  session.players.push(player);
  players.set(socketId, { sessionCode: session.code, ...player });
  
  return { success: true, session, player };
}

// ==================== SOCKET.IO ====================

io.on('connection', (socket) => {
  console.log(`🔌 Connexion: ${socket.id}`);
  
  socket.on('create-session', (playerName, callback) => {
    const session = createSession();
    const result = joinSession(session.code, socket.id, playerName);
    socket.join(session.code);
    callback(result);
    console.log(`📝 Session créée: ${session.code}`);
  });
  
  socket.on('join-session', (sessionCode, playerName, callback) => {
    const result = joinSession(sessionCode, socket.id, playerName);
    if (result.success) {
      socket.join(sessionCode.toUpperCase());
      socket.to(sessionCode.toUpperCase()).emit('player-joined', result.player);
    }
    callback(result);
  });
  
  socket.on('player-ready', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const session = sessions.get(playerData.sessionCode);
    if (!session) return;
    
    const player = session.players.find(p => p.id === socket.id);
    if (player) player.ready = true;
    
    io.to(session.code).emit('player-ready-update', session.players);
    
    if (session.players.length === 2 && session.players.every(p => p.ready)) {
      startPhase(session, 'briefing');
    }
  });
  
  socket.on('briefing-done', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const session = sessions.get(playerData.sessionCode);
    if (!session) return;
    
    const player = session.players.find(p => p.id === socket.id);
    if (player) player.briefingDone = true;
    
    if (session.players.every(p => p.briefingDone)) {
      startPhase(session, 'roleplay');
    }
  });
  
  socket.on('roleplay-complete', (results) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const session = sessions.get(playerData.sessionCode);
    if (!session) return;
    
    // Calculer le profil de personnalité basé sur les scores
    const personality = calculatePersonality(results.choices, results.totalScore, results.maxScore);
    
    session.results[socket.id] = {
      playerName: playerData.name,
      playerRole: playerData.role,
      personality,
      ...results
    };
    
    io.to(session.code).emit('player-finished', {
      playerId: socket.id,
      playerName: playerData.name
    });
    
    if (Object.keys(session.results).length === 2) {
      startPhase(session, 'results');
    }
  });
  
  socket.on('go-to-learning', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const session = sessions.get(playerData.sessionCode);
    if (!session) return;
    
    startPhase(session, 'learning');
  });
  
  // Rejoindre une session après reconnexion
  socket.on('rejoin-session', (sessionCode, playerName) => {
    const session = sessions.get(sessionCode?.toUpperCase());
    if (!session) {
      socket.emit('rejoin-failed', 'Session expirée');
      return;
    }
    
    // Trouver le joueur existant par son nom
    const existingPlayer = session.players.find(p => p.name === playerName);
    if (existingPlayer) {
      // Mettre à jour l'ID du socket
      const oldId = existingPlayer.id;
      existingPlayer.id = socket.id;
      
      // Mettre à jour la map des joueurs
      players.delete(oldId);
      players.set(socket.id, { sessionCode: session.code, ...existingPlayer });
      
      // Rejoindre la room
      socket.join(session.code);
      
      // Renvoyer l'état actuel
      let data = { 
        phase: session.phase,
        player: existingPlayer,
        players: session.players
      };
      
      if (session.phase === 'briefing') {
        data.briefing = session.scenario.briefings[existingPlayer.role];
        data.scenario = { title: session.scenario.title, context: session.scenario.context };
      } else if (session.phase === 'roleplay') {
        data.scenario = { ...session.scenario, steps: session.scenario.steps };
      } else if (session.phase === 'results') {
        data.allResults = session.results;
        data.allBriefings = session.scenario.briefings;
      } else if (session.phase === 'learning') {
        data.learningPoints = session.scenario.learningPoints;
      }
      
      socket.emit('rejoin-success', data);
      console.log(`🔄 ${playerName} reconnecté à ${sessionCode}`);
    } else {
      socket.emit('rejoin-failed', 'Joueur non trouvé');
    }
  });
  
  socket.on('disconnect', (reason) => {
    const playerData = players.get(socket.id);
    if (playerData) {
      const session = sessions.get(playerData.sessionCode);
      if (session) {
        // Ne pas supprimer immédiatement - laisser une chance de reconnecter
        // On notifie juste les autres
        console.log(`⚠️ ${playerData.name} déconnecté (${reason}) - attente reconnexion...`);
        
        // Si la déconnexion est "propre" (fermeture de page), on notifie
        if (reason === 'client namespace disconnect' || reason === 'transport close') {
          // Attendre 10 secondes avant de notifier la déconnexion
          setTimeout(() => {
            // Vérifier si le joueur s'est reconnecté entre temps
            const stillDisconnected = !Array.from(players.values()).find(
              p => p.name === playerData.name && p.sessionCode === playerData.sessionCode
            );
            if (stillDisconnected && session) {
              socket.to(session.code).emit('player-disconnected', playerData.name);
            }
          }, 10000);
        }
      }
      players.delete(socket.id);
    }
  });
});

function startPhase(session, phase) {
  session.phase = phase;
  
  session.players.forEach(player => {
    const playerSocket = io.sockets.sockets.get(player.id);
    if (playerSocket) {
      let data = { phase };
      
      if (phase === 'briefing') {
        data.briefing = session.scenario.briefings[player.role];
        data.scenario = {
          title: session.scenario.title,
          context: session.scenario.context
        };
      } else if (phase === 'roleplay') {
        data.scenario = {
          ...session.scenario,
          steps: session.scenario.steps
        };
      } else if (phase === 'results') {
        data.allResults = session.results;
        data.allBriefings = session.scenario.briefings;
      } else if (phase === 'learning') {
        data.learningPoints = session.scenario.learningPoints;
      }
      
      playerSocket.emit('phase-change', data);
    }
  });
  
  console.log(`🎮 Session ${session.code}: Phase ${phase}`);
}

// ==================== API REST ====================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', sessions: sessions.size });
});

// ==================== DÉMARRAGE ====================

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
