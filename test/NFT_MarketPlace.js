const { expect } = require('chai')

const token = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
    }
const toWei = (n) => {
    return  ethers.utils.parseEther(n.toString())
}
const fromWei = (n) => {
    return ethers.utils.formatEther(n)
}
describe('NFT Marketplace', () => {
    let add1, add2, addrs, deployer, NFT, nft,Marketplace
    let URI = 'http;//smaple-URI'
    let feePercent = 10
    beforeEach(async () => {
        [deployer,buyer, seller, add1, add2, ...addrs] = await ethers.getSigners()

        NFT = await ethers.getContractFactory('NFT')
        Marketplace = await ethers.getContractFactory('Marketplace')

        nft = await NFT.deploy()
        marketPlace = await Marketplace.deploy(feePercent)

    })
    describe('deployment',()=>{
        it('track NFT name and symbol',async()=>{
           expect(await nft.name()).to.be.equal('MZ_NFT') 
           expect(await nft.symbol()).to.be.equal('MZ_Creater') 
        })
        it('track NFT Market feePercent and fee account',async()=>{
            expect(await marketPlace.feePercent()).to.be.equal(feePercent) 
            expect(await marketPlace.feeAccount()).to.be.equal(deployer.address) 
         })
    })
    describe('NFTs Minting', () => {
        it('should track NFT mint', async () => {
            await nft.connect(add1).mint(URI)
            const count = await nft.tokenCount()
            expect(count).to.equal(1)
            expect(await nft.balanceOf(add1.address)).to.equal(1)
            expect(await nft.tokenURI(count)).to.equal(URI)
            expect(await nft.ownerOf(1)).to.equal(add1.address)
            
            await nft.connect(add2).mint(URI)
            const count1 = await nft.tokenCount()
            expect(count1).to.equal(2)
            expect(await nft.tokenURI(count1)).to.equal(URI)
            expect(await nft.balanceOf(add2.address)).to.equal(1)
            expect(await nft.ownerOf(2)).to.equal(add2.address)
            
        })
    })
    describe('Making Marketplace item',()=>{
        beforeEach(async()=>{
            await nft.connect(add1).mint(URI)
            await nft.connect(add1).setApprovalForAll(marketPlace.address,true)
        })
        it('Track Newly created item, transfer from seller to marketplace and emmit Offered',async()=>{
            const mp=await marketPlace.connect(add1).makeItem(nft.address,1,token(1))
            expect(mp).to.emit(marketPlace,"offered").withArgs(1,nft.address,1,token(1),add1.address)
            console.log(token(1).toString())
            console.log(toWei(1).toString())
            console.log(fromWei(toWei(1)).toString())
            // console.log(await marketPlace.items(1))
            expect(await nft.ownerOf(1)).to.be.equal(marketPlace.address)
            expect(await marketPlace.itemCount()).to.be.equal(1)
            const item = await marketPlace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(token(1))
            expect(item.sold).to.equal(false)
        })
        // it('Should fail if price is zero',async()=>{
        //     const mp = await marketPlace.connect(add1).makeItem(nft.address,1,0)
        //     expect(mp).to.be.revertedWith('price must be greater then zero')

        // })
        
    })
    describe('Purchase Item from Market Place',()=>{
        let price = 20
        let fee = (feePercent/100)*price
        let totalPriceInWei
        beforeEach(async()=>{
           await nft.connect(add1).mint(URI)
           await nft.connect(add1).setApprovalForAll(marketPlace.address,true)
           await marketPlace.connect(add1).makeItem(nft.address,1,toWei(price)) 
        })
        it('Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event',async()=>{
            const sellerInitialBalance = await add1.getBalance()
            const feeAccountInitialBalance = await deployer.getBalance()
            totalPriceInWei = await marketPlace.getTotalPrice(1)
            //add2 purchase item
            const firstOwner = await nft.ownerOf(1)
            const buyer = await marketPlace.connect(add2).purchaseItem(1,{value:totalPriceInWei})
            expect(buyer).to.emit(marketPlace,'Bought').withArgs(
                1,
                nft.address,
                1,toWei(price),
                add1.address,
                add2.address
            )
            const secondOwner = await nft.ownerOf(1)
            console.log('seller :'+firstOwner)
            console.log('buyer :'+secondOwner)
            const sellerFinalBalance = await add1.getBalance()
            const feeAccountFinalBalance = await deployer.getBalance()
            console.log('sellerInitialBalance :'+fromWei(sellerInitialBalance))
            console.log('sellerFinalBalance :'+fromWei(sellerFinalBalance))
            console.log('feeAccountInitialBalance :'+fromWei(feeAccountInitialBalance))
            console.log('feeAccountFinalBalance :'+fromWei(feeAccountFinalBalance))

        })
    })

})