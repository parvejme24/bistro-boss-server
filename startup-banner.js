function displayStartupBanner(port, environment = "development") {
  const banner = `
╔══════════════════════════════════════════════════════════════╗
║                    🍕 BISTRO BOSS SERVER 🍕                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🚀 Server Status: RUNNING                                   ║
║  📍 Local URL: http://localhost:${port}                      ║
║  🌐 Live URL: https://bistro-boss-server-tau-three.vercel.app ║
║  📚 API Base: http://localhost:${port}/api/v1                  ║
║  🔧 Environment: ${environment}                               ║
║  🗄️  Database: MongoDB                                      ║
║  💳 Payment: SSL Commerz                                    ║
║                                                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

  console.log(banner);

  // Additional helpful information
  console.log("💡 Tips:");
  console.log("• Press Ctrl+C to stop the server");
  console.log("• Check .env file for environment variables");
  console.log("• Visit the live URL to test production deployment");
  console.log("• Use Postman or curl to test API endpoints");
  console.log("");
}

module.exports = displayStartupBanner;
