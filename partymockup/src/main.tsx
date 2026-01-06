// import { scan } from 'react-scan';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
// @ts-ignore
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary'

/*
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    scan({
        enabled: true,
        log: true, // 로깅 활성화 (옵션)
    });
}
*/

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalErrorBoundary>
            <App />
        </GlobalErrorBoundary>
    </StrictMode>,
)
