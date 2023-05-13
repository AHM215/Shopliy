const mongoose = require('mongoose')
const { User } = require('./User')

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
        min: [1, 'Quantity can not be less than 1.'],
      },
      price: {
        type: Number,
        ref: 'product.price',
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
    default: 0,
    required: true,
    min: [0, 'Subtotal must be a positive number.'],
  },
  shippingCost: {
    type: Number,
    default: 21,
    required: true,
    min: [0, 'Shipping cost must be a positive number.'],
  },
  totalCost: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total cost must be a positive number.'],
  },
  shippingAddress: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

orderSchema.pre('save', async function (next) {
  let isEmpty = Object.values(this.shippingAddress).every(
    (value) => value == null || value == undefined
  )

  if (isEmpty) {
    try {
      const user = await User.findById({ _id: this.userId })
      if (user) {
        this.shippingAddress = user.shippingAddress
        this.totalCost = this.subTotal + this.shippingCost
      }
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }
  next()
})
const Order = mongoose.model('order', orderSchema)

module.exports = Order
