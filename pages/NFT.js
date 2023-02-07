import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, LinearProgress, Link, Stack, SvgIcon, Tooltip, Typography } from '@mui/material'
import { height } from '@mui/system'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import config from './config.json'
import NFTData from './abis/NFT.json'
import Marketplace from './abis/Marketplace.json'
import Document from 'next/document'
var CryptoJS = require("crypto-js");
const NFT = ({ account, setAccount ,token}) => {
    const router = useRouter()
    const z = router.query.id
    const [nfts, setNfts] = useState([])
    const [loading, setloading] = useState(true)
    const [nft, setNft] = useState(null)
    const [marketPlace, setMarketPlace] = useState(null)
    const [progressValue, setProgressValue] = useState(0)

    const loadBlockChainData = async () => {

        const a=token.id
        console.log(a)
        setProgressValue(20)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const network = await provider.getNetwork()
        setProgressValue(40)
        const signer = provider.getSigner()
        const Nft = new ethers.Contract(config[network.chainId].NFT.address, NFTData, signer)
        const market = new ethers.Contract(config[network.chainId].Marketplace.address, Marketplace, signer)
        setProgressValue(60)

        const itemCount = (await market.itemCount()).toString()
        const items = []
        console.log(Nft)
        for (let i = 1; i <= itemCount; i++) {

            const item = await market.items(i)
            setProgressValue(80)
            if (item.tokenId==token.id) {
                const uri = await Nft.tokenURI(token.id)
                const fetchData = await fetch(uri)
                const data = await fetchData.json()
                const totalPrice = (await market.getTotalPrice(item.itemId)).toString()

                items.push({
                    owner:await Nft.ownerOf(token.id),
                    totalPrice: totalPrice,
                    itemId: item.itemId.toString(),
                    seller: item.seller,
                    name: data.name,
                    description: data.description,
                    image: `https://${data.image.slice(7, 66)}.ipfs.dweb.link/blob`
                })
            }
            setProgressValue(100)
        }
        console.log(items[0])
        setNfts(items)
        setNft(Nft)
        setMarketPlace(market)


        // console.log(itemCount)

        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        if (account) {
            setAccount(account)
        }
        setProgressValue(0)
        setloading(false)
    }

    useEffect(() => {
        loadBlockChainData()
    }, [])

    if (loading) return (
        <LinearProgress variant='determinate' value={progressValue} />
    )
    else return (

        <Grid rowSpacing={4} container item justifyContent="flex-start">
            <Grid marginLeft='10px' item xs={4}>
                <Card sx={{ maxWidth: '100%' }}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="450"
                        image={nfts[0].image}
                    />

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Discription
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{nfts[0].description}</Typography>
                    </CardContent>
                    <Accordion>
                        <AccordionSummary expandIcon={<SvgIcon><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" /></SvgIcon>}>
                            <Typography sx={{ color: 'black' }}>Detail</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ border: '1px red', backgroundColor: '#e8fffefc', color: 'black' }}>
                            <Stack sx={{ border: '1px' }} direction="row" justifyContent="space-between">
                                <Typography >Contract Address</Typography>
                                <Typography >{nfts[0].owner}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography >Token ID</Typography>
                                <Typography >2</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography >Token Standard</Typography>
                                <Typography >ERC-721</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography >Chain</Typography>
                                <Typography >Ethereum</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography >Last Updated</Typography>
                                <Typography >1 hour ago</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography >Creator Earnings</Typography>
                                <Typography >3%</Typography>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>


                </Card>

            </Grid>
            <Grid marginLeft='15px' item Grid={7}>
                <Grid container direction='column' alignItem='flex-start' sx={{ maxWidth: '100%' }}>
                    <Typography sx={{ color: 'blue', paddingBottom: '20px' }}>NFT Creater</Typography>
                    <Typography variant='h3'>{nfts[0].name}</Typography>
                    <Typography gutterBottom>Owned By: <Link>0x7987HJ</Link> </Typography>
                    <Grid paddingTop='10px' paddingBottom='20px' container direction='row' justifyContent="space-around">
                        <Typography>{(token.id).toString()}</Typography>
                        <Typography>Views</Typography>
                        <Typography>Favorites</Typography>
                    </Grid>
                    <Grid container direction='column' sx={{ maxWidth: '100%' }}>
                        <Card sx={{ maxWidth: '100%' }}>
                            <CardHeader title='Buy NFT Here' />

                            <CardContent>
                                <Typography>current price</Typography>
                                <Typography>0.75 ETH</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">Buy NFT</Button>
                            </CardActions>
                        </Card>

                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )

}
export async function getServerSideProps(context) {
    // Fetch data from external API
    const d = context.query.id
    console.log('first :'+d)
    var bytes = CryptoJS.AES.decrypt(d, 'lsakdcd')
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    // Pass data to the page via props
    return {props:
        { token: decryptedData} 
    }
}
export default NFT