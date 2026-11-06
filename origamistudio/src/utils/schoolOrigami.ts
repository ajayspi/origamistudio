// Metaphorical Audio & Multilingual Guidance Engine
// Universal hands-free voice guidance across 5 languages

export type LanguageCode = 'en' | 'es' | 'ja' | 'fr' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export interface SchoolStepProfile {
  juniorTitle: string;
  juniorMetaphor: string;
  juniorInstruction: string;
  juniorCheer: string;
  explorerInstruction: string;
  stemConcept: string;
  stemTheorem: string;
  checkQuestions: [string, string, string];
}

export interface LocalizedStepText {
  title: string;
  metaphor: string;
  instruction: string;
  cheer: string;
}

export const LOCALIZED_METAPHORS: Record<LanguageCode, Record<number, LocalizedStepText>> = {
  en: {
    0: {
      title: '🌮 The Taco Fold (Diagonal Triangle)',
      metaphor: 'Fold corner to corner to make a giant crispy taco!',
      instruction: 'Pick up corner ❶ with your fingers. Fly it across to meet corner ❷. Press the bottom flat like a pancake!',
      cheer: 'Awesome start! You made a perfect triangle taco! 🌮'
    },
    1: {
      title: '🍦 The Ice Cream Cone (Kite Fold)',
      metaphor: 'Fold the sides inward like an ice cream cone!',
      instruction: 'Take the left flap and fold it into the center line. It should look like a delicious cone!',
      cheer: 'Yum! Look at that crispy ice cream cone shape! 🍦'
    },
    2: {
      title: '⛺ The Pup Tent (Mountain Peak Fold)',
      metaphor: 'Fold it backward to create a little tent roof!',
      instruction: 'Flip your paper over like a pancake. Fold the top down to make a cozy tent roof!',
      cheer: 'Super job! Ready for camping under the stars! ⛺'
    },
    3: {
      title: '💌 The Secret Pocket (Squash Fold)',
      metaphor: 'Open the little flap and squash it flat like a postage stamp!',
      instruction: 'Open the paper pocket with your finger, then gently squash it flat down the middle!',
      cheer: 'Magic! You squashed it into a secret diamond pocket! 💌'
    },
    4: {
      title: '🦊 The Fox Ears (Petal Fold)',
      metaphor: 'Lift the wings up high like curious fox ears!',
      instruction: 'Lift both side points up into the air so they stand tall like little animal ears!',
      cheer: 'Look at those cute ears standing tall! 🦊'
    },
    5: {
      title: '🌸 The Blossom Crown (Final Shaping)',
      metaphor: 'Curl the edges gently to bring your sculpture alive!',
      instruction: 'Gently curve the tip forward with your thumb to make the head or petals. Hold it up and celebrate!',
      cheer: 'Hooray! You completed your masterwork! You are an Origami Artist! 🏆🎉'
    }
  },
  es: {
    0: {
      title: '🌮 El Pliegue de Taco (Triángulo Diagonal)',
      metaphor: '¡Dobla esquina con esquina para hacer un gran taco crujiente!',
      instruction: 'Toma la esquina ❶ con tus dedos. Llévala volando hasta la esquina ❷ y presiona la base bien plana.',
      cheer: '¡Excelente comienzo! ¡Hiciste un taco triangular perfecto! 🌮'
    },
    1: {
      title: '🍦 El Cucurucho de Helado (Pliegue de Cometa)',
      metaphor: '¡Dobla los lados hacia adentro como un cono de helado!',
      instruction: 'Lleva la solapa izquierda hacia la línea central. ¡Debe parecer un rico helado!',
      cheer: '¡Qué rico! ¡Mira esa forma de cono de helado! 🍦'
    },
    2: {
      title: '⛺ La Carpa de Campamento (Pliegue en Montaña)',
      metaphor: '¡Dóblalo hacia atrás para hacer el techo de la carpa!',
      instruction: 'Dale la vuelta a tu papel como un panqueque y pliega la punta superior hacia abajo.',
      cheer: '¡Genial! ¡Listos para acampar bajo las estrellas! ⛺'
    },
    3: {
      title: '💌 El Bolsillo Secreto (Pliegue Aplastado)',
      metaphor: '¡Abre la solapita y aplástala suavemente!',
      instruction: 'Abre el bolsillo de papel con tu dedo y presiónalo suavemente por el centro.',
      cheer: '¡Magia pura! ¡Creaste un bolsillo secreto de diamante! 💌'
    },
    4: {
      title: '🦊 Las Orejas de Zorro (Pliegue de Pétalo)',
      metaphor: '¡Levanta las puntas bien alto como orejitas de zorro!',
      instruction: 'Eleva ambas puntas laterales hacia arriba para que queden erguidas y firmes.',
      cheer: '¡Mira esas orejitas tan simpáticas! 🦊'
    },
    5: {
      title: '🌸 Corona en Flor (Escultura Final)',
      metaphor: '¡Modela los bordes suavemente para darle vida a tu figura!',
      instruction: 'Curva la punta con cuidado hacia adelante para formar la cabeza y las alas. ¡A celebrar!',
      cheer: '¡Hurra! ¡Completaste tu obra maestra! ¡Eres un verdadero artista del origami! 🏆🎉'
    }
  },
  ja: {
    0: {
      title: '🌮 タコ折り (対角線の三角折り)',
      metaphor: '角と角を合わせて、大きなタコスの形に折ろう！',
      instruction: '角❶を持って、角❷に合わせて重ねます。下の折り目を平らにしっかりアイロンしよう！',
      cheer: '素晴らしいスタート！きれいな三角形ができたね！🌮'
    },
    1: {
      title: '🍦 アイスクリーム折り (凧形折り)',
      metaphor: '両端を内側に折ってアイスクリームのコーンを作ろう！',
      instruction: '端のフチを真ん中の線に合わせて折ります。おいしそうなアイスクリームになったかな？',
      cheer: 'おいしそう！きれいなアイスクリームコーンの完成！🍦'
    },
    2: {
      title: '⛺ 三角テント (山折り)',
      metaphor: '裏返して折ると、かわいいテントの屋根ができるよ！',
      instruction: 'ホットケーキみたいに紙をひっくり返して、てっぺんを下へ折り下げます。',
      cheer: 'ばっちり！星空キャンプのテントが立ちました！⛺'
    },
    3: {
      title: '💌 ひみつのポケット (ふくろつぶし折り)',
      metaphor: 'フリップを指で開いて、ペタッとつぶそう！',
      instruction: '指をすき間に入れて袋を開き、中心に合わせて平らにつぶします。',
      cheer: 'まるで手品！ひみつのダイヤ型ポケットができたよ！💌'
    },
    4: {
      title: '🦊 こぎつねの耳 (花弁折り)',
      metaphor: '両側の角をピンと立てて、キツネの耳にしよう！',
      instruction: '両方の角を空に向かって持ち上げ、ピンと立たせます。',
      cheer: 'かわいい耳がピーンと立ったね！🦊'
    },
    5: {
      title: '🌸 いのちの仕上げ (フィニッシュ)',
      metaphor: '翼や頭をやさしく整えて、いのちを吹き込もう！',
      instruction: '頭やくちばしを指先でやさしく曲げて完成です。お友達や先生に見せてみよう！',
      cheer: 'やったー！完成おめでとう！きみは折り紙マスターだ！🏆🎉'
    }
  },
  fr: {
    0: {
      title: '🌮 Le Pliage Taco (Triangle Diagonal)',
      metaphor: 'Plie coin contre coin pour faire un grand taco croustillant !',
      instruction: 'Prends le coin ❶ et fais-le voler jusqu\'au coin ❷. Aplatit bien le pli comme une crêpe !',
      cheer: 'Super début ! Tu as réussi un superbe taco triangulaire ! 🌮'
    },
    1: {
      title: '🍦 Le Cornet de Glace (Pliage Cerf-Volant)',
      metaphor: 'Plie les côtés vers l\'intérieur comme un cornet de glace !',
      instruction: 'Ramène le volet gauche sur la ligne centrale. Ça doit ressembler à un délicieux cornet !',
      cheer: 'Miam ! Regarde cette belle forme de cornet de glace ! 🍦'
    },
    2: {
      title: '⛺ La Tente Canadienne (Pli Montagne)',
      metaphor: 'Plie vers l\'arrière pour créer le toit de la tente !',
      instruction: 'Retourne ta feuille comme une crêpe et plie la pointe du haut vers le bas.',
      cheer: 'Bravo ! Prêt pour le camping sous les étoiles ! ⛺'
    },
    3: {
      title: '💌 La Poche Secrète (Pli Écrasé)',
      metaphor: 'Ouvre le petit volet et écrase-le bien à plat !',
      instruction: 'Glisse ton doigt dans la fente pour ouvrir la poche, puis écrase doucement au centre.',
      cheer: 'Magique ! Tu as créé une poche secrète en losange ! 💌'
    },
    4: {
      title: '🦊 Les Oreilles de Renard (Pli Pétale)',
      metaphor: 'Lève les pointes bien haut comme des oreilles de renard !',
      instruction: 'Soulève les deux pointes latérales vers le ciel pour qu\'elles se dressent fièrement.',
      cheer: 'Regarde ces mignonnes petites oreilles dressées ! 🦊'
    },
    5: {
      title: '🌸 La Touche Finale (Mise en Volume)',
      metaphor: 'Courbe doucement les formes pour donner vie à ta sculpture !',
      instruction: 'Courbe délicatement la tête et les ailes avec tes pouces. Tiens-la fièrement et fête ta réussite !',
      cheer: 'Hourra ! Tu as terminé ton chef-d\'œuvre ! Tu es un véritable artiste de l\'origami ! 🏆🎉'
    }
  },
  hi: {
    0: {
      title: '🌮 टैको मोड़ (त्रिकोण आधार)',
      metaphor: 'कोने से कोने को मिलाकर एक बड़ा और कुरकुरा टैको बनाओ!',
      instruction: 'कोने ❶ को अपनी उंगलियों से उठाएं। इसे कोने ❷ पर ले जाएं और नीचे की रेखा को सपाट दबाएं!',
      cheer: 'शानदार शुरुआत! आपने एक सुंदर त्रिकोणीय टैको बनाया! 🌮'
    },
    1: {
      title: '🍦 आइसक्रीम कोन (पतंग मोड़)',
      metaphor: 'किनारों को अंदर की तरफ मोड़कर आइसक्रीम कोन बनाओ!',
      instruction: 'बाईं ओर के हिस्से को बीच की रेखा तक मोड़ें। यह एक स्वादिष्ट कोन जैसा दिखना चाहिए!',
      cheer: 'वाह! कितना प्यारा आइसक्रीम कोन बन गया! 🍦'
    },
    2: {
      title: '⛺ तंबू की छत (पर्वत मोड़)',
      metaphor: 'इसे पीछे की ओर मोड़ें और एक आरामदायक तंबू बनाएं!',
      instruction: 'कागज को पलटें और ऊपर की नोक को नीचे की तरफ मोड़ें।',
      cheer: 'शाबाश! तारों के नीचे कैंपिंग के लिए तैयार! ⛺'
    },
    3: {
      title: '💌 गुप्त जेब (दबाव मोड़)',
      metaphor: 'छोटी जेब को अपनी उंगली से खोलें और धीरे से दबाएं!',
      instruction: 'उंगली से कागज की जेब खोलें और बीच में से धीरे से सपाट दबाएं।',
      cheer: 'जादू! आपने एक गुप्त हीरे जैसी जेब बना ली! 💌'
    },
    4: {
      title: '🦊 लोमड़ी के कान (पंखुड़ी मोड़)',
      metaphor: 'दोनों सिरों को ऊपर उठाएं जैसे एक चतुर लोमड़ी के कान!',
      instruction: 'दोनों सिरों को हवा में ऊपर उठाएं ताकि वे सीधे खड़े हो सकें।',
      cheer: 'देखो कितने प्यारे कान खड़े हो गए! 🦊'
    },
    5: {
      title: '🌸 अंतिम स्वरूप (कलाकृति जीवंत)',
      metaphor: 'किनारों को धीरे से आकार दें और अपनी ओरिगेमी को जीवित करें!',
      instruction: 'पंखों और सिर को अपनी उंगलियों से धीरे से मोड़ें। अपनी रचना को गर्व से दिखाएं!',
      cheer: 'बधाई हो! आपकी ओरिगेमी कलाकृति तैयार है! आप एक सच्चे ओरिगेमी कलाकार हैं! 🏆🎉'
    }
  }
};

const METAPHOR_BANK: Record<number, Partial<SchoolStepProfile>> = {
  0: {
    juniorTitle: '🌮 The Taco Fold (Diagonal Triangle)',
    juniorMetaphor: 'Fold corner to corner to make a giant crispy taco!',
    juniorInstruction: 'Pick up corner ❶ with your fingers. Fly it across to meet corner ❷. Press the bottom flat like a pancake!',
    juniorCheer: 'Awesome start! You made a perfect triangle taco! 🌮',
    explorerInstruction: 'Valley fold along the diagonal axis. Align corner ❶ squarely onto target ❷. Slide your thumb along the bottom crease.',
    stemConcept: 'Perpendicular Bisector & $45^\circ$ Hypotenuse',
    stemTheorem: 'Divides a square ($a \\times a$) into two congruent isosceles right triangles with area $A = a^2/2$.',
    checkQuestions: ['Do the two sharp corners meet without peeking?', 'Is the bottom edge smooth and pressed flat?', 'Does your paper look like a triangle?']
  },
  1: {
    juniorTitle: '🍦 The Ice Cream Cone (Kite Fold)',
    juniorMetaphor: 'Fold the sides inward like an ice cream cone!',
    juniorInstruction: 'Take the left flap and fold it into the center line. It should look like a delicious cone!',
    juniorCheer: 'Yum! Look at that crispy ice cream cone shape! 🍦',
    explorerInstruction: 'Bisect the diagonal angle. Fold outer edges to meet the center crease line flush without overlapping.',
    stemConcept: 'Angle Bisection & Kite Symmetry ($C_{1v}$)',
    stemTheorem: 'Huzita-Hatori Axiom 3: Folding two given lines onto each other generates an angle bisector axis.',
    checkQuestions: ['Do the edges touch the center line neatly?', 'Did you leave a tiny gap so it does not wrinkle?', 'Are both sides equal like twin wings?']
  },
  2: {
    juniorTitle: '⛺ The Pup Tent (Mountain Peak Fold)',
    juniorMetaphor: 'Fold it backward to create a little tent roof!',
    juniorInstruction: 'Flip your paper over like a pancake. Fold the top down to make a cozy tent roof!',
    juniorCheer: 'Super job! Ready for camping under the stars! ⛺',
    explorerInstruction: 'Mountain fold the upper apex backward. Keep central alignment symmetric along the vertical spine.',
    stemConcept: 'Mountain Crease Inversion & Planar Reflection',
    stemTheorem: 'Maekawa Theorem: The difference between mountain and valley folds at any flat node is always $|M - V| = 2$.',
    checkQuestions: ['Does the tent stand balance on the table?', 'Is the top point nice and pointy?', 'Are your creases sharp?']
  },
  3: {
    juniorTitle: '💌 The Secret Pocket (Squash Fold)',
    juniorMetaphor: 'Open the little flap and squash it flat like a postage stamp!',
    juniorInstruction: 'Open the paper pocket with your finger, then gently squash it flat down the middle!',
    juniorCheer: 'Magic! You squashed it into a secret diamond pocket! 💌',
    explorerInstruction: 'Gently spread open the interior layer, align the center crease with the spine, and squash flat.',
    stemConcept: '3D-to-2D Flat-Foldable Squash Projection',
    stemTheorem: 'Kawasaki-Justin Theorem: Alternating angle sum around the 4-degree vertex equals $180^\\circ$.',
    checkQuestions: ['Did you open the pocket before pressing down?', 'Does the center line match the line beneath?', 'Is the diamond symmetrical?']
  },
  4: {
    juniorTitle: '🦊 The Fox Ears (Petal Fold)',
    juniorMetaphor: 'Lift the wings up high like curious fox ears!',
    juniorInstruction: 'Lift both side points up into the air so they stand tall like little animal ears!',
    juniorCheer: 'Look at those cute ears standing tall! 🦊',
    explorerInstruction: 'Perform reverse fold along internal crease landmarks to elevate the lateral flaps symmetrically.',
    stemConcept: 'Parallel Pleating & Reverse Vertex Inversion',
    stemTheorem: 'Preserves Gaussian curvature $K = 0$ at all interior uncreased developable surfaces.',
    checkQuestions: ['Are both ears the same height?', 'Are the folds tucked tightly inside?', 'Does your paper feel sturdy?']
  },
  5: {
    juniorTitle: '🌸 The Blossom Crown (Final Shaping)',
    juniorMetaphor: 'Curl the edges gently to bring your sculpture alive!',
    juniorInstruction: 'Gently curve the tip forward with your thumb to make the head or petals. Hold it up and celebrate!',
    juniorCheer: 'Hooray! You completed your masterwork! You are an Origami Artist! 🏆🎉',
    explorerInstruction: 'Form the final character reverse fold at the apex. Carefully sculpt and curl the facets for lifelike 3D depth.',
    stemConcept: 'Volumetric Tensioning & Non-Euclidean Curved Folding',
    stemTheorem: 'Equilibrium geometry via elastic sheet deformation and dihedral edge locking.',
    checkQuestions: ['Does your model stand or balance cleanly?', 'Are you proud of how your creases turned out?', 'Ready to write your name on the bottom?']
  }
};

export const getSchoolStepProfile = (
  stepIdx: number,
  stepTitle: string,
  totalSteps: number
): SchoolStepProfile => {
  const moduloIdx = stepIdx % 6;
  const base = METAPHOR_BANK[moduloIdx] || METAPHOR_BANK[0]!;

  const isFirst = stepIdx === 0;
  const isLast = stepIdx === totalSteps - 1;

  let juniorTitle = base.juniorTitle!;
  let juniorCheer = base.juniorCheer!;

  if (isFirst) {
    juniorTitle = '🌮 Step 1: The Giant Taco Fold!';
  } else if (isLast) {
    juniorTitle = '🏆 Final Step: Bringing it to Life!';
    juniorCheer = 'YOU DID IT! 🌟 Show your origami sculpture to your teacher and friends!';
  }

  return {
    juniorTitle,
    juniorMetaphor: base.juniorMetaphor || `Fold like ${stepTitle}!`,
    juniorInstruction: base.juniorInstruction || 'Match corner ❶ to ❷ and press down flat!',
    juniorCheer,
    explorerInstruction: base.explorerInstruction || 'Lift corner ❶ along the golden motion arc to target ❷ and press crease firmly.',
    stemConcept: base.stemConcept || 'Geometric Axiom & Coordinate Transformation',
    stemTheorem: base.stemTheorem || 'Satisfies developable surface constraints $\\sum \\alpha_i = 360^\\circ$.',
    checkQuestions: base.checkQuestions as [string, string, string]
  };
};

// Web Speech API Voice Controller with Natural Neural Voice Priority & Audio Stream Fallback
class VoiceNarrationController {
  private _currentUtterance: SpeechSynthesisUtterance | null = null;
  private _currentAudio: HTMLAudioElement | null = null;
  private _voices: SpeechSynthesisVoice[] = [];
  private _language: LanguageCode = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this._updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this._updateVoices();
      }
    }
  }

  public setLanguage(lang: LanguageCode): void {
    this._language = lang;
  }

  public getLanguage(): LanguageCode {
    return this._language;
  }

  private _updateVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this._voices = window.speechSynthesis.getVoices();
    }
  }

  public get currentUtterance(): SpeechSynthesisUtterance | null {
    return this._currentUtterance;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || typeof Audio !== 'undefined');
  }

  private _findBestNeuralVoice(lang: LanguageCode = this._language): SpeechSynthesisVoice | null {
    if (!this._voices || this._voices.length === 0) {
      this._updateVoices();
    }

    if (lang === 'es') {
      const match = this._voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Helena') || v.name.includes('Jorge')));
      if (match) return match;
      const anyEs = this._voices.find(v => v.lang.startsWith('es'));
      if (anyEs) return anyEs;
    } else if (lang === 'ja') {
      const match = this._voices.find(v => v.lang.startsWith('ja') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Nanami') || v.name.includes('Keita')));
      if (match) return match;
      const anyJa = this._voices.find(v => v.lang.startsWith('ja'));
      if (anyJa) return anyJa;
    } else if (lang === 'fr') {
      const match = this._voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Denise') || v.name.includes('Henri')));
      if (match) return match;
      const anyFr = this._voices.find(v => v.lang.startsWith('fr'));
      if (anyFr) return anyFr;
    } else if (lang === 'hi') {
      const match = this._voices.find(v => v.lang.startsWith('hi') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Swara') || v.name.includes('Madhur')));
      if (match) return match;
      const anyHi = this._voices.find(v => v.lang.startsWith('hi'));
      if (anyHi) return anyHi;
    }

    // Explicit ranking of hyper-natural neural voices for English
    const priorityChecks = [
      (v: SpeechSynthesisVoice) => (v.name.includes('Natural') || v.name.includes('Online (Natural)')) && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => (v.name.includes('Aria') || v.name.includes('Jenny') || v.name.includes('Guy')) && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Google UK English Female') || v.name.includes('Google US English'),
      (v: SpeechSynthesisVoice) => v.name.includes('Google') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => (v.name.includes('Enhanced') || v.name.includes('Premium')) && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && !v.name.includes('David') && !v.name.includes('Desktop') && !v.name.includes('Bad')
    ];

    for (const check of priorityChecks) {
      const match = this._voices.find(check);
      if (match) return match;
    }

    return null;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    pitch = 1.0,
    rate = 0.95,
    lang: LanguageCode = this._language
  ): void {
    this.stop();

    if (!text || text.trim().length === 0) {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Check if a high-quality natural/neural voice exists in browser SpeechSynthesis
    const neuralVoice = this._findBestNeuralVoice(lang);

    if (neuralVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = neuralVoice;
        utterance.lang = neuralVoice.lang || lang;
        utterance.pitch = pitch;
        utterance.rate = rate;

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          this._currentUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          this._currentUtterance = null;
          if (onEnd) onEnd();
        };

        this._currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        // Fall back to natural audio stream below
      }
    }

    // 2. High-Quality Natural Online Stream Fallback
    try {
      const queryText = encodeURIComponent(cleanText.slice(0, 190));
      const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${queryText}`;
      const audio = new Audio(streamUrl);
      this._currentAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        this._currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this._currentAudio = null;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const fallbackUtt = new SpeechSynthesisUtterance(cleanText);
            fallbackUtt.rate = rate;
            fallbackUtt.lang = lang;
            fallbackUtt.onend = () => onEnd?.();
            fallbackUtt.onerror = () => onEnd?.();
            this._currentUtterance = fallbackUtt;
            window.speechSynthesis.speak(fallbackUtt);
            return;
          } catch {}
        }
        if (onEnd) onEnd();
      };

      audio.play().catch(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const fallbackUtt = new SpeechSynthesisUtterance(cleanText);
          fallbackUtt.rate = rate;
          fallbackUtt.lang = lang;
          fallbackUtt.onend = () => onEnd?.();
          fallbackUtt.onerror = () => onEnd?.();
          this._currentUtterance = fallbackUtt;
          window.speechSynthesis.speak(fallbackUtt);
        } else if (onEnd) {
          onEnd();
        }
      });
    } catch {
      if (onEnd) onEnd();
    }
  }

  public speakStep(
    stepIdx: number,
    totalSteps: number,
    lang: LanguageCode = this._language,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    const moduloIdx = stepIdx === totalSteps - 1 ? 5 : (stepIdx % 6);
    const langBank = LOCALIZED_METAPHORS[lang] || LOCALIZED_METAPHORS.en;
    const profile = langBank[moduloIdx] || langBank[0];
    const textToSpeak = `${profile.instruction} ${profile.cheer}`;
    this.speak(textToSpeak, onStart, onEnd, 1.0, 0.95, lang);
  }

  public getLocalizedStep(stepIdx: number, totalSteps: number, lang: LanguageCode = this._language): LocalizedStepText {
    const moduloIdx = stepIdx === totalSteps - 1 ? 5 : (stepIdx % 6);
    const langBank = LOCALIZED_METAPHORS[lang] || LOCALIZED_METAPHORS.en;
    return langBank[moduloIdx] || langBank[0];
  }

  public stop(): void {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
      } catch {}
      this._currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    this._currentUtterance = null;
  }
}

export const schoolVoice = new VoiceNarrationController();
