const { createDemoAccounts } = require('./auth_run.js');

async function test() {
    console.log("Running createDemoAccounts...");
    const result = await createDemoAccounts();
    console.log("Result:", result);
}
test();
