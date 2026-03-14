const utils = require('./scripts/supabase-utils');

/**
 * RUN THIS SCRIPT TO RE-VERIFY THE FULL PRODUCTION FLOW
 * 1. Creates a test user
 * 2. Elevates user to admin
 * 3. Creates a seminar
 * 4. Posts a comment
 * 5. RSVPs to the seminar
 */
async function runVerification() {
    try {
        const id = Date.now();
        const email = `verify_${id}@example.com`;
        const password = 'Password123!';

        // 1. Setup User
        const { user, session } = await utils.createTestUser(email, password, `Verifier ${id}`);
        console.log('✅ User created:', user.id);

        // Wait for profile trigger
        await new Promise(r => setTimeout(r, 1500));

        // 2. Elevate
        await utils.elevateToAdmin(user.id);
        console.log('✅ User elevated to admin');

        // 3. Create Data
        const seminar = await utils.createSeminar(`Verif Seminar ${id}`, 'Persistence verification');
        console.log('✅ Seminar created:', seminar.id);

        // 4. Test User Story 1 (Persistence)
        const supabase = await utils.getClient();

        const { data: comment, error: cErr } = await supabase
            .from('comments')
            .insert({ seminar_id: seminar.id, author_id: user.id, text: 'Persistence Check' })
            .select().single();
        if (cErr) throw cErr;
        console.log('✅ Comment persisted');

        const { data: rsvp, error: rErr } = await supabase
            .from('rsvps')
            .insert({ seminar_id: seminar.id, user_id: user.id, status: 'confirmed' })
            .select().single();
        if (rErr) throw rErr;
        console.log('✅ RSVP persisted');

        console.log('-------------------------------------------');
        console.log('OVERALL STATUS: SUCCESS');
        console.log('All persistence tasks verified against Supabase.');
        console.log('-------------------------------------------');

    } catch (err) {
        console.error('❌ Verification failed:', err.message);
        process.exit(1);
    }
}

runVerification();
