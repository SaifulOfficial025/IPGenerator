import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/router';
import { IPGenProvider } from './Context/IPGenContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IPGenProvider>
      <RouterProvider router={router} />
    </IPGenProvider>
  </StrictMode>,
)
