// The portfolio. Add, remove or reorder films here.
// Each film needs assets/video/<id>.mp4 and assets/posters/<id>.jpg
export const FEATURED = [
  { id: "cupid", title: "Stupid Cupid",
    kind: { en: "Spec ad for Tinder", es: "Anuncio spec para Tinder" },
    desc: { en: "Cupid shoots first and misses. One locked shot on a bench in Plaza de Armas, Old San Juan.",
            es: "Cupido dispara primero y falla. Una sola toma fija en un banco de la Plaza de Armas, Viejo San Juan." } },
  { id: "vans", title: "I Like It",
    kind: { en: "Spec ad for Vans", es: "Anuncio spec para Vans" },
    desc: { en: "Thirty seconds, four pairs and one day across San Juan, cut to the beat.",
            es: "Treinta segundos, cuatro pares y un día por San Juan, editado al ritmo." } }
];

export const FILMS = [
  { id: "iseethem", title: "I See Them",
    kind: { en: "Short film", es: "Cortometraje" },
    desc: { en: "She sees them. She has learned to ignore them.", es: "Ella los ve. Aprendió a ignorarlos." } },
  { id: "flow", title: "With the Flow",
    kind: { en: "Motion design", es: "Motion design" },
    desc: { en: "Red, black and a pickup truck. Illustration in motion.", es: "Rojo, negro y una pickup. Ilustración en movimiento." } },
  { id: "isla", title: "Puerto Rico",
    kind: { en: "Tourism concept", es: "Concepto de turismo" },
    desc: { en: "Piraguas, surf, family and El Morro in twenty five seconds.", es: "Piraguas, surf, familia y El Morro en veinticinco segundos." } },
  { id: "hekate", title: "Hekate",
    kind: { en: "Character film", es: "Film de personaje" },
    desc: { en: "The triple goddess and her three headed wolf.", es: "La diosa triple y su lobo de tres cabezas." } },
  { id: "bee", title: "Your Brand Could Own This Moment",
    kind: { en: "Ad concept", es: "Concepto publicitario" },
    desc: { en: "A bee's eye ride through the park, with an open seat for a sponsor.", es: "Un paseo por el parque a vista de abeja, con un asiento libre para un auspiciador." } },
  { id: "witch", title: "The Witch",
    kind: { en: "Wren Mora, original series", es: "Wren Mora, serie original" },
    desc: { en: "A young witch, a giant toad and a cat with opinions.", es: "Una brujita, un sapo gigante y un gato con opiniones." } },
  { id: "slowmagic", title: "Slow Magic",
    kind: { en: "Wren Mora, original series", es: "Wren Mora, serie original" },
    desc: { en: "A broom ride over the lake and a picnic at the top of the world.", es: "Un paseo en escoba sobre el lago y un picnic en el tope del mundo." } },
  { id: "zombies", title: "My Therapist Said Stop Making Zombie Videos",
    kind: { en: "Horror comedy", es: "Comedia de horror" },
    desc: { en: "I did not stop.", es: "No paré." } },
  { id: "pigeon", title: "The Pigeon",
    kind: { en: "FPV comedy", es: "Comedia FPV" },
    desc: { en: "Old San Juan at wing level, and one stolen snack.", es: "El Viejo San Juan a nivel de ala, y una merienda robada." } },
  { id: "werewolf", title: "Full Moon",
    kind: { en: "Horror reel", es: "Reel de horror" },
    desc: { en: "A transformation in fifteen seconds.", es: "Una transformación en quince segundos." } },
  { id: "coven", title: "The Coven",
    kind: { en: "Short film", es: "Cortometraje" },
    desc: { en: "A lantern, a bonfire and a circle you should not walk into.", es: "Un farol, una fogata y un círculo al que no deberías entrar." } },
  { id: "you", title: "You",
    kind: { en: "Art film", es: "Film de arte" },
    desc: { en: "Marble, stairs and a question of scale.", es: "Mármol, escaleras y una cuestión de escala." } }
];

// Fan films shown large
export const FAN = [
  { id: "harry", title: "Harry Potter",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "The last duel, moved to a black rock beach under a storm.", es: "El último duelo, mudado a una playa de roca negra bajo una tormenta." } },
  { id: "quick", title: "Quicksilver",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "Time stops in the kitchen. He eats, fixes the guards and dances one merengue step.", es: "El tiempo se detiene en la cocina. Come, acomoda a los guardias y baila un pasito de merengue." } }
];

// Second strip. The first entry sits next to the heading.
export const MORE = [
  { id: "titan", title: "Attack on Titan",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "Two titans and one forest that will not survive them.", es: "Dos titanes y un bosque que no va a sobrevivirlos." } },
  { id: "ath", title: "ATH Móvil",
    kind: { en: "Brand film", es: "Film de marca" },
    desc: { en: "Everyone stays frozen until the payment lands.", es: "Todo el mundo se queda congelado hasta que llega el pago." } },
  { id: "dragons", title: "Game of Thrones",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "Dragon riders above the storm.", es: "Jinetes de dragón sobre la tormenta." } },
  { id: "yuja", title: "Yuja Wang",
    kind: { en: "Tribute", es: "Tributo" },
    desc: { en: "A grand piano on a mountaintop at sunset.", es: "Un piano de cola en el tope de una montaña al atardecer." } },
  { id: "kill", title: "Kill Luis",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "A Kill Bill homage with the wrong guy in the yellow suit.", es: "Un homenaje a Kill Bill con el tipo equivocado en el traje amarillo." } },
  { id: "rav4", title: "RAV4",
    kind: { en: "Brand film", es: "Film de marca" },
    desc: { en: "Parallel parking in Old San Juan, with a little help.", es: "Estacionarse en paralelo en el Viejo San Juan, con una ayudita." } },
  { id: "constantine", title: "Constantine",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "A visit to the other side.", es: "Una visita al otro lado." } },
  { id: "thriller", title: "Lo Que Se Ve No Se Pregunta",
    kind: { en: "Brand film", es: "Film de marca" },
    desc: { en: "A thriller breaks out in the cinema lobby.", es: "Se forma un thriller en el lobby del cine." } },
  { id: "jurassic", title: "Jurassic Paragliding",
    kind: { en: "Fan film", es: "Fan film" },
    desc: { en: "A paraglider drops into the wrong valley.", es: "Un parapente cae en el valle equivocado." } },
  { id: "pulse", title: "Heart Rate",
    kind: { en: "Spec ad", es: "Anuncio spec" },
    desc: { en: "The watch notices her before he does.", es: "El reloj la nota antes que él." } },
  { id: "rooftop", title: "Rooftop",
    kind: { en: "Horror comedy", es: "Comedia de horror" },
    desc: { en: "A rifle, a rooftop and a very slow crowd.", es: "Un rifle, una azotea y un público muy lento." } },
  { id: "bedwell", title: "Bedwell",
    kind: { en: "Motion design", es: "Motion design" },
    desc: { en: "A dream in blue flowers.", es: "Un sueño en flores azules." } }
];

// Brand work planned in 3D, shown large
export const BUILT = [
  { id: "meson", title: "El Mesón Navidad",
    kind: { en: "TV commercial, built almost entirely in Blender 3D", es: "Comercial de TV, hecho casi completo en Blender 3D" },
    desc: { en: "A paper pop up card of Puerto Rico opens and the camera flies through four Christmas scenes.", es: "Una tarjeta pop up de papel de Puerto Rico se abre y la cámara vuela por cuatro escenas de Navidad." } },
  { id: "gx", title: "Lexus GX",
    kind: { en: "Brand film", es: "Film de marca" },
    desc: { en: "One continuous shot: in through the rear window, around the dog and out the windshield.", es: "Una sola toma continua: entra por el cristal trasero, rodea al perro y sale por el parabrisas." } },
  { id: "gxsplit", title: "Layout to Render",
    kind: { en: "Lexus GX, 3D layout and final picture side by side", es: "Lexus GX, layout 3D e imagen final lado a lado" },
    desc: { en: "The same shot twice: the 3D scene that planned the camera, and what it became.", es: "La misma toma dos veces: la escena 3D que planificó la cámara, y en lo que se convirtió." } },
  { id: "precio", title: "Precio Final",
    kind: { en: "Triangle Dealers, 3D blockout and final render", es: "Triangle Dealers, blockout 3D y render final" },
    desc: { en: "A dealership blocked in simple shapes, then lit up with fireworks and balloons.", es: "Un dealer bloqueado en figuras simples, y después encendido con fuegos artificiales y bombas." } }
];
