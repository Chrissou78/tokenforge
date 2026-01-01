// scripts/deploy-locker.js
const hre = require("hardhat");

async function main() {
  console.log("Starting TokenLocker deployment...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const chainId = await deployer.getChainId();
  
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("Chain ID:", chainId);
  console.log();
  
  // Configuration
  const FEE_COLLECTOR = process.env.FEE_COLLECTOR || deployer.address;
  
  console.log("Fee Collector:", FEE_COLLECTOR);
  console.log();
  
  // Deploy TokenLocker
  console.log("Deploying TokenLocker...");
  const TokenLocker = await hre.ethers.getContractFactory("TokenLocker");
  const locker = await TokenLocker.deploy(FEE_COLLECTOR);
  
  await locker.waitForDeployment();
  const lockerAddress = await locker.getAddress();
  
  console.log("✅ TokenLocker deployed to:", lockerAddress);
  console.log();
  
  // Deploy LockerRegistry
  console.log("Deploying LockerRegistry...");
  const LockerRegistry = await hre.ethers.getContractFactory("LockerRegistry");
  const registry = await LockerRegistry.deploy();
  
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  
  console.log("✅ LockerRegistry deployed to:", registryAddress);
  console.log();
  
  // Register the official locker
  console.log("Registering locker in registry...");
  const tx = await registry.setOfficialLocker(chainId, lockerAddress);
  await tx.wait();
  
  console.log("✅ Locker registered!");
  console.log();
  
  // Summary
  console.log("=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Chain ID:", chainId);
  console.log("TokenLocker:", lockerAddress);
  console.log("LockerRegistry:", registryAddress);
  console.log("Fee Collector:", FEE_COLLECTOR);
  console.log("=".repeat(60));
  console.log();
  
  // Verification commands
  console.log("To verify contracts, run:");
  console.log();
  console.log(`npx hardhat verify --network ${hre.network.name} ${lockerAddress} ${FEE_COLLECTOR}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${registryAddress}`);
  console.log();
  
  // Save to file
  const fs = require('fs');
  const deploymentInfo = {
    chainId,
    network: hre.network.name,
    locker: lockerAddress,
    registry: registryAddress,
    feeCollector: FEE_COLLECTOR,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    `deployments/${hre.network.name}-${chainId}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`Deployment info saved to: deployments/${hre.network.name}-${chainId}.json`);
  console.log();
  
  // Update config instructions
  console.log("Don't forget to update locker-config.js with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
