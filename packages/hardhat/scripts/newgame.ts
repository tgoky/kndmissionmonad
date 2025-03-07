import { ethers, deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);

  // Define constructor arguments
  const muffledTokenAddress = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72"; // Replace with actual token address
  const taxRate = 300; // Example: 2% tax (200 basis points)
  const entryFee = ethers.parseEther("0.34"); // Example: 0.01 MON token

  // Deploy the contract with all constructor arguments
  const gameRewardsDeployment = await deployments.deploy("GameRewardsV2", {
    from: deployer,
    args: [muffledTokenAddress, taxRate, entryFee],
    log: true,
  });

  console.log("GameRewards deployed at:", gameRewardsDeployment.address);

  // Get the deployed contract instance
  const gameRewards = await ethers.getContractAt("GameRewardsV2", gameRewardsDeployment.address);

  console.log("Contract owner:", await gameRewards.owner());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
