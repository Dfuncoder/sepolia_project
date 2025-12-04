const { expect } = require('chai');
const hre = require('hardhat');

describe('SimpleBank + RewardToken', function () {
  let reward, bank, owner, alice;

  beforeEach(async function () {
    [owner, alice] = await hre.ethers.getSigners();

    const RewardToken = await hre.ethers.getContractFactory('RewardToken');
    reward = await RewardToken.deploy('SimpleReward', 'SRWD');
    await reward.waitForDeployment();

    const tokenPerEthUnit = hre.ethers.parseUnits('1000', 0);
    const SimpleBank = await hre.ethers.getContractFactory('SimpleBank');
    bank = await SimpleBank.deploy(reward.target ?? reward.address, tokenPerEthUnit);
    await bank.waitForDeployment();

    await reward.connect(owner).setMinter(bank.target ?? bank.address);
  });

  it('mints reward tokens on deposit', async function () {
    await bank.connect(alice).deposit({ value: hre.ethers.parseEther('0.5') });
    const bal = await bank.connect(alice).getMyBalance();
    expect(bal).to.equal(hre.ethers.parseEther('0.5'));
    const tokenBal = await reward.balanceOf(await alice.getAddress());
    expect(tokenBal).to.equal(hre.ethers.parseUnits('500', 0));
  });

  it('prevents over-withdraw', async function () {
    await bank.connect(alice).deposit({ value: hre.ethers.parseEther('0.1') });
    await expect(bank.connect(alice).withdraw(hre.ethers.parseEther('1.0'))).to.be.revertedWith('Insufficient balance');
  });
});
