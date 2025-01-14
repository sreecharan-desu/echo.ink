import { createRoot } from 'react-dom/client'
import './index.css';
import * as React from 'react';
const LoadingAnimation = React.lazy(()=>import('./components/loadingcomponent'))
import { RecoilRoot } from 'recoil'
import { Suspense } from 'react'
import App from './App';


createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      <Suspense fallback={<LoadingAnimation/>}><App /></Suspense>
    </RecoilRoot>
)