const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server.js');

let mongoServer;

beforeAll(async () => {
    // סגירת חיבורים קיימים במידה וישנם
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    // הפעלת שרת MongoDB בזיכרון (הוכח שעובד במחשבך)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    // ניקוי האוספים לאחר כל בדיקה כדי לשמור על בידוד
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('Auth API & Authorization Integration Tests', () => {

    describe('POST /api/auth/register', () => {
        it('צריך להחזיר 201 וליצור משתמש ופרופיל מסוג owner', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Israel Israeli',
                    email: 'israel@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('profileId');
            expect(res.body.name).toBe('Israel Israeli');
            expect(res.body.email).toBe('israel@example.com');
            expect(res.body.role).toBe('owner');
        });

        it('צריך להחזיר 400 אם חסרים שדות', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Israel' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('יש למלא את כל השדות.');
        });

        it('צריך להחזיר 400 אם שם המשתמש קצר מ-3 תווים', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'A',
                    email: 'valid@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('שם המשתמש חייב להכיל לפחות 3 תווים.');
        });

        it('צריך להחזיר 400 אם הסיסמה קצרה מ-6 תווים', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Israel Israeli',
                    email: 'valid@example.com',
                    password: '123'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('הסיסמה חייבת להכיל לפחות 6 תווים.');
        });

        it('צריך להחזיר 400 אם האימייל כבר קיים במערכת', async () => {
            // הרשמה ראשונה
            await request(app).post('/api/auth/register').send({
                name: 'First User',
                email: 'exist@example.com',
                password: 'password123'
            });

            // ניסיון הרשמה שנייה עם אותו אימייל
            const res = await request(app).post('/api/auth/register').send({
                name: 'Second User',
                email: 'exist@example.com',
                password: 'password123'
            });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe(' האימייל כבר קיים.');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });

        it('צריך להתחבר בהצלחה ולהחזיר עוגיית Session', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.email).toBe('test@example.com');
            expect(res.body.role).toBe('owner');

            // אימות שהשרת החזיר עוגיית סשן
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/connect\.sid/);
        });

        it('צריך להחזיר 401 עבור סיסמה שגויה', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('האימייל או הסיסמה שגויים.');
        });
    });

    describe('Auth Middlewares & Page Protection Tests', () => {
        let authCookie;

        beforeEach(async () => {
            const regRes = await request(app).post('/api/auth/register').send({
                name: 'Owner User',
                email: 'owner@example.com',
                password: 'password123'
            });

            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'owner@example.com',
                password: 'password123'
            });

            authCookie = loginRes.headers['set-cookie'];
        });

        it('requirePageAuth: צריך לאפשר גישה ל-feed כאשר המשתמש מחובר', async () => {
            const res = await request(app)
                .get('/feed')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
        });

        it('requirePageAuth: צריך להעביר (Redirect 302) לדף הבית אם משתמש אינו מחובר', async () => {
            const res = await request(app).get('/feed');

            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/');
        });

        it('requirePageAdmin: צריך להעביר משתמש שאינו admin לדף ה-feed', async () => {
            const res = await request(app)
                .get('/admin')
                .set('Cookie', authCookie);

            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/feed');
        });
    });
});