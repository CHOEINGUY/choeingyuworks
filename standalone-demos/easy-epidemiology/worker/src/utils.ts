import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  affiliation: string;
  affiliationType: string;
}

export interface Env {
  USERS: KVNamespace;
}

// JWT 토큰 생성
export async function generateToken(userId: string, role: string = 'user'): Promise<string | null> {
  try {
    const token = await new SignJWT({ 
      userId, 
      role, 
      iat: Math.floor(Date.now() / 1000) 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
}

// JWT 토큰 검증
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch (error) {
    return null;
  }
}

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 성공 응답
export function successResponse(data: any, message: string = 'Success'): Response {
  return new Response(JSON.stringify({
    success: true,
    message,
    data
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// 에러 응답
export function errorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({
    success: false,
    message
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// 요청 본문 파싱
export async function parseRequestBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

// 사용자 ID 생성
export function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 회원가입 데이터 유효성 검사 (업데이트됨)
export function validateRegistrationData(data: RegistrationData): { valid: boolean; message?: string } {
  const { name, email, phone, password, affiliation, affiliationType } = data;
  
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '사용자 이름을 입력해주세요.' };
  }
  
  if (!email || !email.includes('@')) {
    return { valid: false, message: '유효한 이메일 주소를 입력해주세요.' };
  }
  
  if (!phone || phone.trim().length === 0) {
    return { valid: false, message: '전화번호를 입력해주세요.' };
  }
  
  if (!password || password.length < 6) {
    return { valid: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }
  
  if (!affiliation || affiliation.trim().length === 0) {
    return { valid: false, message: '소속을 입력해주세요.' };
  }
  
  if (!affiliationType || affiliationType.trim().length === 0) {
    return { valid: false, message: '소속 유형을 선택해주세요.' };
  }
  
  return { valid: true };
}

// CORS 헤더 설정
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
