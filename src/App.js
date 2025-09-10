
import React from "react";
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./layouts/protected/ProtectedRoute";
import UserModal from "./layouts/home/header/UserModal";
import { CartProvider } from './components/action/CartContext';
import { AuthProvider, useAuth } from './layouts/protected/AuthContext';
import AuthNavigation from './layouts/protected/AuthNavigation';
import { Snackbar, Alert } from '@mui/material';

// User Interface
import LayoutHome from "./layouts/home/LayoutHome";
import Home from "./pages/home/Home";
import About from "./pages/home/About";
import ShopPage from "./pages/home/ShopPage";
import BlogPage from "./pages/home/BlogPage";
import ContactPage from "./pages/home/ContactPage";
import SinglePost from "./pages/home/SinglePost";
import ProductDetail from "./components/display/product/ProductDetail";
import Cart from "./pages/buy/Cart";
import CheckOut from "./pages/buy/CheckOut";
import CustomerProfile from "./pages/customer/CustomerProfile";

// Admin Interface
import LayoutAdmin from "./admin/layout/LayoutAdmin";
import Dashboard from "./admin/dashboard/Dashboard";
import ProductList from "./admin/product/ProductList";
import AddProduct from "./admin/product/AddProduct";
import EditProduct from "./admin/product/EditProduct";
import ProductView from "./admin/product/ProductView";
import OrderList from "./admin/order/OrderList";
import EditOrder from "./admin/order/EditOrder";
import OrderDetails from "./admin/order/OrderDetails";
import CreateUser from "./admin/user/CreateUser";
import UserList from "./admin/user/UserList";
import EditUser from "./admin/user/EditUser";
import SupplierList from './admin/supplier/SupplierList';
import AddSupplier from './admin/supplier/AddSupplier';
import EditSupplier from './admin/supplier/EditSupplier';
import DiscountList from './admin/maketing/DiscountList';
import AddDiscount from './admin/maketing/AddDiscount';
import EditDiscount from './admin/maketing/EditDiscount';
import ReviewList from './admin/review/ReviewList';
import AddReview from './admin/review/AddReview';
import EditReview from './admin/review/EditReview';
import ImportProductList from './admin/import-product/ImportProductList';
import CreateImportProduct from './admin/import-product/CreateImportProduct';
import EditImportProduct from './admin/import-product/EditImportProduct';

// Thành phần mới để chứa nội dung của App
function AppContent() {
  const { snackbar, closeSnackbar } = useAuth();

  return (
    <>
      {/* <AuthNavigation /> */}
      <Routes>
        <Route path="/" element={<LayoutHome />}>
          {/* Các route công khai */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="singlepost" element={<SinglePost />} />
          <Route path="productdetail/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          {/* Các route yêu cầu đăng nhập */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckOut />
              </ProtectedRoute>
            }
          />
          <Route
            path="customerprofile"
            element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Các route admin yêu cầu đăng nhập và ROLE_ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<ProductList />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
          <Route path="productview/:id" element={<ProductView />} />
          <Route path="order" element={<OrderList />} />
          <Route path="edit-order/:orderId" element={<EditOrder />} />
          <Route path="order/:orderId" element={<OrderDetails />} />
          <Route path="user" element={<UserList />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="edit-user/:userId" element={<EditUser />} />
          <Route path="supplier" element={<SupplierList />} />
          <Route path="add-supplier" element={<AddSupplier />} />
          <Route path="edit-supplier/:supplierId" element={<EditSupplier />} />
          <Route path="discount" element={<DiscountList />} />
          <Route path="add-discount" element={<AddDiscount />} />
          <Route path="edit-discount/:discountId" element={<EditDiscount />} />
          <Route path="review" element={<ReviewList />} />
          <Route path="add-review" element={<AddReview />} />
          <Route path="edit-review/:reviewId" element={<EditReview />} />
          <Route path="import-products" element={<ImportProductList />} />
          <Route path="create-import-product" element={<CreateImportProduct />} />
          <Route path="edit-import-product/:importId" element={<EditImportProduct />} />
        </Route>
      </Routes>
      <UserModal />
      {/* Snackbar để hiển thị thông báo lỗi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;