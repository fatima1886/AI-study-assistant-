const fs = require('fs');
// Takes the API_KEY from Vercel and writes it into a new config.js file
const configContent = `const config = { API_KEY: "${process.env.API_KEY || ''}" };`;
fs.writeFileSync('./config.js', configContent);
