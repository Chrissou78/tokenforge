// scripts/deploy-multi-chain.js
const hre = require("hardhat");
const fs = require('fs');

// Chain configurations
const CHAINS = [
  { name: 'ethereum', id: 1, rpc: process.env.ETH_RPC },
  { name: 'polygon', id: 137, rpc: process.env.POLYGON_RPC },
  { name: 'bsc', id: 56, rpc: process.env.BSC_RPC },
  { name: 'arbitrum', id: 42161, rpc: process.env.ARBITRUM_RPC },
  { name: 'optimism', id: 10, rpc: process.env.OPTIMISM_RPC },
  { name: 'base', id: 8453, rpc: process.env.BASE_RPC }
];

async function deployToChain(chainName, chainId, rpc) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Deploying to ${chainName.toUpperCase()} (Chain ID: ${chainId})`);
  console.log('='.repeat(60));
  
  if (!rpc) {
    console.log(`⚠️  Skipping ${chainName} - No RPC URL configured`);
    return null;
  }
  
  try {
    // Switch network
    hre.changeNetwork(chainName);
    
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.getBalance();
    
    console.log("Deployer:", deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      console.log(`⚠️  Skipping ${chainName} - No balance`);
      return null;
    }
    
    const FEE_COLLECTOR = process.env.FEE_COLLECTOR || deployer.address;
    
    // Deploy TokenLocker
    console.log("\nDeploying TokenLocker...");
    const TokenLocker = await hre.ethers.getContractFactory("TokenLocker");
    const locker = await TokenLocker.deploy(FEE_COLLECTOR);
    await locker.waitForDeployment();
    const lockerAddress = await locker.getAddress();
    console.log("✅ TokenLocker:", lockerAddress);
    
    // Deploy LockerRegistry
    console.log("Deploying LockerRegistry...");
    const LockerRegistry = await hre.ethers.getContractFactory("LockerRegistry");
    const registry = await LockerRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("✅ LockerRegistry:", registryAddress);
    
    // Register locker
    console.log("Registering locker...");
    const tx = await registry.setOfficialLocker(chainId, lockerAddress);
    await tx.wait();
    console.log("✅ Locker registered!");
    
    return {
      chain: chainName,
      chainId,
      locker: lockerAddress,
      registry: registryAddress,
      feeCollector: FEE_COLLECTOR,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Error deploying to ${chainName}:`, error.message);
    return {
      chain: chainName,
      chainId,
      error: error.message,
      success: false
    };
  }
}

async function main() {
  console.log("Starting multi-chain deployment...");
  console.log();
  
  const results = [];
  
  // Deploy to each chain
  for (const chain of CHAINS) {
    const result = await deployToChain(chain.name, chain.id, chain.rpc);
    if (result) {
      results.push(result);
    }
    
    // Wait between deployments
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("MULTI-CHAIN DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log();
  
  if (successful.length > 0) {
    console.log("Successful Deployments:");
    console.log();
    successful.forEach(r => {
      console.log(`${r.chain.toUpperCase()} (${r.chainId}):`);
      console.log(`  Locker:   ${r.locker}`);
      console.log(`  Registry: ${r.registry}`);
      console.log();
    });
  }
  
  if (failed.length > 0) {
    console.log("Failed Deployments:");
    console.log();
    failed.forEach(r => {
      console.log(`${r.chain.toUpperCase()} (${r.chainId}):`);
      console.log(`  Error: ${r.error}`);
      console.log();
    });
  }
  
  // Save all results
  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const timestamp = Date.now();
  fs.writeFileSync(
    `${deploymentsDir}/multi-chain-${timestamp}.json`,
    JSON.stringify(results, null, 2)
  );
  
  console.log(`Results saved to: deployments/multi-chain-${timestamp}.json`);
  
  // Generate config update
  if (successful.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("UPDATE locker-config.js with these addresses:");
    console.log("=".repeat(60));
    console.log();
    
    successful.forEach(r => {
      console.log(`${r.chain}: {`);
      console.log(`  chainId: ${r.chainId},`);
      console.log(`  locker: '${r.locker}',`);
      console.log(`  registry: '${r.registry}'`);
      console.log(`},`);
      console.log();
    });
  }
  
  // Verification commands
  if (successful.length > 0) {
    console.log("=".repeat(60));
    console.log("VERIFICATION COMMANDS:");
    console.log("=".repeat(60));
    console.log();
    
    successful.forEach(r => {
      console.log(`# ${r.chain.toUpperCase()}`);
      console.log(`npx hardhat verify --network ${r.chain} ${r.locker} ${r.feeCollector}`);
      console.log(`npx hardhat verify --network ${r.chain} ${r.registry}`);
      console.log();
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
