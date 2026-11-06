const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Mister Ceramic database...');

  // 1. Admin and Staff users
  const adminPasswordHash = await bcrypt.hash('Admin@MisterCeramic2026', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@MisterCeramic2026', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@misterceramic.com' },
    update: {},
    create: {
      email: 'admin@misterceramic.com',
      passwordHash: adminPasswordHash,
      name: 'Workshop Director',
      phone: '+91 92072 09105',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@misterceramic.com' },
    update: {},
    create: {
      email: 'staff@misterceramic.com',
      passwordHash: staffPasswordHash,
      name: 'Senior Lead Detailer',
      phone: '+91 92072 09105',
      role: 'STAFF',
      isActive: true,
    },
  });

  console.log('Created users:', adminUser.email, staffUser.email);

  // 2. Business Settings
  const settings = [
    { key: 'BUSINESS_NAME', value: 'Mister Ceramic', description: 'Business trading name' },
    { key: 'TAGLINE', value: 'Beyond Shine. Beyond Protection.', description: 'Brand tagline' },
    { key: 'PHONE', value: '+91 92072 09105', description: 'Primary studio contact' },
    { key: 'WHATSAPP', value: '+919207209105', description: 'WhatsApp contact number' },
    { key: 'ADDRESS', value: 'Chegamanadu, Kottarakkara, Kollam, Kerala, India - 691506', description: 'Physical workshop address' },
    { key: 'MAPS_URL', value: 'https://www.google.com/maps/place/mister+ceramic/data=!4m2!3m1!1s0x3b0675fb65d87319:0x41a9e67271dc0506', description: 'Official Google Maps URL' },
    { key: 'WORKING_HOURS', value: 'Monday - Saturday: 9:00 AM - 7:00 PM | Sunday: By Appointment', description: 'Workshop operating schedule' },
    { key: 'EMAIL', value: 'care@misterceramic.com', description: 'Customer support email' },
    { key: 'MAX_DAILY_SLOTS', value: '4', description: 'Maximum simultaneous vehicle intake per day' },
  ];

  for (const s of settings) {
    await prisma.businessSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 3. Service Categories
  const categories = [
    {
      slug: 'car-protection',
      name: 'Car Protection',
      vehicleType: 'CAR',
      description: 'Ultra-durable nanotech coatings, self-healing paint protection films, and specialized thermal heat rejection sunfilms.',
      sortOrder: 1,
    },
    {
      slug: 'car-detailing-restoration',
      name: 'Car Detailing & Restoration',
      vehicleType: 'CAR',
      description: 'Multi-stage machine paint correction, surgical interior sanitation, leather nourishment, and master factory-finish repaint.',
      sortOrder: 2,
    },
    {
      slug: 'bike-services',
      name: 'Motorcycle & Superbike Services',
      vehicleType: 'BIKE',
      description: 'Dedicated high-precision detailing, tank & fairing PPF, heat-resistant ceramic coatings, and custom paintwork.',
      sortOrder: 3,
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const record = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap[cat.slug] = record.id;
  }

  // 4. Services
  const servicesData = [
    // Car Protection
    {
      slug: 'paint-protection-film-ppf',
      categoryId: catMap['car-protection'],
      name: 'Paint Protection Film (PPF)',
      vehicleType: 'CAR',
      headline: 'Self-Healing TPU Optical Armor Against Stone Chips & Kerala Road Debris',
      description: 'Precision pre-cut and custom-wrapped high-grade Thermoplastic Polyurethane (TPU) film with instant heat-activated self-healing properties, extreme hydrophobic top-coat, and crystal gloss clarity.',
      coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Instant self-healing of swirl marks and light stone abrasions with sunlight or warm water',
        'Exceptional resistance against road gravel, insect splatter, bird droppings, and tar stains',
        'Non-yellowing optical clarity with deep gloss or stealth satin finish options',
        'Custom edge-wrapped installation to prevent peeling and visible seam lines'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Multi-Stage Decontamination', description: 'Snow foam wash, iron fallout chemical dissolution, and synthetic clay bar decontamination to remove all surface bonded grime.' },
        { step: 2, title: 'Paint Correction & Edge Prep', description: 'Single-stage polish to eliminate micro-marring and prep paint edges with specialized panel wipe for 100% bond adhesion.' },
        { step: 3, title: 'Precision TPU Installation', description: 'Dust-free cleanroom application using slip solution, custom squeegee tensioning, and seamless edge wrapping around corners.' },
        { step: 4, title: 'Infrared Edge Curing & Seal', description: 'Heat gun border annealing and hydrophobic seal topcoat inspection before final release.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Luxury Sedans', 'SUVs', 'Sports Cars', 'New Deliveries']),
      defaultDurationHours: 48,
      startingPrice: 45000,
      warrantyInfo: 'Official manufacturer warranty certificate provided based on selected film series.',
      isFeatured: true,
      sortOrder: 1,
      packages: [
        { name: 'Front Track Pack (High Impact)', price: 45000, durationHours: 24, featuresJson: JSON.stringify(['Full Front Bumper', 'Complete Bonnet/Hood', 'Front Fenders', 'ORVM Mirror Caps', 'Headlight Armor']), warrantyMonths: 60, isPopular: false },
        { name: 'Full Vehicle TPU Armour (Gloss/Matte)', price: 95000, durationHours: 48, featuresJson: JSON.stringify(['100% Full Body Wrap', 'All Painted Surfaces', 'Headlights & Tail Lamps', 'Door Cups & Edges', 'Door Sill Protection', 'Annual Maintenance Checks']), warrantyMonths: 84, isPopular: true },
      ]
    },
    {
      slug: 'borophene-coating',
      categoryId: catMap['car-protection'],
      name: 'Borophene Coating',
      vehicleType: 'CAR',
      headline: 'Next-Generation Atomically Engineered 2D Matrix Coating with Extreme Thermal & Scratch Defense',
      description: 'Borophene represents the absolute pinnacle of nanotechnology. Stronger than graphene and with superior tensile strength, this 2D atomic allotrope of boron bonds covalently with clear coats, offering unmatched resistance to Kerala monsoonal acid rain, intense tropical UV, and micro-abrasion.',
      coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Ultra-dense 2D atomic hexagonal lattice with extraordinary tensile strength',
        'Superior heat dissipation that reduces water-spotting and chemical etching in high humidity',
        'Hyper-hydrophobic water contact angle exceeding 118 degrees for self-cleaning effect',
        'Slick, candy-like glass reflection with rich color depth'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Surgical Surface Inspection', description: 'Digital paint depth gauge measurement to map clear coat thickness across all metal and composite panels.' },
        { step: 2, title: 'Two-Stage Machine Correction', description: 'Compound cutting and jeweler polish refinement to achieve 95%+ defect elimination.' },
        { step: 3, title: 'Borophene Prime & Matrix Infusion', description: 'Hand application of borophene-infused primer followed by twin layers of pure borophene liquid crystal.' },
        { step: 4, title: 'Shortwave IR Lamp Curing', description: 'Controlled short-wave infrared bake at 65°C for maximum cross-link density.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['All Cars & SUVs requiring state-of-the-art protection']),
      defaultDurationHours: 24,
      startingPrice: 32000,
      warrantyInfo: 'Up to 5 years warranty with complimentary scheduled maintenance checks.',
      isFeatured: true,
      sortOrder: 2,
      packages: [
        { name: 'Borophene Elite (Double Layer)', price: 32000, durationHours: 24, featuresJson: JSON.stringify(['2 Layers Borophene Matrix', 'Full Paint Correction', 'Glass Hydrophobic Shield', 'Alloy Wheel Face Coating', '3-Year Studio Warranty']), warrantyMonths: 36, isPopular: true },
        { name: 'Borophene Signature (Multi-Layer + Trim)', price: 46000, durationHours: 36, featuresJson: JSON.stringify(['3 Layers Borophene Matrix', 'Engine Bay Detail & Coating', 'Exterior Plastic Rejuvenation & Coating', 'Interior Leather/Fabric Sealant', '5-Year Studio Warranty']), warrantyMonths: 60, isPopular: false },
      ]
    },
    {
      slug: 'ceramic-coating',
      categoryId: catMap['car-protection'],
      name: 'Ceramic Coating',
      vehicleType: 'CAR',
      headline: 'Certified 9H Quartz Nanotechnology For Deep Mirror Gloss and Effortless Maintenance',
      description: 'Pure liquid SiO2 silicon dioxide formula that bonds molecularly into the microscopic pores of your vehicle’s clear coat, hardening into a permanent sacrificial glass shield with hydrophobic water repellency.',
      coverImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Deep wet-look reflection and amplified color saturation',
        'High-density hydrophobic beading that sheets off road muck and rainwater effortlessly',
        'Protection against oxidation, tree sap, road grime, and UV degradation',
        'Reduces washing effort by over 70%'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Chemical & Mechanical Decon', description: 'Citrus degrease, high-pressure rinse, iron removal, and ultra-fine clay glide.' },
        { step: 2, title: 'Rotary & Dual Action Polish', description: 'Eliminating micro-scratches, swirl marks, buffer trails, and hazing.' },
        { step: 3, title: 'Ceramic 9H Layering', description: 'Applying base structural coating and hydrophobic gloss top coat.' },
        { step: 4, title: 'Infrared Bake', description: 'Controlled baking to lock in crystal clarity.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Hatchbacks', 'Sedans', 'SUVs', 'Vintage Classics']),
      defaultDurationHours: 18,
      startingPrice: 18000,
      warrantyInfo: 'Studio verified warranty with annual maintenance schedule.',
      isFeatured: true,
      sortOrder: 3,
      packages: [
        { name: 'Ceramic Pro 9H (3-Year)', price: 18000, durationHours: 18, featuresJson: JSON.stringify(['9H Ceramic Nano Base', 'Hydrophobic Gloss Topcoat', 'Front Windshield Coating', 'Wheel Faces Treated', '3-Year Warranty']), warrantyMonths: 36, isPopular: true },
        { name: 'Ceramic Ultimate 9H (5-Year)', price: 26000, durationHours: 24, featuresJson: JSON.stringify(['Double 9H Base Layer', 'Full Glass Hydrophobic Treatment', 'Wheel Barrels & Calipers', 'Plastics & Trim Coating', '5-Year Warranty']), warrantyMonths: 60, isPopular: false },
      ]
    },
    {
      slug: 'graphene-coating',
      categoryId: catMap['car-protection'],
      name: 'Graphene Coating',
      vehicleType: 'CAR',
      headline: 'Reduced Water Spotting & Superior Anti-Static Dust Repellency with Reduced Surface Heat',
      description: 'Infused with carbon graphene nanoplatelets that dramatically lower the clear coat’s surface temperature, actively repelling dust through anti-static electrical conduction and virtually eliminating water etching in tropical climates.',
      coverImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Anti-static properties that significantly lower dust buildup between washes',
        'Reduced surface heat absorption preventing stubborn mineral water spotting',
        'Enhanced honeycomb chemical bond for prolonged durability in harsh weather',
        'Ultra slick tactile feel and glass-like clarity'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Precision Decontamination', description: 'Three-stage wash and clay purification.' },
        { step: 2, title: 'Optical Correction', description: 'Paint levelling and gloss enhancement.' },
        { step: 3, title: 'Graphene Infusion', description: 'Layered cross-linking application across all body panels.' },
        { step: 4, title: 'IR Thermal Stabilization', description: 'Stabilized baking for resilient polymer formation.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['All passenger cars and premium vehicles']),
      defaultDurationHours: 20,
      startingPrice: 24000,
      warrantyInfo: '3 to 5 Year Protection packages available.',
      isFeatured: false,
      sortOrder: 4,
      packages: [
        { name: 'Graphene Matrix (3-Year)', price: 24000, durationHours: 20, featuresJson: JSON.stringify(['Graphene Reduced Oxide Coat', 'Anti-Static Dust Shield', 'All Exterior Glass Treated', '3-Year Studio Warranty']), warrantyMonths: 36, isPopular: true },
        { name: 'Graphene Pro Matrix (5-Year)', price: 34000, durationHours: 28, featuresJson: JSON.stringify(['Twin Layer Graphene Nanoplatelet', 'Trim & Chrome Protection', 'Wheel Face & Caliper Shield', '5-Year Studio Warranty']), warrantyMonths: 60, isPopular: false },
      ]
    },
    {
      slug: 'sunfilm-installation',
      categoryId: catMap['car-protection'],
      name: 'Sunfilm Installation',
      vehicleType: 'CAR',
      headline: 'High Heat Rejection Ceramic Window Tinting & UV Shielding for Tropical Climates',
      description: 'Nano-ceramic multi-ply window solar films engineered to block up to 99% of harmful ultraviolet radiation and up to 90% of infrared solar heat, keeping cabin temperatures comfortably cool while preserving visibility.',
      coverImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Rejects up to 90% of infrared solar thermal energy to reduce AC strain',
        'Blocks 99% of cancer-causing UVA/UVB rays preventing interior leather crack and dashboard fade',
        'Non-metallized nano-ceramic composition: zero interference with mobile, GPS, or FASTag signals',
        'Glare reduction for safer night and sunny highway driving'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Glass Inspection & Scrub', description: 'Razor-edge glass decontamination and surgical lint-free wipe down.' },
        { step: 2, title: 'Exterior Heat Shrinking', description: 'Hand-forming the film curvature to match compound glass contours perfectly without stress marks.' },
        { step: 3, title: 'Interior Dust-Free Slip Fit', description: 'Filtered water slip application and high-pressure card squeegee extraction.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Hatchbacks, Sedans, SUVs, MPVs']),
      defaultDurationHours: 6,
      startingPrice: 9500,
      warrantyInfo: '5-year bubbling and peel-off warranty.',
      isFeatured: false,
      sortOrder: 5,
      packages: [
        { name: 'Ceramic Solar Guard (Sides & Rear)', price: 9500, durationHours: 6, featuresJson: JSON.stringify(['Nano-Ceramic 70% IR Rejection', 'Sides & Rear Windshield', '99% UV Cut', '5-Year Warranty']), warrantyMonths: 60, isPopular: false },
        { name: 'Complete 360 Heat Shield (Full Glass)', price: 16500, durationHours: 8, featuresJson: JSON.stringify(['Premium High IR Rejection Film', 'Front Windshield (High Clarity IR Cut)', 'Sides, Rear, & Sunroof', '99% UV Cut', '5-Year Warranty']), warrantyMonths: 60, isPopular: true },
      ]
    },

    // Car Detailing and Restoration
    {
      slug: 'paint-correction-and-polishing',
      categoryId: catMap['car-detailing-restoration'],
      name: 'Paint Correction & Polishing',
      vehicleType: 'CAR',
      headline: 'Restoring True Optical Depth by Eradicating Swirls, Scratches & Acid Etching',
      description: 'The cornerstone of real detailing. Using microscopic abrasive compounds, rotary and random orbital dual-action machines with tailored foam and wool pads, our master detailers level out defects to reveal flawless optical depth.',
      coverImage: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Permanent removal of 85% to 95%+ of swirl marks, light scratches, oxidation, and buffer trails',
        'Elimination of water etching, bird dropping stains, and dull haze',
        'Pristine optical clarity and razor-sharp reflection without filling waxes',
        'Essential pre-requisite for ceramic or borophene coating longevity'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Surface Gauge Diagnostics', description: 'Measuring microns of clear coat across each panel to gauge safe cutting tolerance.' },
        { step: 2, title: 'Heavy Compound Cut', description: 'Rotary leveling of deep scratches and severe defects using diminished abrasive formulas.' },
        { step: 3, title: 'Medium Refinement', description: 'Dual-action machine polishing to eliminate micro-marring and restore deep gloss.' },
        { step: 4, title: 'Jeweler Finish Polish', description: 'Ultra-fine finishing pad on high-frequency orbital machine for crystal reflection.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['All cars with dull, scratched, or swirled paintwork']),
      defaultDurationHours: 12,
      startingPrice: 8500,
      warrantyInfo: 'Guaranteed defect removal results confirmed under LED color-match inspection lights.',
      isFeatured: true,
      sortOrder: 1,
      packages: [
        { name: 'Single Stage Gloss Enhancement', price: 8500, durationHours: 8, featuresJson: JSON.stringify(['Light swirl removal (60-70%)', 'High gloss refinement', 'Polymer sealant finish', 'Complete exterior decontamination']), warrantyMonths: null, isPopular: false },
        { name: 'Multi-Stage Surgical Paint Correction', price: 14500, durationHours: 14, featuresJson: JSON.stringify(['Heavy defect removal (85-95%)', 'Rotary cut & dual-action finish', 'Panel wipe inspection', 'Paint thickness audit']), warrantyMonths: null, isPopular: true },
      ]
    },
    {
      slug: 'interior-detailing',
      categoryId: catMap['car-detailing-restoration'],
      name: 'Deep Interior Detailing',
      vehicleType: 'CAR',
      headline: 'Hospital-Grade Steam Sanitation, Leather Conditioning & Odor Eradication',
      description: 'A transformative deep clean for your cabin. We dismantle and extract stubborn stains, deep-steam vents and upholstery at 140°C to eliminate bacteria, condition genuine leathers with pH-neutral balms, and restore factory tactile matte feel.',
      coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'High-temperature dry steam kills 99.9% of bacteria, mold spores, and allergens in AC vents and fabrics',
        'Deep hot-water carpet and upholstery shampoo extraction',
        'pH-neutral leather cleaning and matte conditioning without greasy residues',
        'Dashboard and trim UV barrier protection against sun cracking'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Blowout & Vacuum', description: 'High-velocity air blow in crevices, seat rails, and boot carpet vacuuming.' },
        { step: 2, title: 'Steam & Foam Scrub', description: 'Enzyme-based foam agitation and 140°C dry vapor steam on all textiles and vents.' },
        { step: 3, title: 'Extraction & Drying', description: 'Commercial extraction machine pulling deep-seated dirt from seats and floor mats.' },
        { step: 4, title: 'Leather & Trim Nourishment', description: 'Matte-finish sealant applied to prevent premature sun fading and cracking.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['All Hatchbacks, Sedans, SUVs, and Vintage vehicles']),
      defaultDurationHours: 6,
      startingPrice: 4500,
      warrantyInfo: '100% hygienic fresh cabin guarantee.',
      isFeatured: false,
      sortOrder: 2,
      packages: [
        { name: 'Executive Interior Spa', price: 4500, durationHours: 6, featuresJson: JSON.stringify(['Complete seat & carpet shampoo', 'Steam sterilization of AC vents', 'Dashboard UV treatment', 'Odor neutralizer']), warrantyMonths: null, isPopular: true },
      ]
    },
    {
      slug: 'car-painting-and-restoration',
      categoryId: catMap['car-detailing-restoration'],
      name: 'Car Painting & Restoration',
      vehicleType: 'CAR',
      headline: 'Down-Draft Spray Booth Refinishing, OEM Color Matching & Dent Repair',
      description: 'Specialized vehicle bodywork restoration in our dedicated dust-free paint booth. From precision panel touch-ups to complete bare-metal transformations using premium European base coats and ultra-high solid (UHS) clear coats.',
      coverImage: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Computerized spectrophotometer color matching for seamless blend with OEM paint',
        'Dust-free temperature-controlled spray booth ensuring zero contamination orange-peel finish',
        'Premium high-solid clear coat with superior resistance to weather and scratches',
        'Complete dent pull, corrosion treatment, and panel alignment'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Panel Preparation & Dent Pull', description: 'Paintless or stud-welder dent removal followed by metal sanding and anti-rust epoxy priming.' },
        { step: 2, title: 'Surface Guide Coat & Sanding', description: 'Guide-coat dry blocking to achieve millimeter-perfect curvature.' },
        { step: 3, title: 'Basecoat & Clearcoat Application', description: 'Applying computerized color pigments followed by twin coats of UHS clear in positive-pressure booth.' },
        { step: 4, title: 'Oven Bake & Color Sanding', description: 'Baking at 60°C and wet-sanding with 3000-grit for flawless mirror surface.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Accident repair, panel respray, and full body restoration']),
      defaultDurationHours: 72,
      startingPrice: 3500,
      warrantyInfo: 'Up to 3-year paint peel and color fade guarantee.',
      isFeatured: false,
      sortOrder: 3,
      packages: [
        { name: 'Per Panel Refinish (Bumper/Door/Fender)', price: 3500, durationHours: 24, featuresJson: JSON.stringify(['Dent repair', 'Computerized color match', 'Down-draft booth spray', 'Clear coat buff & polish']), warrantyMonths: 24, isPopular: false },
        { name: 'Full Body Respray & Restoration', price: 48000, durationHours: 120, featuresJson: JSON.stringify(['Complete exterior respray', 'Corrosion treatment', 'High-solid clear coat', 'Multi-stage wet sand & mirror cut']), warrantyMonths: 36, isPopular: true },
      ]
    },

    // Bike Services
    {
      slug: 'bike-ceramic-coating',
      categoryId: catMap['bike-services'],
      name: 'Bike Ceramic Coating',
      vehicleType: 'BIKE',
      headline: 'High-Heat 9H Ceramic Shield for Fuel Tanks, Fairings, Engine Fins & Chrome',
      description: 'Engineered specifically for two-wheelers, our bike ceramic formulation withstands temperatures up to 800°C on exhaust pipes and engine casings while providing unmatched hydrophobic protection on tank, cowl, and fenders.',
      coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Withstands engine block & exhaust heat up to 800°C without discoloring',
        'Shields fuel tank from zipper scratches, belt buckle scuffs, and fuel drop etching',
        'Deep candy gloss on fuel tank, fairings, and helmet visor',
        'Dramatically reduces road grime and chain oil stickiness'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Degrease & Engine Clean', description: 'Targeted chain degreasing, engine fin chemical bath, and steam decontamination.' },
        { step: 2, title: 'Tank & Fairing Polishing', description: 'Dual-action mini-polisher correction on fuel tank, cowl, and side panels.' },
        { step: 3, title: '9H Bike Ceramic Application', description: 'Applying temperature-stable ceramic coat to engine, exhaust, wheels, and paintwork.' },
        { step: 4, title: 'IR Lamp Baking', description: 'Stationary infrared curing for high hardness.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Superbikes, Cruisers, Touring, Streetfighters, Commuters']),
      defaultDurationHours: 8,
      startingPrice: 5500,
      warrantyInfo: 'Up to 2-year studio warranty with scheduled inspections.',
      isFeatured: true,
      sortOrder: 1,
      packages: [
        { name: 'Street & Commuter Ceramic (1-Year)', price: 5500, durationHours: 6, featuresJson: JSON.stringify(['Tank & Panel 9H Ceramic', 'Engine Polish & Coat', 'Alloy Wheel Protection', '1-Year Warranty']), warrantyMonths: 12, isPopular: false },
        { name: 'Superbike & Cruiser 9H Shield (2-Year)', price: 9500, durationHours: 10, featuresJson: JSON.stringify(['Multi-layer Tank Ceramic', 'Exhaust & Heat Resistant Casing Coat', 'Alloys & Swingarm', 'Helmet Visor Ceramic Treatment', '2-Year Warranty']), warrantyMonths: 24, isPopular: true },
      ]
    },
    {
      slug: 'bike-paint-protection-ppf',
      categoryId: catMap['bike-services'],
      name: 'Bike Paint Protection Film (PPF)',
      vehicleType: 'BIKE',
      headline: 'Custom-Wrapped TPU Tank, Fairing & Screen Protection from Scratches',
      description: 'Motorcycle paint is exceptionally vulnerable to jacket zippers, tank bag abrasions, knee friction, and flying gravel. Our custom-patterned TPU PPF provides an invisible self-healing barrier over the fuel tank and high-impact panels.',
      coverImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Full fuel tank coverage against knee wear, jacket zips, and fuel droplets',
        'Self-healing technology restores micro-scratches with engine or solar warmth',
        'TFT instrument console protection from scratches and sun hazing',
        'Available in ultra-gloss and stealth matte finishes'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Micro Decontamination', description: 'Gentle paint preparation and solvent wipe of tank edges.' },
        { step: 2, title: 'Custom Tension Wrap', description: 'Skillful wet-application around complex bike tank curves and indentations.' },
        { step: 3, title: 'Heat Edge Lock', description: 'Micro-torch / heat gun bonding to prevent edge lifting during high-speed wind.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['All motorcycle models']),
      defaultDurationHours: 10,
      startingPrice: 4000,
      warrantyInfo: '5-year manufacturer film warranty.',
      isFeatured: true,
      sortOrder: 2,
      packages: [
        { name: 'Tank & Console Essential Pack', price: 4000, durationHours: 6, featuresJson: JSON.stringify(['Full Fuel Tank TPU Wrap', 'TFT Instrument Screen Guard', 'Headlight Lens Protection']), warrantyMonths: 60, isPopular: true },
        { name: 'Complete Superbike Armor Pack', price: 14000, durationHours: 16, featuresJson: JSON.stringify(['Full Tank Wrap', 'Front Cowl & Fairings', 'Front Mudguard', 'Tail Section & Screen Guard']), warrantyMonths: 60, isPopular: false },
      ]
    },
    {
      slug: 'bike-detailing-and-restoration',
      categoryId: catMap['bike-services'],
      name: 'Bike Detailing & Painting',
      vehicleType: 'BIKE',
      headline: 'Nut-and-Bolt Cleaning, Chrome Restoration, Engine Polishing & Custom Painting',
      description: 'Complete overhaul detailing for motorcycles. We deep-clean spokes, calipers, chain drive, clean and polish oxidized exhaust pipes, remove rust from chrome, and offer bespoke custom tank respraying.',
      coverImage: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=1200&q=85',
      benefitsJson: JSON.stringify([
        'Restores weathered chrome, spokes, and alloy rims to showroom brilliance',
        'Chemical rust passivation and exhaust pipe heat bluing polish',
        'Bespoke custom painting, candy colors, and precision decal application',
        'Chain clean, ultrasonic soak, and high-performance lubrication'
      ]),
      applicationProcessJson: JSON.stringify([
        { step: 1, title: 'Teardown & Wash', description: 'Careful removal of seat and side covers for direct engine and chassis access.' },
        { step: 2, title: 'Metal & Chrome Buffing', description: 'Compound polishing of oxidized aluminum and exhaust headers.' },
        { step: 3, title: 'Paint Gloss Cut', description: 'Single or two-stage machine polish on painted tins.' },
        { step: 4, title: 'Protective Polymer Seal', description: 'Anti-corrosion spray applied to all electrical and exposed fasteners.' }
      ]),
      suitableVehiclesJson: JSON.stringify(['Royal Enfield, Harley-Davidson, Triumphs, Vintage & Modern Motorcycles']),
      defaultDurationHours: 12,
      startingPrice: 3000,
      warrantyInfo: 'Verified craftsmanship guarantee.',
      isFeatured: false,
      sortOrder: 3,
      packages: [
        { name: 'Full Classic / Cruiser Spa', price: 3000, durationHours: 8, featuresJson: JSON.stringify(['Spoke & rim polishing', 'Exhaust stain removal', 'Tank buff & wax', 'Chain deep-clean & lube']), warrantyMonths: null, isPopular: true },
        { name: 'Custom Tank & Helmet Respray', price: 9000, durationHours: 36, featuresJson: JSON.stringify(['Bare metal prep', 'Custom 3-coat metallic/candy paint', 'UHS clear coat', 'Matching helmet graphic']), warrantyMonths: 24, isPopular: false },
      ]
    }
  ];

  for (const s of servicesData) {
    const { packages, ...serviceFields } = s;
    const serviceRecord = await prisma.service.upsert({
      where: { slug: s.slug },
      update: serviceFields,
      create: serviceFields,
    });

    if (packages && packages.length > 0) {
      for (const [idx, pkg] of packages.entries()) {
        await prisma.servicePackage.create({
          data: {
            serviceId: serviceRecord.id,
            name: pkg.name,
            price: pkg.price,
            durationHours: pkg.durationHours,
            featuresJson: pkg.featuresJson,
            warrantyMonths: pkg.warrantyMonths,
            isPopular: pkg.isPopular,
            sortOrder: idx + 1,
          },
        });
      }
    }
  }

  console.log('Seeded services and packages successfully.');

  // 5. Completed Projects for Gallery with Real Automotive Photography and Before/After Images
  const projectsData = [
    {
      slug: 'porsche-911-carrera-borophene-coating',
      categoryId: catMap['car-protection'],
      title: 'Porsche 911 Carrera GTS – Dual Layer Borophene 10H & Paint Correction',
      vehicleType: 'CAR',
      vehicleBrand: 'Porsche',
      vehicleModel: '911 Carrera GTS (Guards Red)',
      clientName: 'Rahul M.',
      description: 'The owner brought in this Guards Red 911 with moderate swirl marks and clear coat hazing from improper washing techniques. We performed a 2-stage precision paint correction using Rupes Bigfoot polishers, restoring 98% clarity before infusing twin layers of Borophene coating for permanent mirror reflections and hyper-hydrophobic protection.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-09-15'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85', caption: 'Deep wet gloss reflection under inspection LEDs' },
        { imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', caption: 'Interior leather sanitation and UV ceramic shield' },
      ]
    },
    {
      slug: 'bmw-m3-competition-full-body-ppf',
      categoryId: catMap['car-protection'],
      title: 'BMW M3 Competition – Full Body TPU Self-Healing Armor',
      vehicleType: 'CAR',
      vehicleBrand: 'BMW',
      vehicleModel: 'M3 Competition (Isle of Man Green)',
      clientName: 'Dr. Anand K.',
      description: 'Brand-new delivery straight from the showroom to Mister Ceramic workshop. We installed full-body self-healing Thermoplastic Polyurethane (TPU) film with custom wrapped edges around every panel, carbon fiber roof, and aggressive M front bumper aero channels.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-10-02'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85', caption: 'Edge-wrapped TPU film with invisible transitions' },
        { imageUrl: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=85', caption: 'Flawless Isle of Man Green hue preservation' },
      ]
    },
    {
      slug: 'mercedes-benz-e-class-ceramic-coating',
      categoryId: catMap['car-protection'],
      title: 'Mercedes-Benz E-Class – 9H Ceramic Quartz Multi-Layer Shield',
      vehicleType: 'CAR',
      vehicleBrand: 'Mercedes-Benz',
      vehicleModel: 'E 350d (Obsidian Black)',
      clientName: 'Vipin Chandran',
      description: 'Obsidian Black paint requires surgical precision to polish without leaving buffer swirls. We conducted full multi-stage corrective leveling, followed by certified 9H Quartz Ceramic coating, glass water repellent coating, and alloy wheel barrel sealants.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-10-18'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85', caption: 'Obsidian Black deep mirror shine' }
      ]
    },
    {
      slug: 'ducati-panigale-v4s-ceramic-and-ppf',
      categoryId: catMap['bike-services'],
      title: 'Ducati Panigale V4 S – High-Heat Ceramic & Custom Tank PPF',
      vehicleType: 'BIKE',
      vehicleBrand: 'Ducati',
      vehicleModel: 'Panigale V4 S (Ducati Red)',
      clientName: 'Sanjay Nair',
      description: 'Treated this Italian track weapon to complete bespoke protection. We wrapped the sculpted fuel tank and carbon front mudguard in self-healing TPU PPF, while treating the exposed engine headers and titanium Akrapovic exhaust with 800°C heat-resistant ceramic coating.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-10-25'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85', caption: 'High heat titanium ceramic coating on exhaust and engine block' }
      ]
    },
    {
      slug: 'royal-enfield-continental-gt-restoration',
      categoryId: catMap['bike-services'],
      title: 'Royal Enfield Continental GT 650 – Chrome Restoration & Custom Clear',
      vehicleType: 'BIKE',
      vehicleBrand: 'Royal Enfield',
      vehicleModel: 'Continental GT 650 (Mister Clean Chrome)',
      clientName: 'Arjun Das',
      description: 'The chrome tank had developed oxidation stains and micro scratches. We undertook chemical restoration, ultrasonic spoke cleansing, manifold heat stain polish, and sealed the chrome surface with anti-corrosion quartz coat.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isPublished: true,
      completedAt: new Date('2026-10-30'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85', caption: 'Mirror chrome finish sealed against Kerala humidity' }
      ]
    },
    {
      slug: 'range-rover-defender-paint-correction-graphene',
      categoryId: catMap['car-detailing-restoration'],
      title: 'Land Rover Defender 110 – Heavy Decontamination & Graphene Shield',
      vehicleType: 'CAR',
      vehicleBrand: 'Land Rover',
      vehicleModel: 'Defender 110 P400 (Santorini Black)',
      clientName: 'Kurian Thomas',
      description: 'Following an off-road expedition in Wayanad, this Defender arrived with heavy trail scratches and clay staining. Complete citrus decontamination, 2-stage rotary leveling, and 5-year Graphene Matrix coating restored it to museum delivery condition.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1000&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isPublished: true,
      completedAt: new Date('2026-11-01'),
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85', caption: 'Anti-static graphene matrix repels trail dust and road grime' }
      ]
    }
  ];

  for (const proj of projectsData) {
    const { images, ...projFields } = proj;
    const projectRecord = await prisma.project.upsert({
      where: { slug: proj.slug },
      update: projFields,
      create: projFields,
    });

    if (images && images.length > 0) {
      for (const [idx, img] of images.entries()) {
        await prisma.projectImage.create({
          data: {
            projectId: projectRecord.id,
            imageUrl: img.imageUrl,
            caption: img.caption,
            sortOrder: idx + 1,
          },
        });
      }
    }
  }

  console.log('Seeded projects and gallery images.');

  // 6. Testimonials from verified clients
  const testimonials = [
    {
      customerName: 'Dr. Anand K.',
      vehicleInfo: 'BMW M3 Competition (Isle of Man Green)',
      serviceName: 'Full Body Self-Healing TPU PPF',
      rating: 5,
      reviewText: 'Mister Ceramic sets a new benchmark in Kerala for detailing. The edge wrapping on my M3 is virtually invisible, and the studio cleanroom in Kottarakkara is world-class. Worth every single rupee.',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isPublished: true,
    },
    {
      customerName: 'Rahul M.',
      vehicleInfo: 'Porsche 911 Carrera GTS',
      serviceName: 'Dual Layer Borophene 10H & Paint Correction',
      rating: 5,
      reviewText: 'The team removed swirl marks that previous workshops said were permanent. The candy gloss depth of the Borophene coating on my Guards Red 911 is breathtaking. Highly recommended!',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isPublished: true,
    },
    {
      customerName: 'Sanjay Nair',
      vehicleInfo: 'Ducati Panigale V4 S',
      serviceName: 'Bike Ceramic Coating & Tank PPF',
      rating: 5,
      reviewText: 'Finding someone who understands superbike detailing in Kollam was tough until I visited Mister Ceramic. Their attention to detail on the titanium exhaust headers and fuel tank is flawless.',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isPublished: true,
    },
    {
      customerName: 'Vipin Chandran',
      vehicleInfo: 'Mercedes-Benz E 350d',
      serviceName: 'Ceramic Pro 9H Coating',
      rating: 5,
      reviewText: 'Black paint is notoriously hard to maintain in Kerala weather, but the hydrophobic sheeting after the 9H coating has made washing effortless. Top notch service and professional staff.',
      customerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isPublished: true,
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  // 7. Seed a Real Live Booking & Customer Tracking Record for Live Demo & Verification
  const sampleCustomer = await prisma.customer.upsert({
    where: { phone: '+919207209105' },
    update: {},
    create: {
      name: 'Mathews George',
      phone: '+919207209105',
      email: 'mathews@example.com',
      notes: 'Prefers updates via WhatsApp. High attention to bonnet swirl marks.',
    },
  });

  const sampleVehicle = await prisma.vehicle.create({
    data: {
      customerId: sampleCustomer.id,
      type: 'CAR',
      brand: 'BMW',
      model: 'M3 Competition',
      registrationNumber: 'KL-24-S-0007',
      color: 'Isle of Man Green Metallic',
    },
  });

  const ppfService = await prisma.service.findFirst({
    where: { slug: 'paint-protection-film-ppf' },
  });

  const sampleBooking = await prisma.booking.create({
    data: {
      reference: 'MC-202611-0101',
      customerId: sampleCustomer.id,
      vehicleId: sampleVehicle.id,
      serviceId: ppfService.id,
      preferredDate: '2026-11-08',
      preferredTime: '10:00 AM',
      status: 'Service in Progress',
      totalEstimatedPrice: 95000,
      estimatedDeliveryDate: '2026-11-10',
      customerNotes: 'Please ensure full wrap on the carbon front splitter and door edges.',
      adminNotes: 'Assigned to Lead Detailer Sunil. Vehicle received in pristine condition. Clear coat thickness logged at 135 microns.',
    },
  });

  // Booking status history
  const statusHistoryEntries = [
    { status: 'Booking Received', note: 'Booking submitted online by customer.', createdAt: new Date('2026-11-06T09:00:00Z') },
    { status: 'Booking Confirmed', note: 'Appointment confirmed with customer via telephone. Intake bay 1 reserved.', createdAt: new Date('2026-11-06T10:30:00Z') },
    { status: 'Vehicle Received', note: 'Vehicle arrived at Kottarakkara studio. Keys and checklist handed over.', createdAt: new Date('2026-11-06T11:00:00Z') },
    { status: 'Initial Inspection', note: 'Digital paint depth gauge reading completed across 28 points. Minor micro-marring noted on left rear fender.', createdAt: new Date('2026-11-06T11:45:00Z') },
    { status: 'Service in Progress', note: 'Precision TPU application underway in cleanroom bay. Bonnet and front fenders wrapped.', createdAt: new Date('2026-11-06T14:00:00Z') },
  ];

  for (const entry of statusHistoryEntries) {
    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: sampleBooking.id,
        status: entry.status,
        note: entry.note,
        changedByUserId: adminUser.id,
        createdAt: entry.createdAt,
      },
    });
  }

  // Progress updates with photos
  const progressUpdates = [
    {
      stage: 'Initial Inspection & Decontamination',
      title: 'Snow Foam Wash & Chemical Iron Fallout Dissolution',
      description: 'Vehicle subjected to multi-stage citrus pre-wash, two-bucket hand wash, and iron decontamination to eliminate road salts and rail dust.',
      photosJson: JSON.stringify([
        'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      ]),
      isVisibleToCustomer: true,
      createdAt: new Date('2026-11-06T11:30:00Z'),
    },
    {
      stage: 'Paint Correction & Prep',
      title: 'Precision Dual-Action Panel Polish & Isopropyl Alcohol Wipe',
      description: 'Light compounding executed to ensure optical clarity under clear coat before laying down the TPU adhesive.',
      photosJson: JSON.stringify([
        'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
      ]),
      isVisibleToCustomer: true,
      createdAt: new Date('2026-11-06T13:00:00Z'),
    },
    {
      stage: 'Film Application',
      title: 'Self-Healing TPU Film Installation in Cleanroom Bay',
      description: 'Custom edge-tucked installation on bonnet and wings using precision slip formula. Zero edge lift guarantee.',
      photosJson: JSON.stringify([
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      ]),
      isVisibleToCustomer: true,
      createdAt: new Date('2026-11-06T14:30:00Z'),
    },
  ];

  for (const pu of progressUpdates) {
    await prisma.serviceProgressUpdate.create({
      data: {
        bookingId: sampleBooking.id,
        stage: pu.stage,
        title: pu.title,
        description: pu.description,
        photosJson: pu.photosJson,
        isVisibleToCustomer: pu.isVisibleToCustomer,
        createdAt: pu.createdAt,
      },
    });
  }

  console.log('Seeded sample live tracking booking MC-202611-0101');
  console.log('Mister Ceramic database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
