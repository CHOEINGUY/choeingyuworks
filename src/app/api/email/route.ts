import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, company, contact, painPoint, description, budget, attachments } = body;

        // 1. Validate (Simple check)
        if (!name || !contact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Configure Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address (e.g., chldlsrb07@gmail.com)
                pass: process.env.GMAIL_APP_PASSWORD, // The 16-digit App Password
            },
        });

        // 3. Construct HTML Template (Digital Paper Style)
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; color: #333; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .header { background-color: #000000; color: #ffffff; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .content { padding: 40px 30px; }
                .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 5px; font-weight: 600; }
                .value { font-size: 16px; margin-bottom: 25px; line-height: 1.5; font-weight: 500; border-bottom: 1px solid #f0f0f0; padding-bottom: 5px; }
                .highlight-box { background-color: #f9f9f9; border-left: 4px solid #000; padding: 15px; margin-bottom: 25px; }
                .highlight-title { font-weight: bold; font-size: 18px; margin-bottom: 5px; color: #000; }
                .description { white-space: pre-wrap; background-color: #fafafa; padding: 20px; border-radius: 4px; border: 1px solid #eee; color: #444; line-height: 1.6; }
                .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
                .badge { display: inline-block; padding: 4px 8px; background-color: #000; color: #fff; font-size: 11px; border-radius: 4px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Service Request</h1>
                    <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">Lindy Works - Problem Diagnosis</p>
                </div>
                
                <div class="content">
                    <!-- Pain Point Featured -->
                    <div class="label">DIAGNOSIS (PAIN POINT)</div>
                    <div class="highlight-box">
                        <div class="highlight-title">${painPoint}</div>
                    </div>

                    <!-- Budget (New) -->
                    <div class="label">ESTIMATED BUDGET</div>
                    <div class="value">${budget || "Not Selected"}</div>

                    <!-- Client Info -->
                    <div class="label">CLIENT NAME</div>
                    <div class="value">${name}</div>

                    <div class="label">COMPANY / TEAM</div>
                    <div class="value">${company}</div>

                    <div class="label">CONTACT</div>
                    <div class="value" style="color: #0066cc; font-family: monospace;">${contact}</div>

                    <!-- Description -->
                    <div class="label">DETAILS</div>
                    <div class="description">${description}</div>

                    ${attachments && attachments.length > 0 ? `
                    <!-- Attachments -->
                    <div class="label" style="margin-top: 25px;">ATTACHMENTS (${attachments.length})</div>
                    <div style="margin-top: 10px;">
                        ${attachments.map((file: { fileName: string; fileBase64: string }) => `
                            <div style="margin-bottom: 5px; font-weight: bold; color: #000;">
                                📎 ${file.fileName}
                            </div>
                        `).join('')}
                        <div style="font-weight: normal; color: #666; font-size: 12px; margin-top: 5px;">(Attached below)</div>
                    </div>
                    ` : ''}
                </div>

                <div class="footer">
                    <p>This request was submitted via Lindy Works website.</p>
                    <p>${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // 4. Send Email
        await transporter.sendMail({
            from: `"Lindy Works Bot" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Send to yourself
            replyTo: contact, // Allow replying directly to the client
            subject: `[New Request] ${name} - ${painPoint}`,
            html: htmlContent,
            attachments: attachments ? attachments.map((file: { fileName: string; fileBase64: string }) => ({
                filename: file.fileName,
                path: file.fileBase64
            })) : []
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
