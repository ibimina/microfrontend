const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PORT = process.env.REACT_APP_PORT || 3001;
const path = require("path");

module.exports = (_, argv) => ({
  entry: "./src/index.js",
  // mode: "development",
  output: {
    // publicPath: "auto", // ✅ Ensures correct URL resolution
    // filename: "[name].[contenthash].js",
    // clean: true,
    path: path.resolve(__dirname, "build"),
    publicPath: argv.mode === 'development' ? `http://localhost:3001/` : 'https://microfrontend-six.vercel.app/',
  },
  devServer: {
    port: 3001,
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // or /\.(ts|tsx)$/ if using TypeScript
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        resourceQuery: /component/, // Use "?component" in import to load as React component
                        use: ["@svgr/webpack"],
                    },
                    {
                        use: {
                            loader: "file-loader",
                            options: {
                                name: "[name].[hash].[ext]",
                                outputPath: "assets", // Save inside "dist/assets/"
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },    
  plugins: [
    new ModuleFederationPlugin({
      name: "microfrontend",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",  // Exposing the Microfrontend's App component
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
});
