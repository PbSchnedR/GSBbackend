require('dotenv').config();
const mongoose = require('mongoose');
const sha256 = require('js-sha256');
const User = require('./models/user_model');
const Bill = require('./models/bill_model');

const HASH_SALT = process.env.HASH_SALT;

async function seed() {
  try {
    await mongoose.connect(process.env.URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Vider la DB
    await User.deleteMany({});
    await Bill.deleteMany({});
    console.log('🗑️  Base de données vidée');

    // 2. Créer les utilisateurs (password hashed manually to bypass pre-save hook issues)
    const admin = await User.collection.insertOne({
      name: 'Jean Admin',
      email: 'jean@admin.com',
      password: sha256('password' + HASH_SALT),
      role: 'admin',
      createdAt: new Date(),
      attachments: []
    });

    const user = await User.collection.insertOne({
      name: 'Jean Doe',
      email: 'jean@doe.com',
      password: sha256('password' + HASH_SALT),
      role: 'user',
      createdAt: new Date(),
      attachments: []
    });

    const user2 = await User.collection.insertOne({
      name: 'Admin GSB',
      email: 'admin@gsb.fr',
      password: sha256('admin123' + HASH_SALT),
      role: 'admin',
      createdAt: new Date(),
      attachments: []
    });

    const user3 = await User.collection.insertOne({
      name: 'Utilisateur GSB',
      email: 'user@gsb.fr',
      password: sha256('user123' + HASH_SALT),
      role: 'user',
      createdAt: new Date(),
      attachments: []
    });

    console.log('👤 Utilisateurs créés:');
    console.log('   - jean@admin.com / password (admin)');
    console.log('   - jean@doe.com / password (user)');
    console.log('   - admin@gsb.fr / admin123 (admin)');
    console.log('   - user@gsb.fr / user123 (user)');

    // 3. Créer des bills d'exemple
    const bills = [
      {
        date: '2024-01-15',
        amount: 45.50,
        proof: 'https://example.com/proof1.jpg',
        description: 'Déjeuner client - Restaurant Le Bistrot',
        status: 'Validée',
        user: user.insertedId,
        type: 'Repas',
        createdAt: new Date('2024-01-15')
      },
      {
        date: '2024-02-03',
        amount: 120.00,
        proof: 'https://example.com/proof2.jpg',
        description: 'Train Paris-Lyon',
        status: 'En attente',
        user: user.insertedId,
        type: 'Transport',
        createdAt: new Date('2024-02-03')
      },
      {
        date: '2024-02-10',
        amount: 89.90,
        proof: 'https://example.com/proof3.jpg',
        description: 'Hôtel Ibis - Conférence annuelle',
        status: 'Refusée',
        user: user.insertedId,
        type: 'Hébergement',
        createdAt: new Date('2024-02-10')
      },
      {
        date: '2024-03-01',
        amount: 25.00,
        proof: 'https://example.com/proof4.jpg',
        description: 'Fournitures de bureau',
        status: 'En attente',
        user: user3.insertedId,
        type: 'Autre',
        createdAt: new Date('2024-03-01')
      },
      {
        date: '2024-03-15',
        amount: 67.30,
        proof: 'https://example.com/proof5.jpg',
        description: 'Repas équipe commerciale',
        status: 'Validée',
        user: user3.insertedId,
        type: 'Repas',
        createdAt: new Date('2024-03-15')
      }
    ];

    await Bill.insertMany(bills);
    console.log(`📄 ${bills.length} notes de frais créées`);

    console.log('\n✅ Seeding terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error.message);
    process.exit(1);
  }
}

seed();
