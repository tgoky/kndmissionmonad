// import { ethers } from "hardhat";
// import * as dotenv from "dotenv";

// dotenv.config();

// async function main() {
//   // Get the deployer account
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying the contract with the account:", deployer.address);

//   // Define the total supply (in wei)
//   const totalSupply = ethers.parseEther("9990000000"); // 1,000,000 SZNS tokens

//   // Compile and deploy the contract with _totalSupply
//   const XLR8 = await ethers.getContractFactory("MuffledBirdv2");
//   const xlr8 = await XLR8.deploy(totalSupply);

//   // Wait for deployment to be mined
//   await xlr8.deploymentTransaction();
//   console.log("SZNS contract deployed at:", await xlr8.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });

import { ethers, deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);

  // Define constructor arguments
  const muffledTokenAddress = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72"; // Replace with actual token address
  const taxRate = 300; // Example: 2% tax (200 basis points)
  const entryFee = ethers.parseEther("0.34"); // Example: 0.01 MON token

  // Deploy the contract with all constructor arguments
  const gameRewardsDeployment = await deployments.deploy("GameRewardsV1", {
    from: deployer,
    args: [muffledTokenAddress, taxRate, entryFee],
    log: true,
  });

  console.log("GameRewards deployed at:", gameRewardsDeployment.address);

  // Get the deployed contract instance
  const gameRewards = await ethers.getContractAt("GameRewardsV1", gameRewardsDeployment.address);

  console.log("Contract owner:", await gameRewards.owner());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
