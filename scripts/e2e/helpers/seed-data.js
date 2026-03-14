// scripts/e2e/helpers/seed-data.js
const { createTestUser, elevateToAdmin } = require('../../supabase-utils');

async function seed() {
    console.log('[Seed] Seeding test users...');
    try {
        // Admin user
        const admin = await createTestUser('admin@example.com', 'admin123', 'Admin User');
        await elevateToAdmin(admin.user.id);
        console.log('[Seed] Admin user created and elevated.');

        // Standard user
        await createTestUser('user@example.com', 'user123', 'Standard User');
        console.log('[Seed] Standard user created.');
    } catch (err) {
        if (err.message.includes('already registered')) {
            console.log('[Seed] Users already exist, skipping.');
        } else {
            console.error('[Seed] Error during seeding:', err);
        }
    }
}

if (require.main === module) {
    seed();
}

module.exports = { seed };
