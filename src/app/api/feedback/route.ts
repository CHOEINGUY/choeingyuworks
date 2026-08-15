import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { sessionId, persona, question, answer, feedback } = await req.json();

    if (feedback !== 'up' && feedback !== 'down') {
      return new Response(JSON.stringify({ error: 'Invalid feedback value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await addDoc(collection(db, 'chat_feedback'), {
      sessionId: sessionId || 'anonymous_session',
      persona: persona || 'professional',
      question: question || '',
      answer: answer || '',
      feedback,
      createdAt: serverTimestamp(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Feedback API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
