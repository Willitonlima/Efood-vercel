import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState, Product } from '../types'

const initialState: CartState = {
  items: [],
  isOpen: false,
  restaurantId: null,
  restaurantName: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ item: Product; restaurantId: number; restaurantName: string }>) => {
      const { item, restaurantId, restaurantName } = action.payload
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = []
      }
      state.restaurantId = restaurantId
      state.restaurantName = restaurantName
      // Sempre adiciona um novo item separado no carrinho, mesmo que seja o mesmo produto
      state.items.push({ ...item, cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, quantity: 1 })
      state.isOpen = true
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.cartItemId !== action.payload)
    },
    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.cartItemId === action.payload)
      if (item) item.quantity += 1
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.cartItemId === action.payload)
      if (item) {
        item.quantity -= 1
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.cartItemId !== action.payload)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      state.restaurantId = null
      state.restaurantName = null
      state.isOpen = false
    },
    clearCartKeepOpen: (state) => {
      state.items = []
      state.restaurantId = null
      state.restaurantName = null
    },
    openCart: (state) => { state.isOpen = true },
    closeCart: (state) => { state.isOpen = false },
  },
})

export const { addItem, removeItem, incrementItem, decrementItem, clearCart, clearCartKeepOpen, openCart, closeCart } = cartSlice.actions
export default cartSlice.reducer
