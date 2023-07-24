/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false
};

module.exports = nextConfig;

module.exports = {
	webpack: (config) => {
  config.module.rules.push({
    test: /\.node/,
    use: 'raw-loader',
  })
  return config;
	},
}