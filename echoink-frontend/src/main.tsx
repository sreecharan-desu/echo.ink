import { createRoot } from 'react-dom/client'
import './index.css';
const LoadingAnimation = React.lazy(()=>import('./components/loadingcomponent'))
import { RecoilRoot } from 'recoil'
import { Suspense } from 'react'
import App from './App';
import * as React from 'react';


createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      <Suspense fallback={<LoadingAnimation/>}><App /></Suspense>
    </RecoilRoot>
)

