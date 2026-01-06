import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load components
const Session = lazy(() => import('./pages/Session'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InvitationPage = lazy(() => import('./pages/InvitationPage'));
const InvitationPartyPage = lazy(() => import('./pages/InvitationPartyPage'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'));
const PartnerListPage = lazy(() => import('./pages/PartnerMultiViewer'));
const PrintProfiles = lazy(() => import('./pages/PrintProfiles'));
const MobileAdminPreview = lazy(() => import('./components/admin/mobile/MobileAdminPreview'));
const ApplyFormPage = lazy(() => import('./pages/ApplyFormPage'));
const FormAdminPage = lazy(() => import('./pages/FormAdminPage'));
const AdminProfileBuilderPage = lazy(() => import('./pages/AdminProfileBuilderPage'));
const UserProfileTestPage = lazy(() => import('./pages/UserProfileTestPage'));
const PremiumPartnerViewer = lazy(() => import('./pages/PremiumPartnerViewer'));
const NotFound = lazy(() => import('./pages/NotFound'));

import AdminRoute from './components/auth/AdminRoute';
import { Toaster } from 'sonner';

// Full screen loading fallback
const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
);

const App: React.FC = () => {
    return (
        <Router>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/session" replace />} />
                    <Route path="/session" element={<Session />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />


                    <Route path="/invite" element={<InvitationPage />} />
                    <Route path="/invite/party" element={<InvitationPartyPage />} />
                    <Route path="/profile/edit" element={<ProfileEditPage />} />
                    <Route path="/edit" element={<ProfileEditPage />} />
                    <Route path="/partners" element={<PartnerListPage />} />
                    <Route path="/premium/partner" element={<PremiumPartnerViewer />} />
                    <Route path="/print/profiles" element={<PrintProfiles />} />

                    {/* Protected Mobile Admin Preview */}
                    <Route path="/mobile-admin" element={
                        <AdminRoute>
                            <MobileAdminPreview />
                        </AdminRoute>
                    } />


                    <Route path="/apply" element={<Navigate to="/apply/rotation" replace />} /> {/* Redirect legacy */}
                    <Route path="/apply/:formId" element={<ApplyFormPage />} /> {/* Dynamic Form Page */}



                    {/* Protected Form Admin */}
                    <Route path="/form-admin" element={
                        <AdminRoute>
                            <AdminRoute>
                                <FormAdminPage />
                            </AdminRoute>
                        </AdminRoute>
                    } />

                    {/* TEMP: Test Routes for Profile Builder */}
                    <Route path="/admin/profile-builder" element={<AdminProfileBuilderPage />} />

                    {/* [NEW] Explicit Profile Routes */}
                    <Route path="/profile/premium" element={<UserProfileTestPage />} />
                    <Route path="/profile/rotation" element={<UserProfileTestPage />} />

                    {/* Legacy/Redirects (Optional) */}
                    <Route path="/test/profile" element={<Navigate to="/profile/rotation" replace />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            <Toaster position="top-center" richColors theme="system" />
        </Router >
    );
}
export default App;
