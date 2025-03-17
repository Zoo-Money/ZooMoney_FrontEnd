module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".mjs"], // `.mjs` 추가
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
};
