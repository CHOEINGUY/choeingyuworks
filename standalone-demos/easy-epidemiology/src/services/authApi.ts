import { User, AuthResponse, LoginRequest, RegisterResponse } from '@/types/auth';

// Cloudflare Workers API 기본 URL
const API_BASE = 'https://epidemiology-auth-worker.chldlsrb07.workers.dev';

class AuthApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  // API 요청 헬퍼 함수
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    };

    console.log('🌐 API 요청 시작:', {
      url,
      method: config.method || 'GET',
      body: config.body ? JSON.parse(config.body as string) : undefined
    });

    try {
      const response = await fetch(url, config);
      console.log('📡 API 응답 받음:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      // 응답 텍스트 먼저 가져오기
      const responseText = await response.text();
      console.log('📄 응답 텍스트:', responseText);

      let data: T;
      try {
        data = JSON.parse(responseText);
        console.log('✅ JSON 파싱 성공:', data);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        throw new Error(`응답 파싱 실패: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error('❌ API 요청 실패:', {
          status: response.status,
          data
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        throw new Error((data as any).message || `API 요청 실패 (${response.status})`);
      }
      
      console.log('✅ API 요청 성공:', data);
      return data;
    } catch (error) {
      console.error('❌ API 에러:', error);
      throw error;
    }
  }

  // 회원가입
  async register(userData: Partial<User>): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // 로그인 - 개발 모드: API 우회
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔓 개발 모드: 로그인 API 우회');
    
    // 더미 사용자 데이터
    const dummyUser: User = {
      id: 'dev-user-001',
      email: credentials.identifier || 'dev@example.com',
      name: '개발자',
      organization: '개발팀',
      role: 'admin',
      isApproved: true,
      approved: true,
      createdAt: new Date().toISOString()
    };
    
    // 더미 토큰 생성
    const dummyToken = `dev-token-${Date.now()}`;
    
    // 로컬 스토리지에 저장
    tokenManager.saveToken(dummyToken);
    userManager.saveUser(dummyUser);
    
    return {
      success: true,
      data: {
        token: dummyToken,
        user: dummyUser
      }
    };
  }

  // 토큰 검증
  async verifyToken(token: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  // 이메일 중복 확인
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return this.makeRequest<{ available: boolean }>('/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // 전화번호 중복 확인
  async checkPhoneAvailability(phone: string): Promise<{ available: boolean }> {
    return this.makeRequest<{ available: boolean }>('/api/auth/check-phone', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  // 헬스체크
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/api/health', {
      method: 'GET'
    });
  }
}

// 관리자 API 서비스
class AdminApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  // API 요청 헬퍼 함수 (관리자용)
  // 개발 모드: 모든 API 호출 우회
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async makeRequest(): Promise<any> {
    console.log('🔓 개발 모드: Admin API 우회');
    return { success: true };
  }

  // 승인 대기 사용자 목록 - 개발 모드
  async getPendingUsers(): Promise<{ success: boolean; data: User[] }> {
    console.log('🔓 개발 모드: getPendingUsers 우회');
    return { success: true, data: [] };
  }

  // 사용자 승인 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async approveUser(userId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 사용자 거부 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rejectUser(userId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 일괄 사용자 승인 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async bulkApproveUsers(userIds: string[]): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 일괄 사용자 거부 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async bulkRejectUsers(userIds: string[]): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 전체 사용자 목록 - 개발 모드
  async getAllUsers(): Promise<{ success: boolean; data: User[] }> {
    console.log('🔓 개발 모드: 사용자 목록 API 우회');
    return {
      success: true,
      data: [
        {
          id: 'dev-user-001',
          email: 'dev@example.com',
          name: '개발자',
          organization: '개발팀',
          role: 'admin',
          isApproved: true,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  // 사용자 삭제 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 사용자 권한 변경 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateUserRole(userId: string, role: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  // 사용자 정보 업데이트 - 개발 모드
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateUserInfo(userId: string, data: any): Promise<{ success: boolean }> {
    return { success: true };
  }
}

// 싱글톤 인스턴스 생성
export const authApi = new AuthApiService();
export const adminApi = new AdminApiService();

// 토큰 관리 유틸리티
export const tokenManager = {
  // 토큰 저장
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // 토큰 삭제
  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  // 토큰 유효성 확인
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    return !!token;
  }
};

// 사용자 상태 관리
export const userManager = {
  // 사용자 정보 저장
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 사용자 정보 가져오기
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as User : null;
  },

  // 사용자 정보 삭제
  removeUser(): void {
    localStorage.removeItem('user');
  },

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // 관리자 권한 확인
  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && (user.role === 'admin' || user.role === 'support');
  },

  // 로그아웃
  logout(): void {
    tokenManager.removeToken();
    this.removeUser();
  }
};
