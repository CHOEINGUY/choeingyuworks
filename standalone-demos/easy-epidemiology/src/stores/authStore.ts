import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tokenManager, authApi, userManager } from '../services/authApi';
import type { User, LoginCredentials, AuthResponse, RegisterData, RegisterResponse, LoginRequest } from '@/types/auth'; // Centralized types

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // --- Getters ---
  const isAdmin = computed<boolean>(() => {
    const user = currentUser.value;
    return !!user && (user.role === 'admin' || user.role === 'support');
  });

  // --- Actions ---
  function setUser(user: User | null): void {
    currentUser.value = user;
    isAuthenticated.value = !!user;
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading;
  }

  function setError(errorMsg: string | null): void {
    error.value = errorMsg;
  }

  function clearError(): void {
    error.value = null;
  }

  async function register(userData: RegisterData): Promise<RegisterResponse> {
    console.log('🏪 Store register 액션 시작:', userData);
    setLoading(true);
    clearError();
    
    try {
      console.log('📞 authApi.register 호출');
      const result = await authApi.register(userData) as RegisterResponse;
      console.log('✅ authApi.register 성공:', result);
      
      // 성공 시 StoreBridge에 현재 사용자 설정
      if (window.storeBridge && typeof window.storeBridge.setCurrentUser === 'function' && result.data) {
        console.log('🔗 StoreBridge에 사용자 설정');
        try {
          window.storeBridge.setCurrentUser(result.data);
        } catch (bridgeError) {
          console.warn('⚠️ StoreBridge 사용자 설정 실패:', bridgeError);
        }
      }
      
      return result;
    } catch (err) {
      console.error('❌ register 액션 실패:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function login({ identifier, password, identifierType }: LoginRequest): Promise<AuthResponse> {
    console.log('🏪 Store login 액션 시작:', { identifier, identifierType });
    setLoading(true);
    clearError();
    
    try {
      console.log('📞 authApi.login 호출');
      const result = await authApi.login({ identifier, password, identifierType }) as AuthResponse;
      console.log('✅ authApi.login 성공:', result);
      
      // 토큰과 사용자 정보 저장
      tokenManager.saveToken(result.data.token);
      userManager.saveUser(result.data.user);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (window.storeBridge && typeof window.storeBridge.setCurrentUser === 'function') {
        try {
          window.storeBridge.setCurrentUser(result.data.user);
        } catch (bridgeError) {
          console.warn('⚠️ StoreBridge 사용자 설정 실패:', bridgeError);
        }
      }
      
      setUser(result.data.user);
      return result;
    } catch (err) {
      console.error('❌ login 액션 실패:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    console.log('🏪 Store logout 액션 시작');
    try {
      tokenManager.removeToken();
      userManager.removeUser();
      
      if (window.storeBridge && typeof window.storeBridge.setCurrentUser === 'function') {
        try {
          window.storeBridge.setCurrentUser(null);
        } catch (bridgeError) {
          console.warn('⚠️ StoreBridge 사용자 제거 실패:', bridgeError);
        }
      }
      
      setUser(null);
      clearError();
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error('❌ logout 액션 실패:', err);
      tokenManager.removeToken();
      userManager.removeUser();
      setUser(null);
      clearError();
    }
  }

  async function checkAutoLogin(): Promise<boolean> {
    setLoading(true);
    try {
      const isLoggedIn = userManager.isLoggedIn();
      
      if (isLoggedIn) {
        const u = userManager.getUser() as User | null;
        
        if (window.storeBridge && typeof window.storeBridge.setCurrentUser === 'function') {
          try {
            window.storeBridge.setCurrentUser(u);
          } catch (bridgeError) {
            console.warn('⚠️ StoreBridge 사용자 설정 실패:', bridgeError);
          }
        }
        
        setUser(u);
      }
      return isLoggedIn;
    } catch (err) {
      console.error('자동 로그인 체크 실패:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    
    // Getters
    isAdmin,
    
    // Actions
    setUser,
    setLoading,
    setError,
    clearError,
    register,
    login,
    logout,
    checkAutoLogin
  };
});
