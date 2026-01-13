import { createComponentLogger } from '../utils/logger';

const logger = createComponentLogger('UserManager');

export interface User {
  username: string;
  password?: string;
  createdAt: number;
  dataKey: string;
}

export interface UserData {
  headers: {
    basic: any[];
    clinical: any[];
    diet: any[];
  };
  rows: any[];
  settings: {
    isIndividualExposureColumnVisible: boolean;
    isConfirmedCaseColumnVisible: boolean;
  };
  userId: string;
  createdAt: number;
  lastModified: number;
  [key: string]: any;
}

interface BackupData {
  user?: User;
  data?: UserData;
  backupTime?: number;
}

interface Stats {
  userCount: number;
  totalDataSize: number;
  lastUpdated: number;
}

/**
 * 사용자 데이터 관리자 클래스
 * 사용자별 데이터 격리와 관리를 담당합니다.
 */
export class UserManager {
  private usersKey: string;
  private sessionsKey: string;

  constructor() {
    this.usersKey = 'epidemiology_users';
    this.sessionsKey = 'epidemiology_sessions';
  }

  /**
   * 사용자 데이터 저장
   * @param {User} userData - 사용자 정보
   */
  saveUser(userData: User): void {
    try {
      const users = this.getUsers();
      users[userData.username] = userData;
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    } catch (error) {
      logger.error('사용자 저장 실패:', error);
      throw new Error('사용자 정보 저장에 실패했습니다');
    }
  }

  /**
   * 사용자 데이터 로드
   * @param {string} username - 사용자명
   * @returns {User|null} 사용자 정보
   */
  getUser(username: string): User | null {
    try {
      const users = this.getUsers();
      return users[username] || null;
    } catch (error) {
      logger.error('사용자 로드 실패:', error);
      return null;
    }
  }

  /**
   * 모든 사용자 데이터 로드
   * @returns {Record<string, User>} 사용자 목록
   */
  getUsers(): Record<string, User> {
    try {
      const users = localStorage.getItem(this.usersKey);
      return users ? JSON.parse(users) : {};
    } catch (error) {
      logger.error('사용자 목록 로드 실패:', error);
      return {};
    }
  }

  /**
   * 사용자 삭제
   * @param {string} username - 사용자명
   */
  deleteUser(username: string): void {
    try {
      const users = this.getUsers();
      delete users[username];
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      
      // 사용자별 데이터도 삭제
      this.deleteUserData(username);
    } catch (error) {
      logger.error('사용자 삭제 실패:', error);
      throw new Error('사용자 삭제에 실패했습니다');
    }
  }

  /**
   * 사용자별 데이터 키 생성
   * @param {string} username - 사용자명
   * @returns {string} 데이터 키
   */
  getUserDataKey(username: string): string {
    return `epidemiology_data_${username}`;
  }

  /**
   * 사용자별 데이터 저장
   * @param {string} username - 사용자명
   * @param {any} data - 저장할 데이터
   */
  saveUserData(username: string, data: any): void {
    try {
      const key = this.getUserDataKey(username);
      const saveData = {
        ...data,
        userId: username,
        lastModified: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(saveData));
    } catch (error) {
      logger.error('사용자 데이터 저장 실패:', error);
      throw new Error('데이터 저장에 실패했습니다');
    }
  }

  /**
   * 사용자별 데이터 로드
   * @param {string} username - 사용자명
   * @returns {UserData|null} 사용자 데이터
   */
  loadUserData(username: string): UserData | null {
    try {
      const key = this.getUserDataKey(username);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('사용자 데이터 로드 실패:', error);
      return null;
    }
  }

  /**
   * 사용자별 데이터 삭제
   * @param {string} username - 사용자명
   */
  deleteUserData(username: string): void {
    try {
      const key = this.getUserDataKey(username);
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('사용자 데이터 삭제 실패:', error);
    }
  }

  /**
   * 사용자별 초기 데이터 생성
   * @param {string} username - 사용자명
   * @returns {UserData} 초기 데이터
   */
  createInitialUserData(username: string): UserData {
    return {
      headers: { 
        basic: [], 
        clinical: [], 
        diet: [] 
      },
      rows: [],
      settings: {
        isIndividualExposureColumnVisible: false,
        isConfirmedCaseColumnVisible: false
      },
      userId: username,
      createdAt: Date.now(),
      lastModified: Date.now()
    };
  }

  /**
   * 사용자별 데이터 초기화
   * @param {string} username - 사용자명
   */
  initializeUserData(username: string): void {
    const existingData = this.loadUserData(username);
    if (!existingData) {
      const initialData = this.createInitialUserData(username);
      this.saveUserData(username, initialData);
    }
  }

  /**
   * 기존 데이터를 기본 사용자로 마이그레이션
   * @param {string} defaultUsername - 기본 사용자명
   */
  migrateExistingData(defaultUsername: string = 'default'): void {
    try {
      // 기존 데이터 확인
      const existingData = localStorage.getItem('epidemiology_data');
      if (!existingData) return;

      // 기본 사용자 생성
      const defaultUser: User = {
        username: defaultUsername,
        password: this.hashPassword('default123'),
        createdAt: Date.now(),
        dataKey: this.getUserDataKey(defaultUsername)
      };

      // 사용자 저장
      this.saveUser(defaultUser);

      // 기존 데이터를 기본 사용자로 이동
      const parsedData = JSON.parse(existingData);
      parsedData.userId = defaultUsername;
      parsedData.lastModified = Date.now();

      this.saveUserData(defaultUsername, parsedData);

      // 기존 데이터 삭제
      localStorage.removeItem('epidemiology_data');

      logger.info('기존 데이터 마이그레이션 완료');
    } catch (error) {
      logger.error('데이터 마이그레이션 실패:', error);
    }
  }

  /**
   * 사용자 데이터 백업
   * @param {string} username - 사용자명
   * @returns {BackupData} 백업 데이터
   */
  backupUserData(username: string): BackupData {
    try {
      const user = this.getUser(username);
      const userData = this.loadUserData(username);
      
      return {
        user: user || undefined,
        data: userData || undefined,
        backupTime: Date.now()
      };
    } catch (error: any) {
      logger.error('사용자 데이터 백업 실패:', error);
      throw new Error('백업에 실패했습니다');
    }
  }

  /**
   * 사용자 데이터 복원
   * @param {string} username - 사용자명
   * @param {BackupData} backupData - 백업 데이터
   */
  restoreUserData(username: string, backupData: BackupData): void {
    try {
      if (backupData.user) {
        this.saveUser(backupData.user);
      }
      if (backupData.data) {
        this.saveUserData(username, backupData.data);
      }
    } catch (error) {
      logger.error('사용자 데이터 복원 실패:', error);
      throw new Error('복원에 실패했습니다');
    }
  }

  /**
   * 모든 사용자 데이터 백업
   * @returns {any} 전체 백업 데이터
   */
  backupAllData(): any {
    try {
      const users = this.getUsers();
      const backup: { users: Record<string, BackupData>, timestamp: number } = {
        users: {},
        timestamp: Date.now()
      };

      for (const username in users) {
        backup.users[username] = this.backupUserData(username);
      }

      return backup;
    } catch (error) {
      logger.error('전체 데이터 백업 실패:', error);
      throw new Error('전체 백업에 실패했습니다');
    }
  }

  /**
   * 비밀번호 해싱 (AuthManager와 동일한 방식)
   * @param {string} password - 원본 비밀번호
   * @returns {string} 해시된 비밀번호
   */
  hashPassword(password: string): string {
    return btoa(`${password}epidemiology_salt_2024`);
  }

  /**
   * 사용자 통계 정보
   * @returns {Stats} 통계 정보
   */
  getStats(): Stats {
    try {
      const users = this.getUsers();
      const userCount = Object.keys(users).length;
      let totalDataSize = 0;

      for (const username in users) {
        const data = this.loadUserData(username);
        if (data) {
          totalDataSize += JSON.stringify(data).length;
        }
      }

      return {
        userCount,
        totalDataSize,
        lastUpdated: Date.now()
      };
    } catch (error) {
      logger.error('통계 정보 조회 실패:', error);
      return { userCount: 0, totalDataSize: 0, lastUpdated: Date.now() };
    }
  }
}
