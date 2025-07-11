import claraMain from '../assets/images/clara/clara_main.png';
import pascalMain from '../assets/images/pascal/pascal_main.png';
import garyMain from '../assets/images/gary/gary_main.png';
import eliasMain from '../assets/images/elias/elias_main.png';
import eliasAlt from '../assets/images/elias/elias_alt.png';
import meiMain from '../assets/images/mei/mei_main.png';
import tomMain from '../assets/images/tom/tom_main.png';
import mick from '../assets/images/secondary_characters/mick.png';
import james from '../assets/images/secondary_characters/james.png';

const charactersData = [
  {
    "id": "pascal",
    "name": "Pascal Ó Riain",
    "description": "A reserved Irish financial analyst clinging to control while yearning for disruption.",
    "bio": "Pascal grew up in a windswept Irish town with a strict home life, seeking stability through finance. Beneath his orderly facade, he craves connection and vulnerability, a journey marked by bergamot’s solace.",
    "images": [
      pascalMain,
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop"
    ],
    "traits": ["Orderly", "Reserved", "Disciplined", "Yearns for disruption"],
    "locations": [
      { "year": "1993-2011", "place": "Ballina, Ireland", "details": "Grew up in a strict coastal town, shaped by discipline." },
      { "year": "2011-2026", "place": "Edinburgh, Scotland", "details": "Moved for university and career, found both chaos and solace." }
    ],
    "appearance": { "hair": "Dark brown, neat", "eyes": "Hazel", "build": "Lean, wiry" },
    "psyche": { "personality": ["Introspective", "Guarded", "Curious"], "quirks": ["Fiddles with pens", "Obsessed with bergamot tea"] },
    "relationships": { "Elías": "Toxic ex", "Mei": "Loyal friend", "Tom": "Gentle ex", "Clara": "Maternal ally" },
    "timeline": []
  },
  {
    "id": "elias",
    "name": "Elías Moreau",
    "description": "A magnetic, manipulative drifter with a “smoke and mirrors” charm.",
    "bio": "Elías, a Belgian wanderer, thrives on control and fleeting connections, his charm hiding a cruel streak. His cigarette smoke contrasts Pascal’s bergamot, marking his chaotic path.",
    "images": [
      eliasMain,
      eliasAlt
    ],
    "traits": ["Charismatic", "Manipulative", "Restless", "Cruel"],
    "locations": [
      { "year": "1985-2017", "place": "Charleroi, Belgium", "details": "Grew up in an industrial city, shaped by instability." },
      { "year": "2017-2020", "place": "London, England", "details": "Drifted through nightlife, honing his charm." },
      { "year": "2024-2026", "place": "Edinburgh, Scotland", "details": "Met Pascal, sparked chaos, then fled." }
    ],
    "appearance": { "hair": "Black, tousled", "eyes": "Green", "build": "Tall, lean" },
    "psyche": { "personality": ["Charming", "Deceptive", "Impulsive"], "quirks": ["Always smokes", "Fidgets with lighter"] },
    "relationships": { "Pascal": "Manipulated lover", "Mei": "Distrusted acquaintance", "Clara": "Critic", "Tom": "Ignored rival" },
    "timeline": []
  },
  {
    "id": "mei",
    "name": "Mei Nakamura",
    "description": "A precise, private policy analyst with fierce loyalty and a sharp mind.",
    "bio": "Born in Tokyo, raised in Edinburgh, Mei’s discipline and empathy anchor Pascal’s healing. Her quiet strength contrasts Elías’s chaos, grounded by bergamot’s clarity.",
    "images": [
      meiMain,
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=300&h=400&fit=crop"
    ],
    "traits": ["Disciplined", "Precise", "Private", "Discerning"],
    "locations": [
      { "year": "1987-2005", "place": "Tokyo, Japan", "details": "Born and raised under high expectations." },
      { "year": "2005-2026", "place": "Edinburgh, Scotland", "details": "Moved for university, built a life and bond with Pascal." }
    ],
    "appearance": { "hair": "Black, sleek", "eyes": "Dark brown", "build": "Petite, poised" },
    "psyche": { "personality": ["Focused", "Empathetic", "Reserved"], "quirks": ["Organizes notes obsessively"] },
    "relationships": { "Pascal": "Lifelong friend", "Elías": "Wary critic", "Clara": "Close ally", "Tom": "Trusted friend" },
    "timeline": []
  },
  {
    "id": "clara",
    "name": "Clara Devlin",
    "description": "An effervescent, maternal community worker with zero tolerance for pretence.",
    "bio": "Raised in a lively Galway household, Clara’s warmth and intuition make her Pascal’s protector and Elías’s foe, her presence a bergamot-scented anchor.",
    "images": [
      claraMain,
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop"
    ],
    "traits": ["Empath", "Protective", "Affectionate", "Grounded"],
    "locations": [
      { "year": "1984-2010", "place": "Galway, Ireland", "details": "Grew up in a vibrant, supportive family." },
      { "year": "2010-2026", "place": "Edinburgh, Scotland", "details": "Moved for community work, met Pascal and Mei." }
    ],
    "appearance": { "hair": "Auburn, wavy", "eyes": "Blue", "build": "Curvy, warm" },
    "psyche": { "personality": ["Warm", "Intuitive", "Direct"], "quirks": ["Hums folk tunes", "Collects teacups"] },
    "relationships": { "Pascal": "Maternal ally", "Elías": "Fierce critic", "Mei": "Close friend", "Tom": "Warm acquaintance" },
    "timeline": []
  },
  {
    "id": "tom",
    "name": "Tom Hartley",
    "description": "A gentle, practical ex who once offered Pascal a steady kind of love.",
    "bio": "Raised by a single mum in Yorkshire, Tom’s quiet kindness grounds Pascal’s healing, his steady presence a contrast to Elías’s chaos, tied to bergamot’s solace.",
    "images": [
      tomMain,
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop"
    ],
    "traits": ["Gentle", "Loyal", "Practical", "Quiet"],
    "locations": [
      { "year": "1986-2012", "place": "Yorkshire, England", "details": "Raised in a modest, supportive home." },
      { "year": "2012-2015", "place": "Dublin, Ireland", "details": "Met Pascal, shared a quiet romance." },
      { "year": "2015-2026", "place": "Edinburgh, Scotland", "details": "Moved for work, reconnected with Pascal." }
    ],
    "appearance": { "hair": "Blond, short", "eyes": "Grey", "build": "Stocky, sturdy" },
    "psyche": { "personality": ["Kind", "Steady", "Reserved"], "quirks": ["Loves gardening", "Wears old jumpers"] },
    "relationships": { "Pascal": "Gentle ex", "Elías": "Ignored rival", "Mei": "Trusted friend", "Clara": "Warm acquaintance" },
    "timeline": []
  },
  {
  "id": "gary",
  "name": "Gary Temple",
  "description": "A practical builder from Liverpool with a quiet strength and a heart unused to vulnerability.",
  "bio": "Gary is a builder by trade, born and raised in Liverpool in a boisterous working-class family. He married young and recently divorced, with two kids he sees occasionally. He moved into his current flat seeking a fresh start, though he describes it simply as 'cheap and quiet.'",
  "images": [
    garyMain,
    "https://images.unsplash.com/photo-1560250097-78b2b98b1b74?w=300&h=400&fit=crop"
  ],
  "traits": ["Practical", "Kind", "Lonely", "Emotionally cautious"],
  "locations": [
    {
      "year": "1975-1999",
      "place": "Liverpool",
      "details": "Grew up in a boisterous working-class family, learned to be tough and practical."
    },
    {
      "year": "1999-present",
      "place": "Edinburgh",
      "details": "Moved for work, got married and divorced."
    }
  ],
  "appearance": {
    "hair": "Bald/shaved head",
    "eyes": "Heavy-lidded brown",
    "build": "Stocky, broad-chested",
    "clothing": "Plain, faded work clothes",
    "scent": "Faintly of sweat, plaster dust, and soap"
  },
  "psyche": {
    "personality": ["Emotionally cautious", "Lonely", "Guilt-ridden", "Routine-oriented"],
    "quirks": ["Finds comfort in physical work", "Enjoys watching telly with a beer"]
  },
  "relationships": {
    "Pascal": "Pascal is drawn to Gary's masculinity and ease; Gary sees Pascal as a bit stiff but enjoys his company."
  },
  "timeline": []
},
 {
    "id": "james",
    "name": "James",
    "description": "A refined and perhaps somewhat detached individual, encountered by Pascal's through seedy circumstances.",
    "bio": "James is an acquaintance Pascal meets in a hotel setting after speaking online. His interactions are  calm and composed. His life is probably one of quiet luxury or significant professional demands.",
    "images": [james],
    "traits": ["Refined", "Calm", "Observant", "Professionally polished"],
    "locations": [
      {
        "year": "Unknown",
        "place": "Edinburgh or international",
        "details": "Associated with high-end hotels, implying a life of travel or a senior professional role."
      }
    ],
    "appearance": {
      "hair": "Neat, dark but greying",
      "eyes": "Intelligent, perhaps a little guarded",
      "build": "Stocky and broad-shouldered",
      "clothing": "Business attire (e.g., tailored shirts, subtle luxury brands)",
      "scent": "Faintly of expensive cologne or clean linen, very subtle"
    },
    "psyche": {
      "personality": ["Reserved", "Intellectual", "Controlled", "Subtly perceptive"],
      "quirks": ["Prefers quiet conversations", "Appreciates efficiency and discretion"]
    },
    "relationships": {
      "Pascal": "A professional or social acquaintance. James likely provides a calm, rational presence that Pascal, post-Elías, might find appealing or comfortable."
    },
    "timeline": []
  },
  {
    "id": "mick",
    "name": "Mick",
    "description": "An Irish man whose formidable appearance belies a warm and friendly nature.",
    "bio": "Mick is an Irish individual with a 'scary face' and 'tattooed' appearance, but 'friendly eyes.' This suggests a person who might initially seem intimidating due to their exterior, but possesses genuine warmth and kindness. He could be a worker, a local regular, or someone connected to the less polished, more authentic side of Edinburgh.",
    "images": [mick],
    "traits": ["Kind-hearted", "Rough around the edges", "Perceptive"],
    "locations": [
      {
        "year": "Unknown",
        "place": "Ireland (birth)",
        "details": "Grew up in Ireland, likely from a working-class background given his appearance cues."
      },
      {
        "year": "Unknown",
        "place": "Edinburgh",
        "details": "Not clear if in Edinburgh on holiday or work."
      }
    ],
    "appearance": {
      "hair": "Shaved or very short, possibly with a hint of stubble",
      "eyes": "Friendly, crinkling at the corners when he smiles",
      "build": "Slender with skinny tatooed arms",
      "clothing": "Alternative, possibly with a punk or rock influence (e.g., band t-shirts)",
      "scent": "Faintly of pubs, clean laundry, or fresh air"
    },
    "psyche": {
      "personality": ["Friendly", "No-nonsense", "Outgoing", "Good-humored"],
      "quirks": ["Face tatoos"],
      "accent": "Strong Dublin accent"
    },
    "relationships": {
      "Pascal": "Kinship for fellow countryman, curious about this 'posh' Irishman in Edinburgh."
    },
    "timeline": []
  }
]

export default charactersData;
