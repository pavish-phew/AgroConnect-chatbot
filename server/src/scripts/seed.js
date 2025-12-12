const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  {
    name: 'Organic Wheat Seeds - Premium Quality',
    description: 'High-yield organic wheat seeds suitable for all seasons. Guaranteed 95% germination rate.',
    price: 450,
    stock: 500,
    category: 'Seeds',
    brand: 'AgroSeed Pro',
    images: ['https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500'],
    specifications: { 'Germination Rate': '95%', 'Purity': '99%', 'Moisture': '<12%' },
  },
  {
    name: 'NPK 19:19:19 Fertilizer - 50kg Bag',
    description: 'Balanced NPK fertilizer perfect for all crops. Essential nutrients for healthy plant growth.',
    price: 1200,
    stock: 200,
    category: 'Fertilizers',
    brand: 'GreenGrow',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'NPK Ratio': '19:19:19', 'Weight': '50kg', 'Type': 'Granular' },
  },
  {
    name: 'Drip Irrigation System Kit - 100m',
    description: 'Complete drip irrigation kit with pipes, emitters, and connectors. Water-efficient solution.',
    price: 3500,
    stock: 50,
    category: 'Irrigation',
    brand: 'AquaFlow',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'Length': '100m', 'Emitter Spacing': '30cm', 'Flow Rate': '2L/hr' },
  },
  {
    name: 'Tomato Seeds - Hybrid F1',
    description: 'Premium hybrid tomato seeds. Disease-resistant and high-yielding variety.',
    price: 250,
    stock: 300,
    category: 'Seeds',
    brand: 'VeggieMax',
    images: ['https://images.unsplash.com/photo-1546470427-e26264be0a93?w=500'],
    specifications: { 'Variety': 'Hybrid F1', 'Germination': '90%', 'Maturity': '75-80 days' },
  },
  {
    name: 'Organic Compost - 25kg Bag',
    description: 'Rich organic compost made from farm waste. Improves soil fertility naturally.',
    price: 350,
    stock: 150,
    category: 'Fertilizers',
    brand: 'EcoCompost',
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500'],
    specifications: { 'Weight': '25kg', 'Organic Matter': '>40%', 'Moisture': '<30%' },
  },
  {
    name: 'Farm Tractor - 45 HP',
    description: 'Robust 45 HP tractor for medium-scale farming. Fuel-efficient and reliable.',
    price: 650000,
    stock: 5,
    category: 'Machinery',
    brand: 'FarmPro',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'HP': '45', 'Fuel Type': 'Diesel', 'Warranty': '2 Years' },
  },
  {
    name: 'Corn Seeds - Sweet Corn Variety',
    description: 'Premium sweet corn seeds. High sugar content and excellent taste.',
    price: 380,
    stock: 400,
    category: 'Seeds',
    brand: 'CornMaster',
    images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500'],
    specifications: { 'Variety': 'Sweet Corn', 'Germination': '92%', 'Maturity': '85-90 days' },
  },
  {
    name: 'Urea Fertilizer - 46% Nitrogen',
    description: 'High nitrogen content urea fertilizer. Fast-acting for quick plant growth.',
    price: 850,
    stock: 300,
    category: 'Fertilizers',
    brand: 'NitrogenPlus',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'Nitrogen': '46%', 'Weight': '50kg', 'Form': 'Granules' },
  },
  {
    name: 'Sprinkler System - 360° Coverage',
    description: 'Automatic sprinkler system with 360-degree coverage. Perfect for large fields.',
    price: 2800,
    stock: 75,
    category: 'Irrigation',
    brand: 'SprinklerPro',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'],
    specifications: { 'Coverage': '15m radius', 'Flow Rate': '30L/min', 'Material': 'Plastic' },
  },
  {
    name: 'Rice Seeds - Basmati Premium',
    description: 'Premium basmati rice seeds. Aromatic and long-grain variety.',
    price: 420,
    stock: 250,
    category: 'Seeds',
    brand: 'RiceElite',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'],
    specifications: { 'Variety': 'Basmati', 'Germination': '88%', 'Maturity': '120-125 days' },
  },
  {
    name: 'Potato Seeds - Disease Free',
    description: 'Certified disease-free potato seeds. High yield and good storage quality.',
    price: 520,
    stock: 180,
    category: 'Seeds',
    brand: 'PotatoPro',
    images: ['https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500'],
    specifications: { 'Certification': 'Disease Free', 'Size': 'Medium', 'Storage': 'Good' },
  },
  {
    name: 'Phosphate Fertilizer - Single Super Phosphate',
    description: 'Rich in phosphorus for root development and flowering. Essential for crop growth.',
    price: 750,
    stock: 220,
    category: 'Fertilizers',
    brand: 'PhosGrow',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'P2O5': '16%', 'Weight': '50kg', 'Type': 'Granular' },
  },
  {
    name: 'Harvester Combine - Mini',
    description: 'Mini combine harvester for small to medium farms. Efficient grain harvesting.',
    price: 850000,
    stock: 3,
    category: 'Machinery',
    brand: 'HarvestMax',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'Capacity': '2-3 acres/day', 'Fuel': 'Diesel', 'Cutting Width': '1.5m' },
  },
  {
    name: 'Onion Seeds - Red Variety',
    description: 'High-yielding red onion seeds. Excellent storage and market value.',
    price: 320,
    stock: 350,
    category: 'Seeds',
    brand: 'OnionKing',
    images: ['https://images.unsplash.com/photo-1618512496249-c1414830b6d5?w=500'],
    specifications: { 'Variety': 'Red', 'Germination': '85%', 'Maturity': '100-110 days' },
  },
  {
    name: 'Potash Fertilizer - Muriate of Potash',
    description: 'High potassium content for better fruit quality and disease resistance.',
    price: 1100,
    stock: 180,
    category: 'Fertilizers',
    brand: 'PotashPlus',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'K2O': '60%', 'Weight': '50kg', 'Color': 'Red/White' },
  },
  {
    name: 'Water Pump - Electric 2HP',
    description: 'Powerful 2HP electric water pump. Ideal for irrigation and water supply.',
    price: 12000,
    stock: 40,
    category: 'Irrigation',
    brand: 'AquaPower',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'HP': '2', 'Voltage': '220V', 'Flow': '50L/min' },
  },
  {
    name: 'Chilli Seeds - Green Hot',
    description: 'Hot green chilli seeds. Spicy and high-yielding variety.',
    price: 180,
    stock: 500,
    category: 'Seeds',
    brand: 'SpiceMax',
    images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500'],
    specifications: { 'Variety': 'Green Hot', 'Heat Level': 'Medium-Hot', 'Maturity': '70-75 days' },
  },
  {
    name: 'Bio Fertilizer - Azotobacter',
    description: 'Organic bio-fertilizer with beneficial bacteria. Improves nitrogen fixation.',
    price: 450,
    stock: 120,
    category: 'Fertilizers',
    brand: 'BioGrow',
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500'],
    specifications: { 'Type': 'Azotobacter', 'CFU': '>10^8/g', 'Weight': '1kg' },
  },
  {
    name: 'Greenhouse Polyhouse Kit - 20x10m',
    description: 'Complete greenhouse kit with frame and UV-stabilized covering. Controlled environment.',
    price: 85000,
    stock: 10,
    category: 'Infrastructure',
    brand: 'GreenHouse Pro',
    images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500'],
    specifications: { 'Size': '20x10m', 'Frame': 'GI Pipe', 'Covering': 'UV Film' },
  },
  {
    name: 'Cotton Seeds - Bt Variety',
    description: 'BT cotton seeds with pest resistance. High yield and quality fiber.',
    price: 680,
    stock: 200,
    category: 'Seeds',
    brand: 'CottonElite',
    images: ['https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500'],
    specifications: { 'Type': 'BT', 'Germination': '90%', 'Maturity': '150-160 days' },
  },
  {
    name: 'Lime Powder - Agricultural Grade',
    description: 'Agricultural lime to reduce soil acidity. Improves soil pH and nutrient availability.',
    price: 280,
    stock: 300,
    category: 'Soil Amendments',
    brand: 'LimePlus',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'CaO': '>40%', 'Weight': '50kg', 'Mesh': '100-200' },
  },
  {
    name: 'Plough - Disc Plough 9 Disc',
    description: 'Heavy-duty disc plough for soil preparation. 9-disc configuration for efficient tilling.',
    price: 45000,
    stock: 15,
    category: 'Machinery',
    brand: 'TillagePro',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'Discs': '9', 'Width': '6ft', 'Material': 'Steel' },
  },
  {
    name: 'Cucumber Seeds - Hybrid',
    description: 'Premium hybrid cucumber seeds. High yield and disease-resistant.',
    price: 220,
    stock: 400,
    category: 'Seeds',
    brand: 'VeggieMax',
    images: ['https://images.unsplash.com/photo-1604977042224-4c354c57c0a0?w=500'],
    specifications: { 'Variety': 'Hybrid', 'Germination': '88%', 'Maturity': '50-55 days' },
  },
  {
    name: 'Vermicompost - Organic 10kg',
    description: 'Premium vermicompost enriched with earthworm castings. Excellent soil conditioner.',
    price: 280,
    stock: 200,
    category: 'Fertilizers',
    brand: 'VermiGold',
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500'],
    specifications: { 'Weight': '10kg', 'Organic Matter': '>50%', 'NPK': '1.5:1:1' },
  },
  {
    name: 'Solar Water Pump - 1HP',
    description: 'Environment-friendly solar-powered water pump. No electricity needed.',
    price: 35000,
    stock: 25,
    category: 'Irrigation',
    brand: 'SolarAqua',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'HP': '1', 'Solar Panel': '500W', 'Flow': '25L/min' },
  },
  {
    name: 'Okra Seeds - Lady Finger',
    description: 'Premium lady finger okra seeds. Tender and high-yielding variety.',
    price: 190,
    stock: 450,
    category: 'Seeds',
    brand: 'OkraMax',
    images: ['https://images.unsplash.com/photo-1591798454113-023d7379221f?w=500'],
    specifications: { 'Variety': 'Lady Finger', 'Germination': '86%', 'Maturity': '45-50 days' },
  },
  {
    name: 'Seed Drill Machine - 9 Row',
    description: 'Precision seed drill for uniform planting. 9-row configuration saves time and seeds.',
    price: 65000,
    stock: 12,
    category: 'Machinery',
    brand: 'DrillMaster',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'Rows': '9', 'Row Spacing': 'Adjustable', 'Seed Hopper': '45L' },
  },
  {
    name: 'Ladies Finger Seeds - Hybrid',
    description: 'High-yielding hybrid ladies finger seeds. Perfect for commercial cultivation.',
    price: 240,
    stock: 380,
    category: 'Seeds',
    brand: 'VeggieMax',
    images: ['https://images.unsplash.com/photo-1591798454113-023d7379221f?w=500'],
    specifications: { 'Variety': 'Hybrid', 'Fruit Length': '12-15cm', 'Maturity': '50-55 days' },
  },
  {
    name: 'Gypsum - Agricultural Grade 25kg',
    description: 'Agricultural gypsum improves soil structure and provides calcium and sulfur.',
    price: 320,
    stock: 250,
    category: 'Soil Amendments',
    brand: 'GypsumPro',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
    specifications: { 'CaSO4': '>90%', 'Weight': '25kg', 'Purity': '99%' },
  },
  {
    name: 'Rotavator - 6 Blade',
    description: 'Heavy-duty rotavator for fine tilth preparation. 6-blade design for better soil mixing.',
    price: 75000,
    stock: 8,
    category: 'Machinery',
    brand: 'RotaMax',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'],
    specifications: { 'Blades': '6', 'Width': '5ft', 'Depth': 'Up to 8 inches' },
  },
  {
    name: 'Spinach Seeds - Hybrid',
    description: 'Fast-growing hybrid spinach seeds. Rich in nutrients and high yield.',
    price: 150,
    stock: 500,
    category: 'Seeds',
    brand: 'LeafyGreen',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500'],
    specifications: { 'Variety': 'Hybrid', 'Germination': '90%', 'Maturity': '25-30 days' },
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Create a default seller if not exists
    let seller = await User.findOne({ email: 'seller@agroconnect.test' });
    if (!seller) {
      seller = new User({
        name: 'Default Seller',
        email: 'seller@agroconnect.test',
        password: 'seller123',
        role: 'seller',
      });
      await seller.save();
      console.log('Default seller created');
    }

    // Clear existing products
    await Product.deleteMany({});

    // Insert products with seller ID
    const productsWithSeller = products.map(product => ({
      ...product,
      sellerId: seller._id,
    }));

    await Product.insertMany(productsWithSeller);
    console.log(`✅ Seeded ${products.length} products successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    process.exit(1);
  }
};

seedProducts();


