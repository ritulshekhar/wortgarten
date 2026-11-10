// grammar.ts — All German grammar reference content and drills
// Edit this file freely to adjust content.

export interface GrammarTopic {
  id: string
  title: string
  summary: string
  content: GrammarContent[]
  commonMistakes: string
  examples: { german: string; english: string }[]
  drills: Drill[]
}

export type GrammarContent =
  | { type: 'paragraph'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'heading'; text: string }
  | { type: 'highlight'; text: string }

export interface Drill {
  id: string
  question: string
  hint?: string
  options: string[]
  correct: string
  explanation: string
}

// =====================================================================
// TOPIC 1: Gender & Articles
// =====================================================================
const genderTopic: GrammarTopic = {
  id: 'gender',
  title: 'Gender & Articles',
  summary: 'Every German noun has a grammatical gender: der (masc.), die (fem.), das (neut.). The article changes in each of the 4 cases.',
  content: [
    {
      type: 'paragraph',
      text: 'German has three genders: masculine (der), feminine (die), and neuter (das). Gender must be memorised with each noun. The definite article (the) and indefinite article (a/an) both decline across four cases.',
    },
    {
      type: 'heading',
      text: 'The Four Cases — plain English',
    },
    {
      type: 'table',
      headers: ['Case', 'Role', 'Example'],
      rows: [
        ['Nominativ', 'The subject — who is doing the action', 'Der Hund schläft. (The dog sleeps.)'],
        ['Akkusativ', 'The direct object — what is being acted on', 'Ich sehe den Hund. (I see the dog.)'],
        ['Dativ', 'The indirect object — to/for whom', 'Ich gebe dem Hund Futter. (I give food to the dog.)'],
        ['Genitiv', 'Possession — whose / of what', 'Das Futter des Hundes. (The dog\'s food.)'],
      ],
    },
    {
      type: 'heading',
      text: 'Definite Articles (the)',
    },
    {
      type: 'table',
      headers: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
      rows: [
        ['Nominativ', 'der', 'die', 'das', 'die'],
        ['Akkusativ', 'den', 'die', 'das', 'die'],
        ['Dativ', 'dem', 'der', 'dem', 'den (+n)'],
        ['Genitiv', 'des (+s)', 'der', 'des (+s)', 'der'],
      ],
    },
    {
      type: 'heading',
      text: 'Indefinite Articles (a/an)',
    },
    {
      type: 'table',
      headers: ['', 'Maskulin', 'Feminin', 'Neutrum'],
      rows: [
        ['Nominativ', 'ein', 'eine', 'ein'],
        ['Akkusativ', 'einen', 'eine', 'ein'],
        ['Dativ', 'einem', 'einer', 'einem'],
        ['Genitiv', 'eines', 'einer', 'eines'],
      ],
    },
  ],
  commonMistakes: 'Forgetting that "die" is used for ALL plural nouns regardless of gender. Using "den" instead of "dem" in dative constructions.',
  examples: [
    { german: 'Der Mann kauft einen Hund.', english: 'The man buys a dog. (Nom + Akk)' },
    { german: 'Ich helfe der Frau.', english: 'I help the woman. (Dativ — helfen takes dative)' },
    { german: 'Das ist das Auto des Mannes.', english: 'That is the man\'s car. (Genitiv)' },
  ],
  drills: [
    {
      id: 'gender-1',
      question: 'Ich sehe ___ Mann. (I see the man.)',
      hint: 'Akkusativ, maskulin',
      options: ['der', 'den', 'dem', 'des'],
      correct: 'den',
      explanation: '"Mann" is masculine. In Akkusativ (direct object), maskulin → den.',
    },
    {
      id: 'gender-2',
      question: 'Er gibt ___ Frau ein Buch. (He gives the woman a book.)',
      hint: 'Dativ, feminin',
      options: ['die', 'der', 'dem', 'den'],
      correct: 'der',
      explanation: '"Frau" is feminine. In Dativ (indirect object), feminin → der.',
    },
    {
      id: 'gender-3',
      question: '___ Hund schläft. (The dog sleeps.)',
      hint: 'Nominativ, maskulin',
      options: ['Den', 'Dem', 'Der', 'Des'],
      correct: 'Der',
      explanation: '"Hund" is masculine. In Nominativ (subject), maskulin → der.',
    },
    {
      id: 'gender-4',
      question: 'Das ist das Haus ___ Lehrers. (That is the teacher\'s house.)',
      hint: 'Genitiv, maskulin',
      options: ['des', 'der', 'dem', 'den'],
      correct: 'des',
      explanation: 'In Genitiv, maskulin → des. The noun also adds -s or -es.',
    },
    {
      id: 'gender-5',
      question: 'Die Kinder spielen mit ___ Hunden. (The children play with the dogs.)',
      hint: 'Dativ, Plural',
      options: ['die', 'der', 'dem', 'den'],
      correct: 'den',
      explanation: 'In Dativ Plural, the article is "den" and nouns usually add -n.',
    },
    {
      id: 'gender-6',
      question: 'Ich kaufe ___ Buch. (I buy a book.)',
      hint: 'Indefinite article, Akkusativ, neutrum',
      options: ['ein', 'einen', 'eine', 'einem'],
      correct: 'ein',
      explanation: '"Buch" is neuter. In Akkusativ, neutrum indefinite → ein (same as Nominativ).',
    },
    {
      id: 'gender-7',
      question: 'Ich helfe ___ Jungen. (I help the boy.)',
      hint: 'Dativ, maskulin definite',
      options: ['der', 'den', 'dem', 'die'],
      correct: 'dem',
      explanation: 'In Dativ, maskulin → dem.',
    },
    {
      id: 'gender-8',
      question: 'Sie kauft ___ Kleid. (She buys a dress.)',
      hint: 'Indefinite article, Akkusativ, neutrum',
      options: ['ein', 'eine', 'einen', 'einem'],
      correct: 'ein',
      explanation: '"Kleid" is neuter. In Akkusativ, neutrum → ein.',
    },
    {
      id: 'gender-9',
      question: 'Wir fahren mit ___ Bus. (We travel by bus.)',
      hint: 'Dativ, maskulin, indefinite',
      options: ['ein', 'einen', 'einem', 'einer'],
      correct: 'einem',
      explanation: '"Bus" is masculine. In Dativ, maskulin indefinite → einem.',
    },
    {
      id: 'gender-10',
      question: 'Das ist das Spielzeug ___ Kindes. (That is the child\'s toy.)',
      hint: 'Genitiv, neutrum definite',
      options: ['des', 'der', 'dem', 'das'],
      correct: 'des',
      explanation: 'In Genitiv, neutrum → des.',
    },
    {
      id: 'gender-11',
      question: '___ Frauen sind freundlich. (The women are friendly.)',
      hint: 'Nominativ, Plural definite',
      options: ['Der', 'Die', 'Das', 'Den'],
      correct: 'Die',
      explanation: 'All plural nouns use "die" in Nominativ.',
    },
    {
      id: 'gender-12',
      question: 'Ich sehe ___ Katze. (I see the cat.)',
      hint: 'Akkusativ, feminin definite',
      options: ['den', 'die', 'der', 'das'],
      correct: 'die',
      explanation: '"Katze" is feminine. In Akkusativ, feminin → die (same as Nominativ).',
    },
    {
      id: 'gender-13',
      question: 'Das Buch gehört ___ Lehrerin. (The book belongs to the teacher-f.)',
      hint: 'Dativ, feminin definite',
      options: ['die', 'der', 'dem', 'den'],
      correct: 'der',
      explanation: 'In Dativ, feminin → der.',
    },
    {
      id: 'gender-14',
      question: 'Ich gehe in ___ Garten. (I go into the garden.)',
      hint: 'Akkusativ, maskulin — movement → Akkusativ with "in"',
      options: ['den', 'dem', 'der', 'die'],
      correct: 'den',
      explanation: 'Movement with "in" takes Akkusativ. Maskulin → den.',
    },
    {
      id: 'gender-15',
      question: 'Wir sind in ___ Garten. (We are in the garden.)',
      hint: 'Dativ, maskulin — location → Dativ with "in"',
      options: ['den', 'dem', 'der', 'die'],
      correct: 'dem',
      explanation: 'Location with "in" takes Dativ. Maskulin → dem.',
    },
  ],
}

// =====================================================================
// TOPIC 2: Possessive Articles
// =====================================================================
const possessivesTopic: GrammarTopic = {
  id: 'possessives',
  title: 'Possessive Articles',
  summary: 'mein, dein, sein, ihr, unser, euer, ihr/Ihr — all follow the ein- endings pattern.',
  content: [
    {
      type: 'paragraph',
      text: 'Possessive articles (my, your, his/her/its, our, your-pl, their/formal-your) all follow the same declension pattern as "ein". Add the correct ending based on the GENDER and CASE of the noun being possessed.',
    },
    {
      type: 'table',
      headers: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
      rows: [
        ['Nominativ', 'mein', 'meine', 'mein', 'meine'],
        ['Akkusativ', 'meinen', 'meine', 'mein', 'meine'],
        ['Dativ', 'meinem', 'meiner', 'meinem', 'meinen'],
        ['Genitiv', 'meines', 'meiner', 'meines', 'meiner'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Replace "mein-" with the stem of any possessive: dein-, sein-, ihr-, unser-, eu(e)r-, ihr-/Ihr-. The endings stay identical.',
    },
    {
      type: 'table',
      headers: ['Person', 'Stem', 'Example (Nom. masc.)'],
      rows: [
        ['ich (I)', 'mein-', 'mein Bruder'],
        ['du (you, sing.)', 'dein-', 'dein Bruder'],
        ['er/es (he/it)', 'sein-', 'sein Bruder'],
        ['sie (she)', 'ihr-', 'ihr Bruder'],
        ['wir (we)', 'unser-', 'unser Bruder'],
        ['ihr (you, pl.)', 'euer- / eur-', 'euer Bruder'],
        ['sie/Sie (they/formal you)', 'ihr-/Ihr-', 'ihr/Ihr Bruder'],
      ],
    },
    {
      type: 'highlight',
      text: 'Key examples:\n• Nominativ masc: mein Bruder (no ending)\n• Akkusativ masc: Ich sehe meinen Bruder (+en)\n• Dativ masc: mit meinem Bruder (+em)\n• Nominativ fem: meine Schwester (+e)\n• Akkusativ fem: Ich sehe meine Schwester (+e)\n• Dativ fem: mit meiner Schwester (+er)',
    },
  ],
  commonMistakes: 'Forgetting the -en ending in Akkusativ masculine ("meinen Bruder" not "mein Bruder"). Confusing "ihr" (her/their) with "Ihr" (formal your) — only distinguishable by capitalisation.',
  examples: [
    { german: 'Das ist mein Bruder.', english: 'That is my brother. (Nom. masc. — no ending)' },
    { german: 'Ich sehe meinen Bruder.', english: 'I see my brother. (Akk. masc. — +en)' },
    { german: 'mit meinem Bruder', english: 'with my brother (Dat. masc. — +em)' },
  ],
  drills: [
    {
      id: 'poss-1',
      question: 'Ich sehe ___ Bruder. (I see my brother.)',
      hint: 'mein + Akkusativ + maskulin',
      options: ['mein', 'meinen', 'meinem', 'meiner'],
      correct: 'meinen',
      explanation: '"Bruder" is masculine. Akkusativ masculine → meinen.',
    },
    {
      id: 'poss-2',
      question: 'mit ___ Mutter (with my mother)',
      hint: 'mein + Dativ + feminin',
      options: ['mein', 'meine', 'meinem', 'meiner'],
      correct: 'meiner',
      explanation: '"Mutter" is feminine. Dativ feminine → meiner.',
    },
    {
      id: 'poss-3',
      question: 'Das ist ___ Kind. (That is my child.)',
      hint: 'mein + Nominativ + neutrum',
      options: ['mein', 'meine', 'meinen', 'meinem'],
      correct: 'mein',
      explanation: '"Kind" is neuter. Nominativ neuter → mein (no ending).',
    },
    {
      id: 'poss-4',
      question: 'Ich helfe ___ Freund. (I help my friend-m.)',
      hint: 'mein + Dativ + maskulin',
      options: ['mein', 'meinen', 'meinem', 'meiner'],
      correct: 'meinem',
      explanation: '"Freund" is masculine. Dativ masculine → meinem.',
    },
    {
      id: 'poss-5',
      question: 'Das ist ___ Schwester. (That is her sister.)',
      hint: 'ihr + Nominativ + feminin',
      options: ['ihr', 'ihre', 'ihren', 'ihrem'],
      correct: 'ihre',
      explanation: '"Schwester" is feminine. Nominativ feminine → ihre.',
    },
    {
      id: 'poss-6',
      question: 'Er liebt ___ Hund. (He loves his dog.)',
      hint: 'sein + Akkusativ + maskulin',
      options: ['sein', 'seinen', 'seinem', 'seiner'],
      correct: 'seinen',
      explanation: '"Hund" is masculine. Akkusativ masculine → seinen.',
    },
    {
      id: 'poss-7',
      question: 'mit ___ Vater (with our father)',
      hint: 'unser + Dativ + maskulin',
      options: ['unser', 'unsere', 'unserem', 'unserer'],
      correct: 'unserem',
      explanation: '"Vater" is masculine. Dativ masculine → unserem.',
    },
    {
      id: 'poss-8',
      question: 'Wir sehen ___ Lehrerin. (We see your-pl. teacher-f.)',
      hint: 'euer + Akkusativ + feminin',
      options: ['eure', 'euren', 'eurem', 'eurer'],
      correct: 'eure',
      explanation: '"Lehrerin" is feminine. Akkusativ feminine → eure.',
    },
    {
      id: 'poss-9',
      question: 'Das sind ___ Bücher. (Those are my books.)',
      hint: 'mein + Nominativ + Plural',
      options: ['mein', 'meine', 'meinen', 'meiner'],
      correct: 'meine',
      explanation: 'Nominativ Plural → meine.',
    },
    {
      id: 'poss-10',
      question: 'mit ___ Kindern (with their children)',
      hint: 'ihr + Dativ + Plural',
      options: ['ihr', 'ihre', 'ihren', 'ihrem'],
      correct: 'ihren',
      explanation: 'Dativ Plural → ihren.',
    },
    {
      id: 'poss-11',
      question: 'Wegen ___ Vaters … (Because of my father …)',
      hint: 'mein + Genitiv + maskulin',
      options: ['mein', 'meines', 'meiner', 'meinen'],
      correct: 'meines',
      explanation: 'Genitiv masculine → meines. Noun adds -s: Vaters.',
    },
    {
      id: 'poss-12',
      question: 'Das ist ___ Auto. (That is his car.)',
      hint: 'sein + Nominativ + neutrum',
      options: ['sein', 'seine', 'seinen', 'seinem'],
      correct: 'sein',
      explanation: '"Auto" is neuter. Nominativ neuter → sein (no ending).',
    },
    {
      id: 'poss-13',
      question: 'mit ___ Freundin (with her girlfriend)',
      hint: 'ihr + Dativ + feminin',
      options: ['ihr', 'ihre', 'ihrem', 'ihrer'],
      correct: 'ihrer',
      explanation: '"Freundin" is feminine. Dativ feminine → ihrer.',
    },
    {
      id: 'poss-14',
      question: 'Ich gebe ___ Schwester das Buch. (I give my sister the book.)',
      hint: 'mein + Dativ + feminin',
      options: ['meine', 'meiner', 'meinem', 'meinen'],
      correct: 'meiner',
      explanation: '"Schwester" is feminine and is the indirect object (Dativ). Dativ feminine → meiner.',
    },
    {
      id: 'poss-15',
      question: 'Er hilft ___ Mutter. (He helps his mother.)',
      hint: 'sein + Dativ + feminin',
      options: ['seine', 'seiner', 'seinem', 'seinen'],
      correct: 'seiner',
      explanation: 'Dativ feminine → seiner.',
    },
  ],
}

// =====================================================================
// TOPIC 3: Verb Conjugation
// =====================================================================
const conjugationTopic: GrammarTopic = {
  id: 'conjugation',
  title: 'Verb Conjugation (Present Tense)',
  summary: 'Regular verbs: add endings to the stem. Irregular verbs change the stem vowel in du/er forms. Modals have their own forms.',
  content: [
    {
      type: 'heading',
      text: 'Regular verbs — lernen (to learn)',
    },
    {
      type: 'table',
      headers: ['Person', 'Ending', 'Example'],
      rows: [
        ['ich', '-e', 'ich lerne'],
        ['du', '-st', 'du lernst'],
        ['er/sie/es', '-t', 'er lernt'],
        ['wir', '-en', 'wir lernen'],
        ['ihr', '-t', 'ihr lernt'],
        ['sie/Sie', '-en', 'sie lernen'],
      ],
    },
    {
      type: 'heading',
      text: 'Irregular verbs — stem-vowel change in du/er/sie/es',
    },
    {
      type: 'table',
      headers: ['', 'fahren (a→ä)', 'sprechen (e→i)', 'lesen (e→ie)', 'sehen (e→ie)'],
      rows: [
        ['ich', 'fahre', 'spreche', 'lese', 'sehe'],
        ['du', 'fährst', 'sprichst', 'liest', 'siehst'],
        ['er/sie/es', 'fährt', 'spricht', 'liest', 'sieht'],
        ['wir', 'fahren', 'sprechen', 'lesen', 'sehen'],
        ['ihr', 'fahrt', 'sprecht', 'lest', 'seht'],
        ['sie/Sie', 'fahren', 'sprechen', 'lesen', 'sehen'],
      ],
    },
    {
      type: 'heading',
      text: 'sein, haben, werden',
    },
    {
      type: 'table',
      headers: ['', 'sein', 'haben', 'werden'],
      rows: [
        ['ich', 'bin', 'habe', 'werde'],
        ['du', 'bist', 'hast', 'wirst'],
        ['er/sie/es', 'ist', 'hat', 'wird'],
        ['wir', 'sind', 'haben', 'werden'],
        ['ihr', 'seid', 'habt', 'werdet'],
        ['sie/Sie', 'sind', 'haben', 'werden'],
      ],
    },
    {
      type: 'heading',
      text: 'Modal verbs',
    },
    {
      type: 'table',
      headers: ['', 'können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen/möchten'],
      rows: [
        ['ich', 'kann', 'muss', 'will', 'soll', 'darf', 'mag / möchte'],
        ['du', 'kannst', 'musst', 'willst', 'sollst', 'darfst', 'magst / möchtest'],
        ['er/sie/es', 'kann', 'muss', 'will', 'soll', 'darf', 'mag / möchte'],
        ['wir', 'können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen / möchten'],
        ['ihr', 'könnt', 'müsst', 'wollt', 'sollt', 'dürft', 'mögt / möchtet'],
        ['sie/Sie', 'können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen / möchten'],
      ],
    },
  ],
  commonMistakes: 'Applying regular endings to irregular verbs (du sprechst ✗ → du sprichst ✓). Forgetting that "ich" and "er/sie/es" have the SAME form for modals.',
  examples: [
    { german: 'Du fährst zu schnell.', english: 'You drive too fast. (stem-change a→ä)' },
    { german: 'Ich kann Deutsch sprechen.', english: 'I can speak German. (modal + infinitive at end)' },
    { german: 'Wir haben keine Zeit.', english: 'We have no time.' },
  ],
  drills: [
    {
      id: 'conj-1',
      question: 'du ___ (sprechen)',
      hint: 'e → i stem change in du form',
      options: ['sprechst', 'sprichst', 'sprechen', 'sprech'],
      correct: 'sprichst',
      explanation: '"sprechen" has e→i stem change: du sprichst.',
    },
    {
      id: 'conj-2',
      question: 'er ___ (fahren)',
      hint: 'a → ä stem change in er form',
      options: ['fahrt', 'fährt', 'fahren', 'fahre'],
      correct: 'fährt',
      explanation: '"fahren" has a→ä stem change: er fährt.',
    },
    {
      id: 'conj-3',
      question: 'ich ___ (sein)',
      options: ['bin', 'bist', 'ist', 'sind'],
      correct: 'bin',
      explanation: 'sein is highly irregular: ich bin.',
    },
    {
      id: 'conj-4',
      question: 'wir ___ (haben)',
      options: ['habt', 'habst', 'haben', 'habe'],
      correct: 'haben',
      explanation: 'wir haben — regular wir ending -en, but "h" stem.',
    },
    {
      id: 'conj-5',
      question: 'du ___ (können)',
      options: ['kann', 'kannst', 'können', 'könnst'],
      correct: 'kannst',
      explanation: 'Modal verb können: du kannst.',
    },
    {
      id: 'conj-6',
      question: 'er ___ (müssen)',
      options: ['muss', 'musst', 'müssen', 'müsst'],
      correct: 'muss',
      explanation: 'Modals: ich and er/sie/es forms are IDENTICAL. er muss.',
    },
    {
      id: 'conj-7',
      question: 'ihr ___ (sein)',
      options: ['sind', 'bist', 'seid', 'ist'],
      correct: 'seid',
      explanation: 'ihr seid — unique form of sein.',
    },
    {
      id: 'conj-8',
      question: 'du ___ (lesen)',
      hint: 'e → ie stem change, also -st drops before "st"',
      options: ['lesst', 'liest', 'lesen', 'leist'],
      correct: 'liest',
      explanation: '"lesen" → du liest (e→ie, and the extra s merges: liest not lieest).',
    },
    {
      id: 'conj-9',
      question: 'sie (they) ___ (wollen)',
      options: ['will', 'wollt', 'wollen', 'willst'],
      correct: 'wollen',
      explanation: 'sie/wir forms of modals restore the infinitive stem: wollen.',
    },
    {
      id: 'conj-10',
      question: 'ich ___ (lernen) — regular verb',
      options: ['lernt', 'lernst', 'lerne', 'lernen'],
      correct: 'lerne',
      explanation: 'Regular verb, ich form: add -e → lerne.',
    },
    {
      id: 'conj-11',
      question: 'er ___ (sehen)',
      options: ['seht', 'sieht', 'sehst', 'sehe'],
      correct: 'sieht',
      explanation: '"sehen" has e→ie change: er sieht.',
    },
    {
      id: 'conj-12',
      question: 'ihr ___ (haben)',
      options: ['haben', 'habt', 'habst', 'habet'],
      correct: 'habt',
      explanation: 'ihr habt — the verb "haben" uses regular ihr ending.',
    },
    {
      id: 'conj-13',
      question: 'du ___ (dürfen)',
      options: ['darf', 'darfst', 'dürft', 'dürfst'],
      correct: 'darfst',
      explanation: 'Modal dürfen: du darfst.',
    },
    {
      id: 'conj-14',
      question: 'wir ___ (werden)',
      options: ['werdet', 'wird', 'werden', 'werde'],
      correct: 'werden',
      explanation: 'wir werden — regular wir ending.',
    },
    {
      id: 'conj-15',
      question: 'er ___ (möchten)',
      options: ['möchte', 'möchtet', 'möchtest', 'möchten'],
      correct: 'möchte',
      explanation: 'möchten (the polite form of mögen): er/ich möchte — identical forms.',
    },
  ],
}

// =====================================================================
// TOPIC 4: Separable Verbs
// =====================================================================
const separableTopic: GrammarTopic = {
  id: 'separable',
  title: 'Separable Verbs',
  summary: 'Separable verbs split in a main clause: the prefix goes to the END. In infinitive or subordinate clauses, they rejoin.',
  content: [
    {
      type: 'paragraph',
      text: 'Many German verbs have a separable prefix (auf-, an-, ab-, ein-, aus-, mit-, vor-, zurück-…). In a main clause with a conjugated verb, the prefix detaches and goes to the very end of the sentence.',
    },
    {
      type: 'table',
      headers: ['Verb', 'Meaning', 'Conjugated (ich)'],
      rows: [
        ['aufstehen', 'to get up', 'Ich stehe um 7 Uhr auf.'],
        ['anrufen', 'to call (phone)', 'Ich rufe dich an.'],
        ['ausgehen', 'to go out', 'Wir gehen heute aus.'],
        ['einkaufen', 'to go shopping', 'Sie kauft Lebensmittel ein.'],
        ['mitnehmen', 'to take along', 'Er nimmt das Buch mit.'],
        ['zurückgeben', 'to give back', 'Ich gebe das Geld zurück.'],
      ],
    },
    {
      type: 'paragraph',
      text: 'In an infinitive construction (with modal or "zu"): the verb stays together.\n• Ich muss früh aufstehen. (I have to get up early.)\n• Es ist schwer, früh aufzustehen. (zu goes INSIDE the word)',
    },
    {
      type: 'paragraph',
      text: 'In a subordinate clause (weil, dass, wenn…), the conjugated verb goes to the END but stays together with the prefix:\n• …weil ich früh aufstehe. (…because I get up early.)',
    },
  ],
  commonMistakes: 'Keeping the prefix attached in a main clause (Ich aufstehe ✗ → Ich stehe auf ✓). Forgetting "zu" goes between prefix and verb in infinitive constructions (aufzustehen not zu aufstehen).',
  examples: [
    { german: 'Ich stehe jeden Morgen um 6 Uhr auf.', english: 'I get up every morning at 6 o\'clock.' },
    { german: 'Ich kann nicht früh aufstehen.', english: 'I can\'t get up early. (modal — verb rejoins)' },
    { german: '…weil er mich anruft.', english: '…because he calls me. (sub. clause — verb at end)' },
  ],
  drills: [
    {
      id: 'sep-1',
      question: 'Ich ___ um 7 Uhr ___. (aufstehen, ich)',
      options: ['aufstehe / —', 'stehe / auf', 'stehe / aufstehe', 'steh / oben'],
      correct: 'stehe / auf',
      explanation: 'Main clause: conjugated part first, prefix at end → Ich stehe … auf.',
    },
    {
      id: 'sep-2',
      question: 'Ich muss früh ___. (aufstehen — with modal)',
      options: ['aufstehe', 'stehe auf', 'aufstehen', 'auf stehen'],
      correct: 'aufstehen',
      explanation: 'After a modal verb, the infinitive is used and stays together: aufstehen.',
    },
    {
      id: 'sep-3',
      question: '…weil ich dich ___. (anrufen, ich — sub. clause)',
      options: ['anrufe', 'rufe an', 'anrufst', 'ruf an'],
      correct: 'anrufe',
      explanation: 'In a subordinate clause, the verb goes to the end and re-joins its prefix: anrufe.',
    },
    {
      id: 'sep-4',
      question: 'Es ist schön, spazieren ___. (spazierengehen, "zu" construction)',
      options: ['zu gehen', 'zugehen', 'spazierenzugehen', 'spazieren zu gehen'],
      correct: 'spazieren zu gehen',
      explanation: '"spazierengehen" is a special case — "zu" goes between: spazieren zu gehen.',
    },
    {
      id: 'sep-5',
      question: 'Sie ___ das Licht ___. (ausschalten, sie 3rd sing.)',
      options: ['ausschaltet / —', 'schaltet / aus', 'schaltet aus / —', 'aus / schaltet'],
      correct: 'schaltet / aus',
      explanation: 'Main clause: sie schaltet … aus.',
    },
  ],
}

// =====================================================================
// TOPIC 5: Word Order
// =====================================================================
const wordOrderTopic: GrammarTopic = {
  id: 'wordorder',
  title: 'Word Order',
  summary: 'The finite verb is ALWAYS second in a main clause. In questions and subordinate clauses, different rules apply.',
  content: [
    {
      type: 'heading',
      text: 'Main clauses — verb in position 2 (V2)',
    },
    {
      type: 'paragraph',
      text: 'In a German statement, the finite verb must occupy the second POSITION (not word). The subject can be before or after the verb:\n• Ich lerne Deutsch. (Subject-V-Object)\n• Heute lerne ich Deutsch. (Adverb-V-Subject-Object)',
    },
    {
      type: 'heading',
      text: 'Time — Manner — Place (TMP)',
    },
    {
      type: 'paragraph',
      text: 'Adverbs and phrases stack in the order: Time → Manner → Place.\n• Ich fahre morgen (time) mit dem Zug (manner) nach Berlin (place).',
    },
    {
      type: 'heading',
      text: 'Yes/No questions — verb first',
    },
    {
      type: 'paragraph',
      text: 'Invert subject and verb:\n• Lernst du Deutsch? (Are you learning German?)',
    },
    {
      type: 'heading',
      text: 'W-questions',
    },
    {
      type: 'paragraph',
      text: 'Question word → verb → subject → …\n• Wann fährt der Zug? (When does the train leave?)',
    },
    {
      type: 'heading',
      text: 'Subordinate clauses (weil, dass, wenn, obwohl…)',
    },
    {
      type: 'paragraph',
      text: 'The finite verb moves to the VERY END of the clause:\n• Ich weiß, dass er Deutsch lernt.\n• Ich bin müde, weil ich früh aufgestanden bin. (Perfekt — both parts at end)',
    },
  ],
  commonMistakes: 'Putting verb in position 1 when starting with an adverb (Heute ich lerne ✗ → Heute lerne ich ✓). Keeping V2 order in a subordinate clause (…weil er lernt Deutsch ✗ → …weil er Deutsch lernt ✓).',
  examples: [
    { german: 'Heute lerne ich Deutsch.', english: 'Today I am learning German. (Adverb triggers inversion)' },
    { german: 'Ich weiß, dass du müde bist.', english: 'I know that you are tired. (sub. clause: verb at end)' },
    { german: 'Wann kommt er?', english: 'When is he coming? (W-question)' },
  ],
  drills: [
    {
      id: 'wo-1',
      question: 'Heute ___ ich Deutsch. (lerne)',
      options: ['ich lerne', 'lerne ich', 'lernen ich', 'ich lern'],
      correct: 'lerne ich',
      explanation: 'Starting with "heute" (adverb), the verb must come second → lerne ich.',
    },
    {
      id: 'wo-2',
      question: 'Ich weiß, dass er Deutsch ___.',
      options: ['lernt', 'lerne', 'lernen', 'lernst'],
      correct: 'lernt',
      explanation: 'Subordinate clause with "dass": verb goes to the end → …Deutsch lernt.',
    },
    {
      id: 'wo-3',
      question: '___ du Deutsch? (Lernst / Do you learn)',
      options: ['Lernst', 'Lerne', 'Lernst du', 'Du lernst'],
      correct: 'Lernst',
      explanation: 'Yes/No question: verb first → Lernst du Deutsch?',
    },
    {
      id: 'wo-4',
      question: 'Ich bin müde, weil ich früh ___ ___. (aufstehen, Perfekt — 2 verbs at end)',
      options: ['bin aufgestanden', 'aufgestanden bin', 'habe aufgestanden', 'aufgestanden habe'],
      correct: 'aufgestanden bin',
      explanation: 'In a subordinate clause, Perfekt order: Partizip then auxiliary at the very end: …früh aufgestanden bin.',
    },
    {
      id: 'wo-5',
      question: 'Choose the correct word order:\nIch fahre ___ ___ ___.',
      options: [
        'mit dem Zug morgen nach Berlin',
        'morgen mit dem Zug nach Berlin',
        'nach Berlin morgen mit dem Zug',
        'morgen nach Berlin mit dem Zug',
      ],
      correct: 'morgen mit dem Zug nach Berlin',
      explanation: 'Time (morgen) → Manner (mit dem Zug) → Place (nach Berlin).',
    },
  ],
}

// =====================================================================
// TOPIC 6: Negation
// =====================================================================
const negationTopic: GrammarTopic = {
  id: 'negation',
  title: 'Negation: nicht vs. kein',
  summary: '"kein" negates nouns (replaces ein/no article). "nicht" negates everything else.',
  content: [
    {
      type: 'heading',
      text: 'kein — negates nouns',
    },
    {
      type: 'paragraph',
      text: '"kein" negates nouns that have an indefinite article (ein/eine) or no article at all. It declines exactly like "ein":\n• Ich habe ein Auto. → Ich habe kein Auto.\n• Ich trinke Wasser. → Ich trinke kein Wasser.\n• Er ist ein Lehrer. → Er ist kein Lehrer.',
    },
    {
      type: 'heading',
      text: 'nicht — negates everything else',
    },
    {
      type: 'paragraph',
      text: '"nicht" negates verbs, adjectives, adverbs, or nouns with a definite article:\n• Ich lerne nicht. (verb)\n• Das Auto ist nicht rot. (adjective)\n• Ich sehe den Mann nicht. (definite-article noun — nicht comes AFTER the object)\n• Das ist nicht mein Auto. (possessive)',
    },
    {
      type: 'paragraph',
      text: '"nicht" position: usually at the end, before adjectives/adverbs, and after the direct object.',
    },
  ],
  commonMistakes: 'Using "nicht" to negate an indefinite noun (Ich habe nicht ein Auto ✗ → Ich habe kein Auto ✓). Placing "nicht" before the object instead of after it.',
  examples: [
    { german: 'Ich habe keine Zeit.', english: 'I have no time. (kein + feminin noun)' },
    { german: 'Ich verstehe das nicht.', english: 'I don\'t understand that. (nicht at end)' },
    { german: 'Er ist kein Arzt.', english: 'He is not a doctor. (kein replaces ein)' },
  ],
  drills: [
    {
      id: 'neg-1',
      question: 'Ich habe ___ Hund. (I have no dog.)',
      options: ['nicht ein', 'keinen', 'keine', 'kein'],
      correct: 'keinen',
      explanation: '"Hund" is masculine. kein + Akkusativ maskulin → keinen.',
    },
    {
      id: 'neg-2',
      question: 'Das Auto ist ___ rot. (The car is not red.)',
      options: ['kein', 'keine', 'nicht', 'keinen'],
      correct: 'nicht',
      explanation: 'Negating an adjective: use "nicht" before the adjective.',
    },
    {
      id: 'neg-3',
      question: 'Ich trinke ___ Kaffee. (I drink no coffee.)',
      options: ['nicht', 'kein', 'keine', 'keinen'],
      correct: 'keinen',
      explanation: '"Kaffee" is masculine, Akkusativ → keinen.',
    },
    {
      id: 'neg-4',
      question: 'Ich sehe den Mann ___. (I don\'t see the man.)',
      options: ['kein', 'nicht', 'keine', 'keinen'],
      correct: 'nicht',
      explanation: '"den Mann" has a definite article → negate with "nicht", placed after the object.',
    },
    {
      id: 'neg-5',
      question: 'Er kommt ___. (He is not coming.)',
      options: ['kein', 'keine', 'nicht', 'keinen'],
      correct: 'nicht',
      explanation: 'Negating a verb → "nicht", usually at the end.',
    },
  ],
}

// =====================================================================
// TOPIC 7: Perfekt (Past Tense)
// =====================================================================
const perfektTopic: GrammarTopic = {
  id: 'perfekt',
  title: 'Perfekt (Past Tense)',
  summary: 'Most spoken German uses Perfekt for the past: haben/sein (conjugated) + Partizip II (at the end). Motion/state-change verbs use sein.',
  content: [
    {
      type: 'paragraph',
      text: 'Perfekt = auxiliary (haben or sein) + Partizip II at the end of the clause.\n• haben: for most action verbs: Ich habe Deutsch gelernt.\n• sein: for motion/change-of-state verbs and sein itself: Ich bin nach Berlin gefahren.',
    },
    {
      type: 'heading',
      text: 'Partizip II formation',
    },
    {
      type: 'table',
      headers: ['Type', 'Formula', 'Example'],
      rows: [
        ['Regular', 'ge- + stem + -t', 'lernen → gelernt'],
        ['Regular (insep. prefix)', 'stem + -t (no ge-)', 'bestellen → bestellt'],
        ['Regular (separable)', 'prefix + ge- + stem + -t', 'einkaufen → eingekauft'],
        ['Irregular', 'ge- + changed stem + -en', 'fahren → gefahren'],
        ['Irregular (insep.)', 'changed stem + -en (no ge-)', 'bekommen → bekommen'],
      ],
    },
    {
      type: 'heading',
      text: 'Common irregular Partizip II forms',
    },
    {
      type: 'table',
      headers: ['Infinitive', 'Partizip II', 'Auxiliary'],
      rows: [
        ['sein', 'gewesen', 'sein'],
        ['haben', 'gehabt', 'haben'],
        ['werden', 'geworden', 'sein'],
        ['gehen', 'gegangen', 'sein'],
        ['kommen', 'gekommen', 'sein'],
        ['fahren', 'gefahren', 'sein'],
        ['laufen', 'gelaufen', 'sein'],
        ['fliegen', 'geflogen', 'sein'],
        ['essen', 'gegessen', 'haben'],
        ['trinken', 'getrunken', 'haben'],
        ['schreiben', 'geschrieben', 'haben'],
        ['lesen', 'gelesen', 'haben'],
        ['sprechen', 'gesprochen', 'haben'],
        ['sehen', 'gesehen', 'haben'],
        ['nehmen', 'genommen', 'haben'],
        ['geben', 'gegeben', 'haben'],
        ['finden', 'gefunden', 'haben'],
        ['schlafen', 'geschlafen', 'haben'],
        ['wissen', 'gewusst', 'haben'],
        ['denken', 'gedacht', 'haben'],
      ],
    },
  ],
  commonMistakes: 'Using "haben" with motion verbs (Ich habe gegangen ✗ → Ich bin gegangen ✓). Forgetting that the Partizip II goes to the END in a main clause.',
  examples: [
    { german: 'Ich habe gestern Deutsch gelernt.', english: 'I learnt German yesterday.' },
    { german: 'Wir sind nach Hamburg gefahren.', english: 'We went (drove) to Hamburg.' },
    { german: 'Er hat das Buch gelesen.', english: 'He read the book.' },
  ],
  drills: [
    {
      id: 'perf-1',
      question: 'Ich ___ nach Berlin ___. (fahren, Perfekt)',
      options: ['habe / gefahren', 'bin / gefahren', 'bin / gefahrt', 'habe / gefahrt'],
      correct: 'bin / gefahren',
      explanation: '"fahren" is a motion verb → sein. Partizip II: gefahren.',
    },
    {
      id: 'perf-2',
      question: 'Er ___ das Buch ___. (lesen, Perfekt)',
      options: ['ist / gelesen', 'hat / gelesen', 'ist / gelesst', 'hat / gelesst'],
      correct: 'hat / gelesen',
      explanation: '"lesen" is an action verb → haben. Partizip II irregular: gelesen.',
    },
    {
      id: 'perf-3',
      question: 'Wir ___ viel ___. (essen, Perfekt)',
      options: ['sind / gegessen', 'haben / gegessen', 'haben / geessen', 'sind / geessen'],
      correct: 'haben / gegessen',
      explanation: '"essen" → haben. Partizip II: gegessen.',
    },
    {
      id: 'perf-4',
      question: 'Sie ___ nach Hause ___. (gehen, Perfekt)',
      options: ['hat / gegangen', 'ist / gegangen', 'ist / gegeht', 'hat / gegeht'],
      correct: 'ist / gegangen',
      explanation: '"gehen" is motion → sein. Partizip II: gegangen.',
    },
    {
      id: 'perf-5',
      question: 'Ich ___ das schon ___. (wissen, Perfekt)',
      options: ['bin / gewusst', 'habe / gewusst', 'habe / gewissen', 'bin / gewissen'],
      correct: 'habe / gewusst',
      explanation: '"wissen" → haben. Partizip II: gewusst (irregular).',
    },
  ],
}

// =====================================================================
// TOPIC 8: Prepositions
// =====================================================================
const prepositionsTopic: GrammarTopic = {
  id: 'prepositions',
  title: 'Prepositions',
  summary: 'Each preposition governs a specific case. Wechselpräpositionen take Akkusativ for movement, Dativ for location.',
  content: [
    {
      type: 'heading',
      text: 'Always Akkusativ',
    },
    {
      type: 'table',
      headers: ['Preposition', 'Meaning', 'Example'],
      rows: [
        ['durch', 'through', 'durch den Park'],
        ['für', 'for', 'für einen Freund'],
        ['gegen', 'against', 'gegen die Wand'],
        ['ohne', 'without', 'ohne ein Wort'],
        ['um', 'around, at (time)', 'um den See / um 8 Uhr'],
        ['bis', 'until, by', 'bis nächste Woche'],
      ],
    },
    {
      type: 'heading',
      text: 'Always Dativ',
    },
    {
      type: 'table',
      headers: ['Preposition', 'Meaning', 'Example'],
      rows: [
        ['aus', 'from, out of', 'aus der Stadt'],
        ['bei', 'at, near, by', 'bei meiner Mutter'],
        ['mit', 'with', 'mit dem Zug'],
        ['nach', 'after, to (places)', 'nach Berlin, nach dem Essen'],
        ['seit', 'since, for', 'seit einem Jahr'],
        ['von', 'from, by, of', 'von meinem Freund'],
        ['zu', 'to, at', 'zum Bahnhof'],
        ['gegenüber', 'opposite', 'dem Bahnhof gegenüber'],
      ],
    },
    {
      type: 'heading',
      text: 'Wechselpräpositionen (two-way)',
    },
    {
      type: 'paragraph',
      text: 'These 9 prepositions take AKKUSATIV for movement (Wohin? Where to?) and DATIV for location (Wo? Where at?): an, auf, hinter, in, neben, über, unter, vor, zwischen.\n\n• Ich gehe in den Supermarkt. (Akk — movement)\n• Ich bin im Supermarkt. (Dat — location)\n• Das Buch liegt auf dem Tisch. (Dat — location)\n• Ich lege das Buch auf den Tisch. (Akk — movement)',
    },
  ],
  commonMistakes: 'Using Akkusativ for location with Wechselpräpositionen. Forgetting that "mit" always takes Dativ. Common contractions: zu dem → zum, zu der → zur, in dem → im, in das → ins, an dem → am, an das → ans.',
  examples: [
    { german: 'Ich fahre mit dem Bus.', english: 'I travel by bus. (mit = Dativ)' },
    { german: 'Das Buch liegt auf dem Tisch.', english: 'The book is on the table. (location = Dativ)' },
    { german: 'Ich stelle das Buch auf den Tisch.', english: 'I put the book on the table. (movement = Akkusativ)' },
  ],
  drills: [
    {
      id: 'prep-1',
      question: 'Das Buch liegt auf ___ Tisch. (der Tisch — location)',
      options: ['den', 'dem', 'der', 'die'],
      correct: 'dem',
      explanation: '"auf" with location (Wo?) → Dativ. Maskulin Dativ → dem.',
    },
    {
      id: 'prep-2',
      question: 'Ich lege das Buch auf ___ Tisch. (der Tisch — movement)',
      options: ['dem', 'der', 'den', 'die'],
      correct: 'den',
      explanation: '"auf" with movement (Wohin?) → Akkusativ. Maskulin Akkusativ → den.',
    },
    {
      id: 'prep-3',
      question: 'Ich fahre mit ___ Zug. (der Zug)',
      options: ['den', 'der', 'dem', 'die'],
      correct: 'dem',
      explanation: '"mit" always takes Dativ. Maskulin Dativ → dem.',
    },
    {
      id: 'prep-4',
      question: 'Das ist für ___ Mutter. (die Mutter)',
      options: ['die', 'der', 'dem', 'den'],
      correct: 'die',
      explanation: '"für" always takes Akkusativ. Feminin Akkusativ → die.',
    },
    {
      id: 'prep-5',
      question: 'Er kommt aus ___ Stadt. (die Stadt)',
      options: ['die', 'der', 'dem', 'den'],
      correct: 'der',
      explanation: '"aus" always takes Dativ. Feminin Dativ → der.',
    },
  ],
}

// =====================================================================
// IRREGULAR VERB LOOKUP for conjugation tool
// =====================================================================
export interface IrregularVerb {
  infinitive: string
  ich: string
  du: string
  erSieEs: string
  wir: string
  ihr: string
  sieSie: string
}

export const IRREGULAR_VERBS: IrregularVerb[] = [
  { infinitive: 'sein', ich: 'bin', du: 'bist', erSieEs: 'ist', wir: 'sind', ihr: 'seid', sieSie: 'sind' },
  { infinitive: 'haben', ich: 'habe', du: 'hast', erSieEs: 'hat', wir: 'haben', ihr: 'habt', sieSie: 'haben' },
  { infinitive: 'werden', ich: 'werde', du: 'wirst', erSieEs: 'wird', wir: 'werden', ihr: 'werdet', sieSie: 'werden' },
  { infinitive: 'wissen', ich: 'weiß', du: 'weißt', erSieEs: 'weiß', wir: 'wissen', ihr: 'wisst', sieSie: 'wissen' },
  { infinitive: 'fahren', ich: 'fahre', du: 'fährst', erSieEs: 'fährt', wir: 'fahren', ihr: 'fahrt', sieSie: 'fahren' },
  { infinitive: 'schlafen', ich: 'schlafe', du: 'schläfst', erSieEs: 'schläft', wir: 'schlafen', ihr: 'schlaft', sieSie: 'schlafen' },
  { infinitive: 'tragen', ich: 'trage', du: 'trägst', erSieEs: 'trägt', wir: 'tragen', ihr: 'tragt', sieSie: 'tragen' },
  { infinitive: 'waschen', ich: 'wasche', du: 'wäschst', erSieEs: 'wäscht', wir: 'waschen', ihr: 'wascht', sieSie: 'waschen' },
  { infinitive: 'sprechen', ich: 'spreche', du: 'sprichst', erSieEs: 'spricht', wir: 'sprechen', ihr: 'sprecht', sieSie: 'sprechen' },
  { infinitive: 'treffen', ich: 'treffe', du: 'triffst', erSieEs: 'trifft', wir: 'treffen', ihr: 'trefft', sieSie: 'treffen' },
  { infinitive: 'helfen', ich: 'helfe', du: 'hilfst', erSieEs: 'hilft', wir: 'helfen', ihr: 'helft', sieSie: 'helfen' },
  { infinitive: 'werfen', ich: 'werfe', du: 'wirfst', erSieEs: 'wirft', wir: 'werfen', ihr: 'werft', sieSie: 'werfen' },
  { infinitive: 'brechen', ich: 'breche', du: 'brichst', erSieEs: 'bricht', wir: 'brechen', ihr: 'brecht', sieSie: 'brechen' },
  { infinitive: 'essen', ich: 'esse', du: 'isst', erSieEs: 'isst', wir: 'essen', ihr: 'esst', sieSie: 'essen' },
  { infinitive: 'geben', ich: 'gebe', du: 'gibst', erSieEs: 'gibt', wir: 'geben', ihr: 'gebt', sieSie: 'geben' },
  { infinitive: 'lesen', ich: 'lese', du: 'liest', erSieEs: 'liest', wir: 'lesen', ihr: 'lest', sieSie: 'lesen' },
  { infinitive: 'sehen', ich: 'sehe', du: 'siehst', erSieEs: 'sieht', wir: 'sehen', ihr: 'seht', sieSie: 'sehen' },
  { infinitive: 'stehlen', ich: 'stehle', du: 'stiehlst', erSieEs: 'stiehlt', wir: 'stehlen', ihr: 'stehlt', sieSie: 'stehlen' },
  { infinitive: 'empfehlen', ich: 'empfehle', du: 'empfiehlst', erSieEs: 'empfiehlt', wir: 'empfehlen', ihr: 'empfehlt', sieSie: 'empfehlen' },
  { infinitive: 'nehmen', ich: 'nehme', du: 'nimmst', erSieEs: 'nimmt', wir: 'nehmen', ihr: 'nehmt', sieSie: 'nehmen' },
  { infinitive: 'kommen', ich: 'komme', du: 'kommst', erSieEs: 'kommt', wir: 'kommen', ihr: 'kommt', sieSie: 'kommen' },
  { infinitive: 'gehen', ich: 'gehe', du: 'gehst', erSieEs: 'geht', wir: 'gehen', ihr: 'geht', sieSie: 'gehen' },
  { infinitive: 'stehen', ich: 'stehe', du: 'stehst', erSieEs: 'steht', wir: 'stehen', ihr: 'steht', sieSie: 'stehen' },
  { infinitive: 'laufen', ich: 'laufe', du: 'läufst', erSieEs: 'läuft', wir: 'laufen', ihr: 'lauft', sieSie: 'laufen' },
  { infinitive: 'fallen', ich: 'falle', du: 'fällst', erSieEs: 'fällt', wir: 'fallen', ihr: 'fallt', sieSie: 'fallen' },
  { infinitive: 'halten', ich: 'halte', du: 'hältst', erSieEs: 'hält', wir: 'halten', ihr: 'haltet', sieSie: 'halten' },
  { infinitive: 'rufen', ich: 'rufe', du: 'rufst', erSieEs: 'ruft', wir: 'rufen', ihr: 'ruft', sieSie: 'rufen' },
  { infinitive: 'schreiben', ich: 'schreibe', du: 'schreibst', erSieEs: 'schreibt', wir: 'schreiben', ihr: 'schreibt', sieSie: 'schreiben' },
  { infinitive: 'bleiben', ich: 'bleibe', du: 'bleibst', erSieEs: 'bleibt', wir: 'bleiben', ihr: 'bleibt', sieSie: 'bleiben' },
  { infinitive: 'treiben', ich: 'treibe', du: 'treibst', erSieEs: 'treibt', wir: 'treiben', ihr: 'treibt', sieSie: 'treiben' },
  { infinitive: 'wissen', ich: 'weiß', du: 'weißt', erSieEs: 'weiß', wir: 'wissen', ihr: 'wisst', sieSie: 'wissen' },
  // Modals
  { infinitive: 'können', ich: 'kann', du: 'kannst', erSieEs: 'kann', wir: 'können', ihr: 'könnt', sieSie: 'können' },
  { infinitive: 'müssen', ich: 'muss', du: 'musst', erSieEs: 'muss', wir: 'müssen', ihr: 'müsst', sieSie: 'müssen' },
  { infinitive: 'wollen', ich: 'will', du: 'willst', erSieEs: 'will', wir: 'wollen', ihr: 'wollt', sieSie: 'wollen' },
  { infinitive: 'sollen', ich: 'soll', du: 'sollst', erSieEs: 'soll', wir: 'sollen', ihr: 'sollt', sieSie: 'sollen' },
  { infinitive: 'dürfen', ich: 'darf', du: 'darfst', erSieEs: 'darf', wir: 'dürfen', ihr: 'dürft', sieSie: 'dürfen' },
  { infinitive: 'mögen', ich: 'mag', du: 'magst', erSieEs: 'mag', wir: 'mögen', ihr: 'mögt', sieSie: 'mögen' },
  { infinitive: 'möchten', ich: 'möchte', du: 'möchtest', erSieEs: 'möchte', wir: 'möchten', ihr: 'möchtet', sieSie: 'möchten' },
  // Other common irregular
  { infinitive: 'bringen', ich: 'bringe', du: 'bringst', erSieEs: 'bringt', wir: 'bringen', ihr: 'bringt', sieSie: 'bringen' },
  { infinitive: 'denken', ich: 'denke', du: 'denkst', erSieEs: 'denkt', wir: 'denken', ihr: 'denkt', sieSie: 'denken' },
  { infinitive: 'kennen', ich: 'kenne', du: 'kennst', erSieEs: 'kennt', wir: 'kennen', ihr: 'kennt', sieSie: 'kennen' },
  { infinitive: 'nennen', ich: 'nenne', du: 'nennst', erSieEs: 'nennt', wir: 'nennen', ihr: 'nennt', sieSie: 'nennen' },
  { infinitive: 'rennen', ich: 'renne', du: 'rennst', erSieEs: 'rennt', wir: 'rennen', ihr: 'rennt', sieSie: 'rennen' },
  { infinitive: 'finden', ich: 'finde', du: 'findest', erSieEs: 'findet', wir: 'finden', ihr: 'findet', sieSie: 'finden' },
  { infinitive: 'sitzen', ich: 'sitze', du: 'sitzt', erSieEs: 'sitzt', wir: 'sitzen', ihr: 'sitzt', sieSie: 'sitzen' },
  { infinitive: 'liegen', ich: 'liege', du: 'liegst', erSieEs: 'liegt', wir: 'liegen', ihr: 'liegt', sieSie: 'liegen' },
  { infinitive: 'stellen', ich: 'stelle', du: 'stellst', erSieEs: 'stellt', wir: 'stellen', ihr: 'stellt', sieSie: 'stellen' },
  { infinitive: 'fragen', ich: 'frage', du: 'fragst', erSieEs: 'fragt', wir: 'fragen', ihr: 'fragt', sieSie: 'fragen' },
  { infinitive: 'kaufen', ich: 'kaufe', du: 'kaufst', erSieEs: 'kauft', wir: 'kaufen', ihr: 'kauft', sieSie: 'kaufen' },
  { infinitive: 'spielen', ich: 'spiele', du: 'spielst', erSieEs: 'spielt', wir: 'spielen', ihr: 'spielt', sieSie: 'spielen' },
  { infinitive: 'arbeiten', ich: 'arbeite', du: 'arbeitest', erSieEs: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', sieSie: 'arbeiten' },
]

/** Conjugate a regular verb from its infinitive */
export function conjugateRegular(infinitive: string): IrregularVerb {
  const stem = infinitive.endsWith('en')
    ? infinitive.slice(0, -2)
    : infinitive.endsWith('n')
    ? infinitive.slice(0, -1)
    : infinitive

  // Handle stems ending in -t, -d, -fn, -gn → insert -e- before endings
  const needsE = /[td]$/.test(stem) || /[^aeiou][mn]$/.test(stem)
  const e = needsE ? 'e' : ''

  return {
    infinitive,
    ich: `${stem}e`,
    du: `${stem}${e}st`,
    erSieEs: `${stem}${e}t`,
    wir: `${stem}en`,
    ihr: `${stem}${e}t`,
    sieSie: `${stem}en`,
  }
}

/** Look up a verb — irregular first, then fall back to regular */
export function lookupVerb(infinitive: string): { verb: IrregularVerb; isIrregular: boolean } | null {
  const lower = infinitive.toLowerCase().trim()
  const found = IRREGULAR_VERBS.find(v => v.infinitive === lower)
  if (found) return { verb: found, isIrregular: true }
  if (lower.endsWith('en') || lower.endsWith('n')) {
    return { verb: conjugateRegular(lower), isIrregular: false }
  }
  return null
}

// =====================================================================
// POSSESSIVE SELECTOR helper
// =====================================================================
type Gender = 'maskulin' | 'feminin' | 'neutrum' | 'plural'
type Case = 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv'

const POSSESSIVE_ENDINGS: Record<Case, Record<Gender, string>> = {
  Nominativ: { maskulin: '', feminin: 'e', neutrum: '', plural: 'e' },
  Akkusativ: { maskulin: 'en', feminin: 'e', neutrum: '', plural: 'e' },
  Dativ: { maskulin: 'em', feminin: 'er', neutrum: 'em', plural: 'en' },
  Genitiv: { maskulin: 'es', feminin: 'er', neutrum: 'es', plural: 'er' },
}

export function getPossessiveForm(stem: string, grammaticalGender: Gender, grammaticalCase: Case): string {
  const ending = POSSESSIVE_ENDINGS[grammaticalCase][grammaticalGender]
  // "euer" contracts: euer + e = eure (drop the inner -e-)
  if (stem === 'euer') {
    return ending ? `eur${ending}` : 'euer'
  }
  return stem + ending
}

export const POSSESSIVE_STEMS: { label: string; stem: string }[] = [
  { label: 'mein (my)', stem: 'mein' },
  { label: 'dein (your, informal)', stem: 'dein' },
  { label: 'sein (his/its)', stem: 'sein' },
  { label: 'ihr (her/their)', stem: 'ihr' },
  { label: 'unser (our)', stem: 'unser' },
  { label: 'euer (your, plural)', stem: 'euer' },
  { label: 'Ihr (formal your)', stem: 'Ihr' },
]

// =====================================================================
// EXPORT ALL TOPICS
// =====================================================================
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  genderTopic,
  possessivesTopic,
  conjugationTopic,
  separableTopic,
  wordOrderTopic,
  negationTopic,
  perfektTopic,
  prepositionsTopic,
]

