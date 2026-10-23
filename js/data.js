/* Sample desk for Lumina Living. Homes, prices, and people are demonstration content. */
const LUMINA_DATA = (() => {
  const pic = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
  const face = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1100&q=80`;

  const properties = [
    {
      id: "amber-house",
      title: "The Amber House",
      tagline: "A garden villa that keeps the afternoon light.",
      description: "Set back from Marula Lane, the Amber House opens into a double-height living room and a pool that takes the sun after three. The primary suite has its own terrace, and the kitchen is built for cooking with a full table of people.",
      status: "sale",
      type: "Villa",
      price: 86500000,
      beds: 5,
      baths: 5,
      sqm: 480,
      land: "Half an acre",
      parking: 4,
      year: 2019,
      tenure: "Freehold",
      furnishing: "Unfurnished",
      mood: "garden",
      featured: true,
      badge: "Signature",
      location: "Karen",
      city: "Nairobi",
      address: "Marula Lane, Karen, Nairobi",
      lat: -1.3194,
      lng: 36.7081,
      agentId: "amina",
      listed: "2026-02-02",
      amenities: ["Pool", "Jacaranda garden", "Staff cottage", "Solar array", "Borehole", "Home office", "Smart security", "Covered terrace"],
      images: [
        pic("photo-1600596542815-ffad4c1539a9"),
        pic("photo-1600607687939-ce8a6c25118c"),
        pic("photo-1600566753086-00f18fb6b3ea"),
        pic("photo-1616594039964-ae9021a400a0")
      ]
    },
    {
      id: "gigiri-glass",
      title: "Gigiri Glass House",
      tagline: "Gallery rooms on a quiet diplomatic crescent.",
      description: "A long glass hall runs the length of this Gigiri house, with a lap pool on one side and a lawn on the other. Six suites, a study wing, and a kitchen that can host without taking over the evening.",
      status: "sale",
      type: "House",
      price: 125000000,
      beds: 6,
      baths: 6,
      sqm: 640,
      land: "Three-quarter acre",
      parking: 5,
      year: 2022,
      tenure: "Freehold",
      furnishing: "Unfurnished",
      mood: "garden",
      featured: true,
      badge: "Signature",
      location: "Gigiri",
      city: "Nairobi",
      address: "Limuru Road crescent, Gigiri, Nairobi",
      lat: -1.227,
      lng: 36.807,
      agentId: "amina",
      listed: "2026-01-18",
      amenities: ["Lap pool", "Study wing", "Staff quarters", "Generator", "Borehole", "Wine store", "Guest cottage", "24-hour security"],
      images: [
        pic("photo-1512917774080-9991f1c4c750"),
        pic("photo-1613977257363-707ba9348227"),
        pic("photo-1600210492486-724fe5c67fb0"),
        pic("photo-1600573472591-ee6b68d14c68")
      ]
    },
    {
      id: "nyali-breeze",
      title: "Nyali Breeze",
      tagline: "Palm court, outdoor kitchen, ocean air.",
      description: "Two minutes from the beach road, this Nyali villa keeps the main rooms open to a palm court and an outdoor kitchen. Evenings are for the terrace. The upper floor catches the sea breeze without facing the street.",
      status: "sale",
      type: "Villa",
      price: 55000000,
      beds: 4,
      baths: 4,
      sqm: 360,
      land: "Third of an acre",
      parking: 3,
      year: 2018,
      tenure: "Freehold",
      furnishing: "Partly furnished",
      mood: "ocean",
      featured: true,
      badge: "Coast",
      location: "Nyali",
      city: "Mombasa",
      address: "Links Road, Nyali, Mombasa",
      lat: -4.035,
      lng: 39.712,
      agentId: "grace",
      listed: "2026-03-01",
      amenities: ["Palm court", "Outdoor kitchen", "Pool", "Staff room", "Backup power", "Sea breeze upper floor"],
      images: [
        pic("photo-1571896349842-33c89424de2d"),
        pic("photo-1564013799919-ab600027ffc6"),
        pic("photo-1600210492493-0946911123ea"),
        pic("photo-1540541338287-41700207dee6")
      ]
    },
    {
      id: "skyline-penthouse",
      title: "Skyline Penthouse",
      tagline: "A private lift lobby over the Westlands lights.",
      description: "The penthouse sits above a Westlands tower with a wrap balcony and a private lift lobby. The kitchen faces the city, the suites face quiet, and the building keeps a pool, a gym, and a concierge.",
      status: "sale",
      type: "Apartment",
      price: 42000000,
      beds: 3,
      baths: 3,
      sqm: 210,
      land: null,
      parking: 2,
      year: 2021,
      tenure: "Leasehold",
      furnishing: "Unfurnished",
      mood: "city",
      featured: true,
      badge: "Hot",
      location: "Westlands",
      city: "Nairobi",
      address: "Waiyaki Way tower, Westlands, Nairobi",
      lat: -1.267,
      lng: 36.811,
      agentId: "david",
      listed: "2026-03-20",
      amenities: ["Wrap balcony", "Private lift lobby", "Pool", "Gym", "Concierge", "Backup power", "Covered parking"],
      images: [
        pic("photo-1613490493576-7fde63acd811"),
        pic("photo-1502672260266-1c1ef2d93688"),
        pic("photo-1600585154526-990dced4db0d"),
        pic("photo-1600566752355-35792bedcfea")
      ]
    },
    {
      id: "diani-shore",
      title: "Diani Shore Villa",
      tagline: "White rooms, a slow garden, and the reef nearby.",
      description: "A furnished five-bedroom villa on Diani Beach for a long let. The garden runs toward the dunes, the pool is shaded at noon, and the house can sleep a family plus guests without feeling crowded.",
      status: "rent",
      type: "Villa",
      price: 320000,
      beds: 5,
      baths: 5,
      sqm: 400,
      land: "Two-fifths of an acre",
      parking: 3,
      year: 2017,
      tenure: "Freehold",
      furnishing: "Furnished",
      mood: "ocean",
      featured: true,
      badge: "Coast",
      location: "Diani Beach",
      city: "Diani",
      address: "Beach Road, Diani Beach",
      lat: -4.28,
      lng: 39.595,
      agentId: "grace",
      listed: "2025-11-12",
      amenities: ["Furnished", "Pool", "Garden to the dunes", "Staff quarters", "Outdoor shower", "Backup power", "Beach access path"],
      images: [
        pic("photo-1507525428034-b723cf961d3e"),
        pic("photo-1540541338287-41700207dee6"),
        pic("photo-1582268611958-ebfd161ef9cf"),
        pic("photo-1616594039964-ae9021a400a0")
      ]
    },
    {
      id: "runda-canopy",
      title: "Runda Canopy",
      tagline: "Mature trees and a lawn big enough for a long table.",
      description: "Runda Canopy sits under old trees on a quiet close. The plan is simple: wide living rooms, a family kitchen, and bedrooms that do not hear the gate. There is room for a tennis lawn if you want one later.",
      status: "sale",
      type: "House",
      price: 72000000,
      beds: 5,
      baths: 4,
      sqm: 430,
      land: "Half an acre",
      parking: 4,
      year: 2016,
      tenure: "Freehold",
      furnishing: "Unfurnished",
      mood: "garden",
      featured: false,
      badge: "",
      location: "Runda",
      city: "Nairobi",
      address: "Runda close, Nairobi",
      lat: -1.22,
      lng: 36.81,
      agentId: "amina",
      listed: "2025-12-02",
      amenities: ["Mature trees", "Family kitchen", "Staff quarters", "Borehole", "Study", "Double garage"],
      images: [
        pic("photo-1580587771525-78b9dba3b914"),
        pic("photo-1600585154340-be6161a56a0c"),
        pic("photo-1600607687939-ce8a6c25118c"),
        pic("photo-1600573472591-ee6b68d14c68")
      ]
    },
    {
      id: "lavington-grove",
      title: "Lavington Grove",
      tagline: "A townhouse on a green, walkable close.",
      description: "Four bedrooms over three light floors, with a courtyard garden and a kitchen that opens to it. Lavington Grove suits a family that wants schools nearby and a street you can walk after supper.",
      status: "sale",
      type: "Townhouse",
      price: 34500000,
      beds: 4,
      baths: 4,
      sqm: 240,
      land: "Courtyard garden",
      parking: 2,
      year: 2020,
      tenure: "Leasehold",
      furnishing: "Unfurnished",
      mood: "family",
      featured: false,
      badge: "New",
      location: "Lavington",
      city: "Nairobi",
      address: "James Gichuru close, Lavington, Nairobi",
      lat: -1.2785,
      lng: 36.7689,
      agentId: "amina",
      listed: "2026-04-02",
      amenities: ["Courtyard garden", "Family kitchen", "Study", "DSQ", "Gated close", "Rooftop drying"],
      images: [
        pic("photo-1600047509782-20d39509f26d"),
        pic("photo-1600210492486-724fe5c67fb0"),
        pic("photo-1600566753086-00f18fb6b3ea")
      ]
    },
    {
      id: "coral-court",
      title: "Coral Court",
      tagline: "A colour-forward two-bedroom with a rooftop.",
      description: "Coral Court is a partly furnished Kilimani flat with a proper kitchen, a balcony for two chairs, and a residents' rooftop. Cafés and the office corridor are a short ride, not a project.",
      status: "rent",
      type: "Apartment",
      price: 185000,
      beds: 2,
      baths: 2,
      sqm: 110,
      land: null,
      parking: 1,
      year: 2019,
      tenure: "Leasehold",
      furnishing: "Partly furnished",
      mood: "city",
      featured: false,
      badge: "",
      location: "Kilimani",
      city: "Nairobi",
      address: "Argwings Kodhek, Kilimani, Nairobi",
      lat: -1.2921,
      lng: 36.7856,
      agentId: "david",
      listed: "2026-02-14",
      amenities: ["Balcony", "Residents' rooftop", "Backup power", "Lift", "Covered parking", "Fibre ready"],
      images: [
        pic("photo-1560448204-e02f11c3d0e2"),
        pic("photo-1599423300746-b62533397364"),
        pic("photo-1493809842364-78817add7ffb")
      ]
    },
    {
      id: "kileleshwa-loft",
      title: "Kileleshwa Loft",
      tagline: "Light, a balcony, and a rent that leaves room.",
      description: "A bright two-bedroom in Kileleshwa for someone furnishing their first serious place. The living room faces east, the balcony holds herbs, and the street has grocers within a walk.",
      status: "rent",
      type: "Apartment",
      price: 95000,
      beds: 2,
      baths: 1,
      sqm: 78,
      land: null,
      parking: 1,
      year: 2015,
      tenure: "Leasehold",
      furnishing: "Unfurnished",
      mood: "city",
      featured: false,
      badge: "Value",
      location: "Kileleshwa",
      city: "Nairobi",
      address: "Mandera Road, Kileleshwa, Nairobi",
      lat: -1.2836,
      lng: 36.7826,
      agentId: "david",
      listed: "2026-01-09",
      amenities: ["East light", "Balcony", "Water storage", "Parking", "Walk to shops"],
      images: [
        pic("photo-1493809842364-78817add7ffb"),
        pic("photo-1522708323590-d24dbb6b0267"),
        pic("photo-1560185007-cde436f6a4d0")
      ]
    },
    {
      id: "riverside-duplex",
      title: "Riverside Duplex",
      tagline: "Two levels, a study, and green at the window.",
      description: "A townhouse let in Riverside with a study that can close, a kitchen on the garden, and bedrooms upstairs. Useful if you work from home and still want to be near Westlands.",
      status: "rent",
      type: "Townhouse",
      price: 260000,
      beds: 3,
      baths: 3,
      sqm: 190,
      land: "Private courtyard",
      parking: 2,
      year: 2021,
      tenure: "Leasehold",
      furnishing: "Partly furnished",
      mood: "city",
      featured: false,
      badge: "",
      location: "Riverside",
      city: "Nairobi",
      address: "Riverside Drive, Nairobi",
      lat: -1.2695,
      lng: 36.8045,
      agentId: "david",
      listed: "2025-10-20",
      amenities: ["Study", "Courtyard", "DSQ", "Backup power", "Fibre", "Gated court"],
      images: [
        pic("photo-1600047509358-9dc75507daeb"),
        pic("photo-1600210492493-0946911123ea"),
        pic("photo-1600566753190-17f0baa2a6c3")
      ]
    },
    {
      id: "nanyuki-ridge",
      title: "Nanyuki Ridge",
      tagline: "Cool evenings, a fireplace, and a long view.",
      description: "A highland house outside Nanyuki with Mount Kenya on the clear mornings and a fireplace for the rest. One acre, a cottage kitchen, and enough quiet to hear the wind in the gums.",
      status: "sale",
      type: "House",
      price: 24500000,
      beds: 3,
      baths: 2,
      sqm: 180,
      land: "One acre",
      parking: 2,
      year: 2014,
      tenure: "Freehold",
      furnishing: "Partly furnished",
      mood: "highland",
      featured: false,
      badge: "",
      location: "Nanyuki",
      city: "Nanyuki",
      address: "Nanyuki ridge road, Laikipia",
      lat: 0.007,
      lng: 37.074,
      agentId: "brian",
      listed: "2025-09-15",
      amenities: ["Fireplace", "Mountain view", "Cottage garden", "Borehole", "Staff room", "Veranda"],
      images: [
        pic("photo-1572120360610-d971b9d7767c"),
        pic("photo-1480074568708-e7b720bb3f09"),
        pic("photo-1464822759023-fed622ff2c3b")
      ]
    },
    {
      id: "syokimau-haven",
      title: "Syokimau Haven",
      tagline: "A family house near the Expressway, with a real garden.",
      description: "Four bedrooms, a DSQ, and a quarter-acre garden in Syokimau. The plan is practical: a large kitchen, a ground-floor room for guests or parents, and a short run to the Expressway.",
      status: "sale",
      type: "House",
      price: 14500000,
      beds: 4,
      baths: 3,
      sqm: 170,
      land: "Quarter acre",
      parking: 2,
      year: 2023,
      tenure: "Freehold",
      furnishing: "Unfurnished",
      mood: "family",
      featured: false,
      badge: "Value",
      location: "Syokimau",
      city: "Nairobi",
      address: "Syokimau, off Mombasa Road",
      lat: -1.3625,
      lng: 36.9228,
      agentId: "zawadi",
      listed: "2026-03-28",
      amenities: ["Garden", "DSQ", "Ground-floor guest room", "Solar water", "Gated estate", "Parking"],
      images: [
        pic("photo-1570129477492-45c003edd2be"),
        pic("photo-1600047509782-20d39509f26d"),
        pic("photo-1600121848594-d8644e57abab")
      ]
    },
    {
      id: "kitengela-orchard",
      title: "Kitengela Orchard",
      tagline: "Three bedrooms, fruit trees, and room to add a studio.",
      description: "A 2022 house in Kitengela with fruit trees already in, a wide veranda, and a side yard where a studio or extra rooms can go later. A clear first family purchase.",
      status: "sale",
      type: "House",
      price: 18900000,
      beds: 3,
      baths: 2,
      sqm: 150,
      land: "Quarter acre",
      parking: 2,
      year: 2022,
      tenure: "Freehold",
      furnishing: "Unfurnished",
      mood: "family",
      featured: false,
      badge: "Value",
      location: "Kitengela",
      city: "Nairobi",
      address: "Kitengela, Kajiado",
      lat: -1.478,
      lng: 36.96,
      agentId: "zawadi",
      listed: "2026-04-10",
      amenities: ["Fruit trees", "Veranda", "Room to extend", "Borehole nearby", "Gated road", "Parking"],
      images: [
        pic("photo-1480074568708-e7b720bb3f09"),
        pic("photo-1449844908441-8829872d2607"),
        pic("photo-1560185007-cde436f6a4d0")
      ]
    }
  ];

  const agents = [
    {
      id: "amina",
      name: "Amina Hassan",
      role: "Principal, garden neighbourhoods",
      languages: ["English", "Swahili"],
      years: 12,
      areas: ["Karen", "Lavington", "Runda", "Gigiri"],
      bio: "Amina opened the Lumina desk after years of walking Karen lanes with families. She talks about light and Sundays before she talks about price, and she stays through the advocate's file.",
      photo: face("photo-1531123897727-8f129e1688ce")
    },
    {
      id: "david",
      name: "David Otieno",
      role: "City homes and lets",
      languages: ["English", "Swahili"],
      years: 8,
      areas: ["Westlands", "Kilimani", "Kileleshwa", "Riverside"],
      bio: "David keeps the apartment and townhouse desk. He is frank about service charge, lifts, water, and the real walk to the office.",
      photo: face("photo-1506277886164-e25aa3f4ef7f")
    },
    {
      id: "grace",
      name: "Grace Wanjiku",
      role: "Coast lead",
      languages: ["English", "Swahili"],
      years: 10,
      areas: ["Nyali", "Diani Beach"],
      bio: "Grace runs viewings on the coast, including video walks for clients who cannot fly in the same week. She knows which houses actually catch the breeze.",
      photo: face("photo-1544005313-94ddf0286df2")
    },
    {
      id: "brian",
      name: "Brian Kiprop",
      role: "Highlands",
      languages: ["English", "Swahili"],
      years: 9,
      areas: ["Nanyuki"],
      bio: "Brian covers Nanyuki and the ridge. He will tell you about water, access in the rains, and what the view does in July.",
      photo: face("photo-1506794778202-cad84cf45f1d")
    },
    {
      id: "zawadi",
      name: "Zawadi Mwangi",
      role: "First family homes",
      languages: ["English", "Swahili"],
      years: 6,
      areas: ["Syokimau", "Kitengela"],
      bio: "Zawadi helps first buyers read a plan, a title, and a budget without the theatre. She spends most weeks in Syokimau and Kitengela.",
      photo: face("photo-1531384441138-2736e62e0919")
    }
  ];

  const moods = [
    { id: "garden", name: "Garden light", blurb: "Lawns, trees, and rooms that open outdoors." },
    { id: "city", name: "City glow", blurb: "Balconies, short rides, lights after dark." },
    { id: "ocean", name: "Ocean air", blurb: "Salt on the breeze and slow bright mornings." },
    { id: "highland", name: "Highland gold", blurb: "Cool evenings, big skies, firelight." },
    { id: "family", name: "Family colour", blurb: "Space to grow, schools nearby, a real garden." }
  ];

  const neighbourhoods = [
    { name: "Karen", city: "Nairobi", blurb: "Jacarandas, long drives, and houses that keep their gardens.", image: pic("photo-1600596542815-ffad4c1539a9") },
    { name: "Westlands", city: "Nairobi", blurb: "Towers, supper spots, and a skyline from the balcony.", image: pic("photo-1611348524140-53c9a25263d6") },
    { name: "Kilimani", city: "Nairobi", blurb: "Cafés, young households, and flats with a bit of colour.", image: pic("photo-1560448204-e02f11c3d0e2") },
    { name: "Lavington", city: "Nairobi", blurb: "Family streets between school runs and green corners.", image: pic("photo-1600047509782-20d39509f26d") },
    { name: "Nyali", city: "Mombasa", blurb: "Beach road, palm courts, and rooms that stay airy.", image: pic("photo-1571896349842-33c89424de2d") },
    { name: "Diani Beach", city: "Diani", blurb: "Reef mornings and houses made for long stays.", image: pic("photo-1507525428034-b723cf961d3e") },
    { name: "Nanyuki", city: "Nanyuki", blurb: "Highland light, fireplaces, and a clear mountain day.", image: pic("photo-1464822759023-fed622ff2c3b") },
    { name: "Gigiri", city: "Nairobi", blurb: "Quiet crescents and houses with room to host.", image: pic("photo-1512917774080-9991f1c4c750") }
  ];

  const testimonials = [
    {
      name: "The Okellos",
      detail: "Bought in Karen, living in Kampala at the time",
      quote: "Amina sent a video at the hour the garden actually looks like the photos. We knew which house it was before we flew."
    },
    {
      name: "Wanjiru M.",
      detail: "Renting in Kilimani",
      quote: "David told me the service charge and the water story on the first call. The flat matched the note. That is rare."
    },
    {
      name: "James and Achieng",
      detail: "A long let on Diani Beach",
      quote: "Grace walked the breeze with the camera, not just the pool. We took Diani Shore and the house feels like the call."
    }
  ];

  const faqs = [
    {
      q: "How do viewings work?",
      a: "Choose a day on the home. Your agent confirms a time, meets you at the gate, and walks the house with you. If you are outside Kenya, the first walk can be a live video."
    },
    {
      q: "Are these prices fixed?",
      a: "The figures are asking prices on this sample desk. On a real instruction, offers go in writing and the seller decides. Nothing here is a contract."
    },
    {
      q: "Can you help with a mortgage?",
      a: "A live desk introduces buyers to lenders. The calculator is a sample, not a loan offer. Kenyan rates move, and deposits are often around 10 to 30 percent."
    },
    {
      q: "What extra costs should buyers plan for?",
      a: "Plan for legal fees, valuation, and stamp duty. In many Kenyan municipalities stamp duty is 4 percent of the value, and 2 percent in some cases. Your advocate confirms the exact figure."
    },
    {
      q: "I live outside Kenya. Can I still buy?",
      a: "Yes. The desk can arrange video viewings and coordinate with your advocate. You still need the usual identification and any land-board or company papers that apply to you."
    },
    {
      q: "Do you take homes to sell?",
      a: "Yes. Write with the neighbourhood, a few photos, and the price you have in mind. The desk replies with a viewing plan."
    }
  ];

  const offices = [
    {
      name: "Nairobi desk",
      line: "Prism Court, 4th Floor, Westlands Road",
      hours: "Mon–Fri 8:30–5:30, Sat 9:00–1:00",
      lat: -1.267,
      lng: 36.811
    },
    {
      name: "Coast desk",
      line: "Links Road, Nyali, Mombasa",
      hours: "Mon–Fri 9:00–5:00",
      lat: -4.035,
      lng: 39.712
    }
  ];

  return { properties, agents, moods, neighbourhoods, testimonials, faqs, offices };
})();
