
export const EMAIL_DOMAINS: string[] = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'nate.com',
  'korea.kr',
  'kakao.com',
  'icloud.com',
  'outlook.com',
  'hotmail.com'
];

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(cleanPhone);
}

export function findEmailSuggestion(domainPart: string | null | undefined): string | undefined {
  if (!domainPart) return undefined;
  const lowerDomainPart = domainPart.toLowerCase();
  
  // Find the best match that starts with the input
  const match = EMAIL_DOMAINS.find(domain => domain.startsWith(lowerDomainPart));
  
  // console.log(`Searching for: ${lowerDomainPart}, Found: ${match}`);
  return match;
}

export type AuthInputType = 'email' | 'phone' | 'ambiguous';

export function detectInputType(input: string): AuthInputType {
  const cleanInput = input.replace(/[^0-9]/g, '');
  
  // 1순위: @가 있으면 무조건 이메일
  if (input.includes('@')) {
    return 'email';
  }
  
  // 2순위: 완전한 전화번호 (01012345678)
  if (/^01[0-9]{8,9}$/.test(cleanInput)) {
    return 'phone';
  }
  
  // 3순위: 전화번호 시작 패턴 (010, 011, 016 등)
  if (/^01[0-9]/.test(cleanInput) && cleanInput.length >= 3) {
    // 하지만 이메일 시작 패턴이 더 강하면 이메일로 처리
    if (/^[a-zA-Z]/.test(input)) {
      return 'email';
    }
    return 'phone';
  }
  
  // 4순위: 이메일 시작 패턴
  if (/^[a-zA-Z0-9._%+-]+/.test(input)) {
    return 'email';
  }
  
  return 'ambiguous';
}

export function formatPhoneNumber(input: string): string {
  const cleanInput = input.replace(/[^0-9]/g, '');
  
  if (cleanInput.length <= 3) {
    return cleanInput;
  } else if (cleanInput.length <= 7) {
    return `${cleanInput.slice(0, 3)}-${cleanInput.slice(3)}`;
  } else {
    return `${cleanInput.slice(0, 3)}-${cleanInput.slice(3, 7)}-${cleanInput.slice(7, 11)}`;
  }
}
