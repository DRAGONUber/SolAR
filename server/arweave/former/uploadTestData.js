const Arweave = require('arweave');
const fs = require('fs');

const keyPath = './arweave-key.json'; 
const walletKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const arweave = Arweave.init({
  host: 'localhost', 
  port: 1984,        
  protocol: 'http',
});

const uploadTestData = async () => {
  try {
    const sampleData = "Suvan is cute";

    const transaction = await arweave.createTransaction({ data: sampleData }, walletKey);

    await arweave.transactions.sign(transaction, walletKey);

    const response = await arweave.transactions.post(transaction);

    if (response.status === 200 || response.status === 202) {
      console.log(`✅ Transaction posted successfully!`);
      console.log(`🔗 View locally at: http://localhost:1984/tx/${transaction.id}`);

      await mineTransaction();
    } else {
      console.error(`❌ Transaction failed:`, response);
    }
  } catch (error) {
    console.error("❌ Error uploading data:", error);
  }
};

const mineTransaction = async () => {
  try {
    console.log("⛏️ Mining transaction...");
    await fetch("http://localhost:1984/mine", { method: "POST" });
    console.log("✅ Transaction mined successfully!");
  } catch (error) {
    console.error("❌ Error mining transaction:", error);
  }
};

uploadTestData();
