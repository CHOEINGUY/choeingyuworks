
/**
 * Cloudflare Worker using Hono
 * - SMS Sending (via Discord Webhook)
 * - Deposit Verification (Mock Data)
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyPayments } from '../utils/paymentMatching';
import { BankTransaction } from '../types/transaction';
import { Applicant } from '../types';

const app = new Hono();

// Middleware: CORS
app.use('/*', cors({
    origin: '*', // Allow all origins for now (adjust for production)
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
}));

// Health Check
app.get('/', (c) => {
    return c.json({
        status: 'alive',
        message: 'Worker is running with Hono (Mock Mode) 🚀',
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /sms/send
 */
app.post('/sms/send', async (c) => {
    try {
        const body = await c.req.json();
        const { to, name, text } = body;

        const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1450802330961449010/zbq08r5Ymxj2VECW7aLKu7M7jP9nKJaYj-j46QM5IgBjl9UwMGdxCOJQPz1_DeoSxq_7";

        const discordPayload = {
            content: `📨 **새 문자 메시지 발송 요청**\n- **수신자**: ${name} (${to})\n- **내용**: ${text}`
        };

        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
            return c.json({ error: `Discord Webhook Error: ${discordResponse.statusText}` }, 500);
        }

        return c.json({
            status: "success",
            message: "Discord Webhook으로 메시지가 전송되었습니다.",
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /deposit/check
 * Mock Verification using 'verifyPayments' Logic
 */
app.post('/deposit/check', async (c) => {
    try {
        // 1. Mock Bank Transactions (Simulating Barobill Response)
        const mockTransactions: BankTransaction[] = [
            {
                transDateTime: new Date().toISOString(), // Today
                transDirection: '입금',
                deposit: 30000,
                withdraw: 0,
                balance: 100000,
                remark: '홍길동', // Match
                bankAccountNum: '123-456',
                transRefKey: 'TX001'
            },
            {
                transDateTime: new Date().toISOString(),
                transDirection: '입금',
                deposit: 30000,
                withdraw: 0,
                balance: 130000,
                remark: '김철수', // Should fail if Kim Cheol-su is not in applicants
                bankAccountNum: '123-456',
                transRefKey: 'TX002'
            },
            {
                transDateTime: new Date().toISOString(),
                transDirection: '출금',
                deposit: 0,
                withdraw: 10000,
                balance: 120000,
                remark: '간식비',
                bankAccountNum: '123-456',
                transRefKey: 'TX003'
            }
        ];

        // 2. Mock Applicants (Simulating Firestore Data)
        const mockApplicants: Applicant[] = [
            {
                id: 'USER_001',
                name: '홍길동',
                ticketPrice: 30000,
                paymentStatus: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
                serviceType: 'ROTATION',
                phone: '01012345678'
            } as Applicant,
            {
                id: 'USER_002',
                name: '이영희',
                ticketPrice: 30000,
                paymentStatus: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
                serviceType: 'ROTATION',
                phone: '01098765432'
            } as Applicant
        ];

        // 3. Run Matching Logic
        // Note: verifyPayments expects Date objects for times if simpler types used?
        // Our utility handles string/Date inputs well.
        const results = verifyPayments(mockTransactions, mockApplicants);

        return c.json({
            status: "success",
            message: "Mock matching executed.",
            data: {
                transactions: mockTransactions,
                applicants: mockApplicants,
                results: results
            }
        });

    } catch (err: any) {
        return c.json({ error: err.message, stack: err.stack }, 500);
    }
});

export default app;
