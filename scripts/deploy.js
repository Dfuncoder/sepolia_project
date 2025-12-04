const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", await deployer.getAddress());

  // Deploy RewardToken
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const reward = await RewardToken.deploy("SimpleReward", "SRWD");
  await reward.waitForDeployment();
  const rewardAddress = reward.target ?? reward.address;
  console.log("RewardToken deployed to:", rewardAddress);

  // Deploy SimpleBank with tokenPerEthUnit = 1000 (1 ETH => 1000 tokens)
  const tokenPerEthUnit = hre.ethers.parseUnits("1000", 0);
  const SimpleBank = await hre.ethers.getContractFactory("SimpleBank");
  const bank = await SimpleBank.deploy(rewardAddress, tokenPerEthUnit);
  await bank.waitForDeployment();
  const bankAddress = bank.target ?? bank.address;
  console.log("SimpleBank deployed to:", bankAddress);

  // Give bank permission to mint tokens
  const tx = await reward.connect(deployer).setMinter(bankAddress);
  await tx.wait();
  console.log("Bank set as minter for RewardToken");

  // Write frontend .env.local automatically
  const frontendEnv = `NEXT_PUBLIC_BANK_ADDRESS=${bankAddress}\nNEXT_PUBLIC_REWARD_ADDRESS=${rewardAddress}\n`;
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log("Wrote frontend/.env.local");

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
