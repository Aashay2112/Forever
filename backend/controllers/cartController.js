// Cart Controller (stores cart per-user)

// Cart structure in userModel.cartData:
// {
//   [productId]: {
//     "S": 2,
//     "M": 1
//   }
// }

const getCart = async (req, res) => {
  try {
    const cartData = req.user.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartData } = req.body;

    if (typeof cartData !== "object" || cartData === null) {
      return res.json({ success: false, message: "Invalid cart data." });
    }

    req.user.cartData = cartData;
    await req.user.save();

    res.json({ success: true, cartData: req.user.cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    req.user.cartData = {};
    await req.user.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getCart, updateCart, clearCart };
