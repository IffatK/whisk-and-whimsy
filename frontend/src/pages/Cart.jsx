import { Outlet } from "react-router-dom";
import CartDrawer from "../components/cart/Cartdrawer";
import CartButton from "../components/cart/Cartbutton";
import { CartProvider } from "../components/cart/CartContext";
import '../components/cart/cart.css'
const Cart = () => {
  return (
   <>
      {/* All pages render here */}
      <Outlet />

      {/* GLOBAL components */}
      <CartDrawer />
      <CartButton />
    </>
  )
}

export default Cart
