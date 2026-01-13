import {
  successResponse,
  errorResponse,
  parseRequestBody,
  verifyToken,
  corsHeaders,
  type Env
} from './utils';
import { type UserData } from './auth';

// 로깅 유틸리티
const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  }
};

interface AdminAuthResult {
  isAdmin: boolean;
  error?: string;
  user?: UserData;
}

// 관리자 권한 확인
async function checkAdminAuth(request: Request, env: Env): Promise<AdminAuthResult> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAdmin: false, error: "인증 토큰이 필요합니다." };
  }
  const token = authHeader.substring(7);
  const decoded = await verifyToken(token);
  if (!decoded) {
    return { isAdmin: false, error: "유효하지 않은 토큰입니다." };
  }
  try {
    const allUsers = await env.USERS.list({ prefix: "user:" });
    let userData: UserData | null = null;
    
    for (const key of allUsers.keys) {
      try {
        const userStr = await env.USERS.get(key.name);
        if (!userStr) continue;
        
        let user: UserData;
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          logger.error(`JSON parse failed for admin auth ${key.name}:`, parseError);
          continue; // 이 사용자는 건너뛰고 다음 사용자로
        }
        
        if (user.id === decoded.userId) {
          userData = user;
          break;
        }
      } catch (userError) {
        logger.error(`Error processing user ${key.name} for admin auth:`, userError);
        continue;
      }
    }
    
    if (!userData || userData.role !== "admin") {
      return { isAdmin: false, error: "관리자 권한이 필요합니다." };
    }
    
    return { isAdmin: true, user: userData };
  } catch (error) {
    logger.error("Admin auth error:", error);
    return { isAdmin: false, error: "권한 확인 중 오류가 발생했습니다." };
  }
}

// 승인 대기 사용자 목록 조회
export async function handleGetPendingUsers(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") {
    return errorResponse("Method not allowed", 405);
  }
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }
  try {
    const pendingUsers = await env.USERS.list({ prefix: "pending:" });
    const users: any[] = [];
    
    for (const key of pendingUsers.keys) {
      try {
        const userStr = await env.USERS.get(key.name);
        if (!userStr) continue;
        
        let user: any;
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          logger.error(`JSON parse failed for pending user ${key.name}:`, parseError);
          continue; // 이 사용자는 건너뛰고 다음 사용자로
        }
        
        users.push({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          organization: user.organization,
          phone: user.phone,
          createdAt: user.createdAt,
          affiliation: user.affiliation,
          affiliationType: user.affiliationType
        });
      } catch (userError) {
        logger.error(`Error processing pending user ${key.name}:`, userError);
        continue;
      }
    }
    
    return successResponse({ users }, "승인 대기 사용자 목록 조회 성공");
  } catch (error) {
    logger.error("Get pending users error:", error);
    return errorResponse("사용자 목록 조회 중 오류가 발생했습니다.", 500);
  }
}

// 사용자 승인
export async function handleApproveUser(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin || !authCheck.user) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userId) {
    return errorResponse('사용자 ID가 필요합니다.');
  }

  try {
    // 승인 대기 사용자 조회
    const pendingUserStr = await env.USERS.get(`pending:${body.userId}`);
    if (!pendingUserStr) {
      return errorResponse('승인 대기 중인 사용자를 찾을 수 없습니다.');
    }

    const pendingUser = JSON.parse(pendingUserStr) as UserData;

    // 사용자 데이터 업데이트
    const updatedUser: UserData = {
      ...pendingUser,
      role: 'user',
      approved: true,
      approvedAt: new Date().toISOString(),
      approvedBy: authCheck.user.username || authCheck.user.name
    };

    // KV 업데이트
    await env.USERS.put(`user:${pendingUser.id}`, JSON.stringify(updatedUser));
    await env.USERS.delete(`pending:${body.userId}`);

    return successResponse({
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    }, '사용자 승인이 완료되었습니다.');

  } catch (error) {
    logger.error('Approve user error:', error);
    return errorResponse('사용자 승인 중 오류가 발생했습니다.', 500);
  }
}

// 사용자 거부
export async function handleRejectUser(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userId) {
    return errorResponse('사용자 ID가 필요합니다.');
  }

  try {
    // 승인 대기 사용자 조회
    const pendingUserStr = await env.USERS.get(`pending:${body.userId}`);
    if (!pendingUserStr) {
      return errorResponse('승인 대기 중인 사용자를 찾을 수 없습니다.');
    }

    const pendingUser = JSON.parse(pendingUserStr) as UserData;

    // 사용자 데이터 삭제
    await env.USERS.delete(`user:${pendingUser.id}`);
    await env.USERS.delete(`email:${pendingUser.email}`);
    await env.USERS.delete(`pending:${body.userId}`);

    return successResponse(
      { userId: body.userId },
      '사용자 등록이 거부되었습니다.'
    );

  } catch (error) {
    logger.error('Reject user error:', error);
    return errorResponse('사용자 거부 중 오류가 발생했습니다.', 500);
  }
}

// 일괄 사용자 승인
export async function handleBulkApproveUsers(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin || !authCheck.user) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userIds || !Array.isArray(body.userIds)) {
    return errorResponse('사용자 ID 목록이 필요합니다.');
  }

  if (body.userIds.length === 0) {
    return errorResponse('승인할 사용자가 선택되지 않았습니다.');
  }

  try {
    const results: { approved: string[]; failed: string[]; errors: string[] } = {
      approved: [],
      failed: [],
      errors: []
    };

    for (const userId of body.userIds) {
      try {
        // 승인 대기 사용자 조회
        const pendingUserStr = await env.USERS.get(`pending:${userId}`);
        if (!pendingUserStr) {
          results.failed.push(userId);
          results.errors.push(`사용자 ID ${userId}: 승인 대기 중인 사용자를 찾을 수 없습니다.`);
          continue;
        }

        let pendingUser: UserData;
        try {
          pendingUser = JSON.parse(pendingUserStr);
        } catch (parseError) {
          logger.info('JSON parse failed for bulk approve, trying manual parse...');
          const cleanDataStr = pendingUserStr.replace(/^'|'$/g, '');
          const matches = cleanDataStr.match(/(\w+):([^,}]+)/g);
          pendingUser = {} as UserData;
          if (matches) {
            matches.forEach(match => {
              const [key, value] = match.split(':');
              const k = key.trim() as keyof UserData;
              const v = value.trim().replace(/^"|"$/g, '');
              if (k === 'approved') {
                (pendingUser as any)[k] = v === 'true';
              } else {
                (pendingUser as any)[k] = v;
              }
            });
          }
        }

        // 사용자 데이터 업데이트
        const updatedUser: UserData = {
          ...pendingUser,
          role: 'user',
          approved: true,
          approvedAt: new Date().toISOString(),
          approvedBy: authCheck.user.username || authCheck.user.name
        };

        // KV 업데이트
        await env.USERS.put(`user:${pendingUser.id}`, JSON.stringify(updatedUser));
        await env.USERS.delete(`pending:${userId}`);

        results.approved.push(userId);
      } catch (error: any) {
        logger.error(`Bulk approve error for user ${userId}:`, error);
        results.failed.push(userId);
        results.errors.push(`사용자 ID ${userId}: ${error.message}`);
      }
    }

    return successResponse({
      total: body.userIds.length,
      approved: results.approved.length,
      failed: results.failed.length,
      errors: results.errors
    }, `${results.approved.length}명의 사용자가 승인되었습니다.`);

  } catch (error) {
    logger.error('Bulk approve users error:', error);
    return errorResponse('일괄 승인 중 오류가 발생했습니다.', 500);
  }
}

// 일괄 사용자 거부
export async function handleBulkRejectUsers(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userIds || !Array.isArray(body.userIds)) {
    return errorResponse('사용자 ID 목록이 필요합니다.');
  }

  if (body.userIds.length === 0) {
    return errorResponse('거부할 사용자가 선택되지 않았습니다.');
  }

  try {
    const results: { rejected: string[]; failed: string[]; errors: string[] } = {
      rejected: [],
      failed: [],
      errors: []
    };

    for (const userId of body.userIds) {
      try {
        // 승인 대기 사용자 조회
        const pendingUserStr = await env.USERS.get(`pending:${userId}`);
        if (!pendingUserStr) {
          results.failed.push(userId);
          results.errors.push(`사용자 ID ${userId}: 승인 대기 중인 사용자를 찾을 수 없습니다.`);
          continue;
        }

        let pendingUser: UserData;
        try {
          pendingUser = JSON.parse(pendingUserStr);
        } catch (parseError) {
          logger.info('JSON parse failed for bulk reject, trying manual parse...');
          const cleanDataStr = pendingUserStr.replace(/^'|'$/g, '');
          const matches = cleanDataStr.match(/(\w+):([^,}]+)/g);
          pendingUser = {} as UserData;
          if (matches) {
            matches.forEach(match => {
              const [key, value] = match.split(':');
              const k = key.trim() as keyof UserData;
              const v = value.trim().replace(/^"|"$/g, '');
              if (k === 'approved' || k === 'id') {
                // simple assignments
                (pendingUser as any)[k] = v;
              } else {
                (pendingUser as any)[k] = v;
              }
            });
          }
        }

        // 사용자 데이터 삭제
        await env.USERS.delete(`user:${pendingUser.id}`);
        await env.USERS.delete(`email:${pendingUser.email}`);
        await env.USERS.delete(`pending:${userId}`);

        results.rejected.push(userId);
      } catch (error: any) {
        logger.error(`Bulk reject error for user ${userId}:`, error);
        results.failed.push(userId);
        results.errors.push(`사용자 ID ${userId}: ${error.message}`);
      }
    }

    return successResponse({
      total: body.userIds.length,
      rejected: results.rejected.length,
      failed: results.failed.length,
      errors: results.errors
    }, `${results.rejected.length}명의 사용자가 거부되었습니다.`);

  } catch (error) {
    logger.error('Bulk reject users error:', error);
    return errorResponse('일괄 거부 중 오류가 발생했습니다.', 500);
  }
}

// 모든 사용자 목록 조회
export async function handleGetAllUsers(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") {
    return errorResponse("Method not allowed", 405);
  }
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }
  try {
    const allUsers = await env.USERS.list({ prefix: "user:" });
    const users: any[] = [];
    
    for (const key of allUsers.keys) {
      try {
        const userStr = await env.USERS.get(key.name);
        if (!userStr) continue;
        
        let user: UserData;
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          logger.error(`JSON parse failed for all users ${key.name}:`, parseError);
          continue; // 이 사용자는 건너뛰고 다음 사용자로
        }
        
        users.push({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          organization: user.organization,
          phone: user.phone,
          role: user.role,
          approved: user.approved,
          createdAt: user.createdAt,
          approvedAt: user.approvedAt,
          approvedBy: user.approvedBy,
          affiliation: user.affiliation,
          affiliationType: user.affiliationType
        });
      } catch (userError) {
        console.error(`Error processing user ${key.name}:`, userError);
        continue;
      }
    }
    
    return successResponse({ users }, "전체 사용자 목록 조회 성공");
  } catch (error) {
    console.error("Get all users error:", error);
    return errorResponse("사용자 목록 조회 중 오류가 발생했습니다.", 500);
  }
}

// 사용자 삭제
export async function handleDeleteUser(request: Request, env: Env): Promise<Response> {
  if (request.method !== "DELETE") {
    return errorResponse("Method not allowed", 405);
  }
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin || !authCheck.user) {
    return errorResponse(authCheck.error || "Forbidden", 401);
  }
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return errorResponse("사용자 ID가 필요합니다.");
  }
  try {
    const allUsers = await env.USERS.list({ prefix: "user:" });
    let userToDelete: UserData | null = null;
    let userKey: string | null = null;
    
    for (const key of allUsers.keys) {
      try {
        const userStr = await env.USERS.get(key.name);
        if (!userStr) continue;
        
        let user: UserData;
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.error(`JSON parse failed for delete user ${key.name}:`, parseError);
          continue; // 이 사용자는 건너뛰고 다음 사용자로
        }
        
        if (user.id === userId) {
          userToDelete = user;
          userKey = key.name;
          break;
        }
      } catch (userError) {
        console.error(`Error processing user ${key.name} for deletion:`, userError);
        continue;
      }
    }
    
    if (!userToDelete || !userKey) {
      return errorResponse("사용자를 찾을 수 없습니다.");
    }
    
    if (userToDelete.id === authCheck.user.id) {
      return errorResponse("자신의 계정은 삭제할 수 없습니다.");
    }
    
    // 사용자 데이터 삭제
    await env.USERS.delete(userKey);
    
    // 이메일 키 삭제
    if (userToDelete.email) {
      await env.USERS.delete(`email:${userToDelete.email}`);
    }
    
    // 전화번호 키 삭제
    if (userToDelete.phone) {
      await env.USERS.delete(`phone:${userToDelete.phone}`);
    }
    
    // 대기 중인 사용자 키 삭제
    await env.USERS.delete(`pending:${userId}`);
    
    return successResponse(
      { userId },
      "사용자가 삭제되었습니다."
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse("사용자 삭제 중 오류가 발생했습니다.", 500);
  }
}

// 사용자 권한(role) 변경
export async function handleUpdateUserRole(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인 (admin만 가능)
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin || !authCheck.user || authCheck.user.role !== 'admin') {
    return errorResponse('시스템 관리자 권한이 필요합니다.', 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userId || !body.role) {
    return errorResponse('userId와 role이 필요합니다.');
  }

  const allowedRoles = ['admin', 'support', 'user'];
  if (!allowedRoles.includes(body.role)) {
    return errorResponse('허용되지 않은 권한입니다.');
  }

  try {
    // 사용자 정보 조회
    const allUsers = await env.USERS.list({ prefix: 'user:' });
    let userToUpdate: UserData | null = null;
    let userKey: string | null = null;
    for (const key of allUsers.keys) {
      const userStr = await env.USERS.get(key.name);
      if (!userStr) continue;
      
      let user: UserData;
      try {
        user = JSON.parse(userStr);
      } catch (parseError) {
        // fallback manual parse
        const cleanDataStr = userStr.replace(/^'|'$/g, '');
        const matches = cleanDataStr.match(/(\w+):([^,}]+)/g);
        user = {} as UserData;
        if (matches) {
          matches.forEach(match => {
            const [k, v] = match.split(':');
            (user as any)[k.trim()] = v.trim().replace(/^"|"$/g, '');
          });
        }
      }
      if (user.id === body.userId) {
        userToUpdate = user;
        userKey = key.name;
        break;
      }
    }

    if (!userToUpdate || !userKey) {
      return errorResponse('사용자를 찾을 수 없습니다.');
    }

    // role 변경
    userToUpdate.role = body.role;
    await env.USERS.put(userKey, JSON.stringify(userToUpdate));

    return successResponse({
      user: {
        id: userToUpdate.id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        role: userToUpdate.role
      }
    }, '사용자 권한이 변경되었습니다.');
  } catch (error) {
    console.error('Update user role error:', error);
    return errorResponse('사용자 권한 변경 중 오류가 발생했습니다.', 500);
  }
}

// 사용자 정보 업데이트 (소속, 연락처, 가입일 등)
export async function handleUpdateUserInfo(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 관리자 권한 확인 (admin만 가능)
  const authCheck = await checkAdminAuth(request, env);
  if (!authCheck.isAdmin || !authCheck.user || authCheck.user.role !== 'admin') {
    return errorResponse('시스템 관리자 권한이 필요합니다.', 401);
  }

  const body = await parseRequestBody(request);
  if (!body || !body.userId) {
    return errorResponse('userId가 필요합니다.');
  }

  try {
    // 사용자 정보 조회
    const allUsers = await env.USERS.list({ prefix: 'user:' });
    let userToUpdate: UserData | null = null;
    let userKey: string | null = null;
    
    for (const key of allUsers.keys) {
      const userStr = await env.USERS.get(key.name);
      if (!userStr) continue;
      
      let user: UserData;
      try {
        user = JSON.parse(userStr);
      } catch (parseError) {
        // fallback manual parse
        const cleanDataStr = userStr.replace(/^'|'$/g, '');
        const matches = cleanDataStr.match(/(\w+):([^,}]+)/g);
        user = {} as UserData;
        if (matches) {
          matches.forEach(match => {
            const [key, value] = match.split(':');
            (user as any)[key.trim()] = value.trim().replace(/^"|"$/g, '');
          });
        }
      }
      
      if (user.id === body.userId) {
        userToUpdate = user;
        userKey = key.name;
        break;
      }
    }

    if (!userToUpdate || !userKey) {
      return errorResponse('사용자를 찾을 수 없습니다.');
    }

    // 업데이트할 정보들
    if (body.organization !== undefined) {
      userToUpdate.organization = body.organization;
    }
    if (body.organizationType !== undefined) {
      userToUpdate.organizationType = body.organizationType;
    }
    if (body.phone !== undefined) {
      userToUpdate.phone = body.phone;
    }
    if (body.createdAt !== undefined) {
      userToUpdate.createdAt = body.createdAt;
    }
    if (body.province !== undefined) {
      userToUpdate.province = body.province;
    }
    if (body.district !== undefined) {
      userToUpdate.district = body.district;
    }

    // KV 업데이트
    await env.USERS.put(userKey, JSON.stringify(userToUpdate));

    return successResponse({
      user: {
        id: userToUpdate.id,
        username: userToUpdate.username,
        organization: userToUpdate.organization,
        phone: userToUpdate.phone,
        createdAt: userToUpdate.createdAt
      }
    }, '사용자 정보가 업데이트되었습니다.');

  } catch (error) {
    console.error('Update user info error:', error);
    return errorResponse('사용자 정보 업데이트 중 오류가 발생했습니다.', 500);
  }
}

// CORS 처리
export function handleCORS(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders()
  });
}
