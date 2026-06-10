import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import CreateAdmin from './pages/CreateAdmin'
import Layout from './pages/Layout'
import Categories from './pages/Categories'
import Collections from './pages/Collections'

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-page"><div className="w-6 h-6 border-2 border-shopify/30 border-t-shopify rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="collections" element={<Collections />} />
        <Route path="admins" element={<CreateAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
