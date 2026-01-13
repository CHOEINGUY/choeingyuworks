import { createComponentLogger } from '../utils/logger';
import type { User } from './UserManager';

const logger = createComponentLogger('AuthManager');

interface AuthResult {
  success: boolean;
  user?: { username: string; dataKey: string };
}

interface Session {
  username: string;
  dataKey: string;
  loginTime: number;
  expiresAt: number;
}

/**
 * 인증 관리자 클래스
 * 사용자 등록, 로그인, 로그아웃, 세션 관리를 담당합니다.
 */
export class AuthManager {
  private currentUser: User | null;
  private isAuthenticated: boolean;
  private sessionTimeout: number;
  private autoLoginKey: string;

  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24시간
    this.autoLoginKey = 'epidemiology_auto_login';
  }

  /**
   * 사용자 등록
   * @param {string} username - 사용자명
   * @param {string} password - 비밀번호
   * @returns {Promise<AuthResult>} 등록 결과
   */
  async register(username: string, password: string): Promise<AuthResult> {
    try {
      // 사용자 존재 확인
      const existingUser = this.getUser(username);
      if (existingUser) {
        throw new Error('사용자가 이미 존재합니다');
      }

      // 비밀번호 해싱
      const hashedPassword = this.hashPassword(password);
      
      // 새 사용자 생성
      const user: User = {
        username,
        password: hashedPassword,
        createdAt: Date.now(),
        dataKey: `epidemiology_data_${username}`
      };
      
      // 사용자 저장
      this.saveUser(user);
      
      // 자동 로그인
      await this.login(username, password);
      
      return {
        success: true,
        user: { username, dataKey: user.dataKey }
      };
    } catch (error: any) {
      throw new Error(`회원가입 실패: ${error.message}`);
    }
  }

  /**
   * 사용자 로그인
   * @param {string} username - 사용자명
   * @param {string} password - 비밀번호
   * @returns {Promise<AuthResult>} 로그인 결과
   */
  async login(username: string, password: string): Promise<AuthResult> {
    try {
      // 사용자 조회
      const user = this.getUser(username);
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
      }

      // 비밀번호 검증
      if (!this.verifyPassword(password, user.password || '')) {
        throw new Error('비밀번호가 올바르지 않습니다');
      }

      // 세션 생성
      const session: Session = {
        username: user.username,
        dataKey: user.dataKey,
        loginTime: Date.now(),
        expiresAt: Date.now() + this.sessionTimeout
      };

      // 세션 저장
      this.saveSession(session);
      
      // 현재 사용자 설정
      this.currentUser = user;
      this.isAuthenticated = true;

      return {
        success: true,
        user: { username: user.username, dataKey: user.dataKey }
      };
    } catch (error: any) {
      throw new Error(`로그인 실패: ${error.message}`);
    }
  }

  /**
   * 로그아웃
   */
  logout(): void {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.clearSession();
  }

  /**
   * 자동 로그인 체크
   * @returns {boolean} 로그인 성공 여부
   */
  checkAutoLogin(): boolean {
    try {
      const session = this.getSession();
      if (!session) return false;

      // 세션 만료 확인
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return false;
      }

      // 사용자 정보 로드
      const user = this.getUser(session.username);
      if (!user) {
        this.clearSession();
        return false;
      }

      // 현재 사용자 설정
      this.currentUser = user;
      this.isAuthenticated = true;

      return true;
    } catch (error) {
      logger.error('자동 로그인 체크 실패:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * 현재 사용자 정보 반환
   * @returns {User|null} 현재 사용자 정보
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * 인증 상태 반환
   * @returns {boolean} 인증 여부
   */
  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }

  // === 내부 메서드들 ===

  /**
   * 비밀번호 해싱 (간단한 구현)
   * @param {string} password - 원본 비밀번호
   * @returns {string} 해시된 비밀번호
   */
  hashPassword(password: string): string {
    // 실제 프로덕션에서는 bcrypt 등 사용 권장
    return btoa(`${password}epidemiology_salt_2024`);
  }

  /**
   * 비밀번호 검증
   * @param {string} password - 입력된 비밀번호
   * @param {string} hashedPassword - 저장된 해시 비밀번호
   * @returns {boolean} 검증 결과
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  /**
   * 사용자 저장
   * @param {User} user - 사용자 정보
   */
  saveUser(user: User): void {
    const users = this.getUsers();
    users[user.username] = user;
    localStorage.setItem('epidemiology_users', JSON.stringify(users));
  }

  /**
   * 사용자 조회
   * @param {string} username - 사용자명
   * @returns {User|null} 사용자 정보
   */
  getUser(username: string): User | null {
    const users = this.getUsers();
    return users[username] || null;
  }

  /**
   * 모든 사용자 조회
   * @returns {Record<string, User>} 사용자 목록
   */
  getUsers(): Record<string, User> {
    const users = localStorage.getItem('epidemiology_users');
    return users ? JSON.parse(users) : {};
  }

  /**
   * 세션 저장
   * @param {Session} session - 세션 정보
   */
  saveSession(session: Session): void {
    localStorage.setItem(this.autoLoginKey, JSON.stringify(session));
  }

  /**
   * 세션 조회
   * @returns {Session|null} 세션 정보
   */
  getSession(): Session | null {
    const session = localStorage.getItem(this.autoLoginKey);
    return session ? JSON.parse(session) : null;
  }

  /**
   * 세션 삭제
   */
  clearSession(): void {
    localStorage.removeItem(this.autoLoginKey);
  }
}
