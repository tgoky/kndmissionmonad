import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const muffledTokenAddress = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72"; // Replace with actual token address
  const gameRewardsAddress = "0x706e51256096F5aabA58A55B4e2B17416968E7D2"; // Replace with deployed GameRewards contract address

  const amountToTransfer = ethers.parseUnits("100000000", 18); // 90 million tokens

  // Get MuffledBird Token contract instance
  const muffledToken = await ethers.getContractAt("contracts/MuffledBird.sol:IERC20", muffledTokenAddress, deployer);

  console.log("Transferring 90 million MuffledBird tokens to GameRewards...");
  const transferTx = await muffledToken.transfer(gameRewardsAddress, amountToTransfer);
  await transferTx.wait();
  console.log("Transfer transaction confirmed ✅");

  console.log("Tokens successfully sent to GameRewards! 🎉");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
