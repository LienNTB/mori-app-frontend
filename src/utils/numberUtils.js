export function calculateDiscountPrice(originalPrice, discountPercent) {
  try {
    // Ensure discount is between 0 and 100
    discountPercent = Math.max(0, Math.min(discountPercent, 100));

    // Calculate discount amount
    const discountAmount = originalPrice * (discountPercent / 100);

    // Calculate discounted price
    const discountPrice = originalPrice - discountAmount;

    return discountPrice;
  } catch (err) {
    console.log("err", err);
  }
}
