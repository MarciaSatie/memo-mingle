// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is the crucial line for static export
  // If you're encountering issues with images not showing up in static export,
  // and you're not using a custom image loader, uncomment the line below:
  // images: {
  //   unoptimized: true,
  // },
  // Optional: Add a trailing slash for consistent URLs
  // trailingSlash: true,
};

module.exports = nextConfig; // <--- This line is key for CommonJS
