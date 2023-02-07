import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { Box, Button, CircularProgress, LinearProgress, TextField } from '@mui/material'
import { NFTStorage, Blob } from 'nft.storage'
import { useRouter } from 'next/router'

const createNFT = ({nft, marketPlace, account,setAccount}) => {

    const [provider, setProvider] = useState(null)
    const [nfts, setNfts] = useState([])
    const [nftName, setNftName] = useState()
    const [description, setDescription] = useState()
    const [nftCost, setNftCost] = useState()
    const [image1, setImage1] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageF, setImageF] = useState()
    const [progressValue, setProgressValue] = useState(0)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        loadBlockChainData()
    }, [])
    const router = useRouter()
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage1(i);
            setCreateObjectURL(URL.createObjectURL(i));

        }
    }
    const uploadToServer = async () => {
        const body = new FormData()
        body.append("file", image);

        const response = await fetch("/api/imageInfo", {
            method: "POST",
            body
        })
        let res = await response.json()
        console.log(res.oldPath)
        if (res.success) {
            try {
            } catch (error) {
                console.log('image upload error' + error)
            }
        }
    }
    const onHandleChange = (e) => {
        if (e.target.name == 'nftName') {
            setNftName(e.target.value)
        }
        if (e.target.name == 'description') {
            setDescription(e.target.value)
        }
        if (e.target.name == 'nftCost') {
            setNftCost(e.target.value)
        }
        if (e.target.name == 'nftFile') {
            setImageF(e.target.files[0])
        }
    }
    const storeNFT = async (image) => {
        const imagePath = await fileFromPath(image)
        const nftstorage = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU5Y0FlNTJBRDFBQUQzMjAwZGI3ZDdjMTdkNkExNkQzQ2FFZUVBMDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzgxMTcwNzQ1NCwibmFtZSI6Im16In0.iKi8goXosKfRf56Xbs4hapWGO-0y_24xn4gKlCam8Qg' })
        if (nftCost && nftName && description && imagePath) {
            // const result =  await nftstorage.storeBlob(imagePath)
            const result = await nftstorage.store({ cost: nftCost, name: nftName, description: description, image: imagePath })
            setProgressValue(30)
            return result
        }
        return
    }
    const fileFromPath = async (filePath) => {
        const type = filePath.type
        const name = filePath.name
        setProgressValue(20)
        return new Blob([filePath], { type: type })
    }
    const uploadToIPFS = async () => {
        if (typeof imageF !== 'undefined') {
            try {
                const result = await storeNFT(imageF)
                // console.log(result.ipnft)
                setProgressValue(40)
                return result.ipnft
                // console.log(result)
                // console.log(result.data.name)
                // console.log(result.data.cost)
                // console.log(result.data.description)
                // console.log(result.data.image)
                // console.log(result.data.image.pathname.slice(2,61))
                // console.log(JSON.stringify(result))
                // const uri = {image:`${result}.ipfs.nftstorage.link`,price:nftCost , name:nftName , description:description}
                // console.log(JSON.stringify(uri))
                // console.log(uri)
            } catch (error) {
                console.log('image upload error' + error)
            }
        }
    }
    const loadBlockChainData = async () => {
        // const fetchdata = await fetch('https://bafyreidjdunaxnipj3qk3xwxafla7m4hnsaqj7ku2dzims2rqttyl6twui.ipfs.dweb.link/metadata.json')
        // const result = await fetchdata.json()
        // console.log(result.cost)
        // console.log(result.image)
        // console.log(result.name)
        const c=2
        const listingPrice = ethers.utils.parseEther(c.toString())
        console.log(listingPrice)
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        if (account) {
            setAccount(account)
        }

    }
    const handleSubmit = async () => {
        if(nftName==null&&nftCost==null&&description==null){
            return
        }
        let ipnft =await uploadToIPFS()
        setLoading(true)
        setProgressValue(50)
        // const ipnft = 'bafyreihqoe7dchn242rmzvdxjoh7hp53l2g4orobkursdqazyavrgzhdgy'
        const uri = `https://${ipnft}.ipfs.dweb.link/metadata.json`
        // console.log(ipnft)
      console.log(uri)
        const uriMint = await nft.mint(uri)
        await uriMint.wait()
        setProgressValue(70)
        const id = nft.tokenCount()
        const approve = await nft.setApprovalForAll(marketPlace.address, true)
        await approve.wait()
        setProgressValue(90)
        //add nft to marketPlace
        // const c = 0.2
        const listingPrice = ethers.utils.parseEther(nftCost.toString())
        // console.log(nftCost)
        const listItem = await marketPlace.makeItem(nft.address, id, listingPrice)
        await listItem.wait()
        setProgressValue(100)
        setLoading(false)
        setNftCost(null)
        setNftName(null)
        setDescription(null)
        router.push('/myNFT')
    }

    return (
        <div>
            <Box component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '70ch' },
                }}
                noValidate
                autoComplete="off">
                <LinearProgress variant='determinate' value={progressValue} />
                {image1 && <Box component='img' src={createObjectURL} sx={{ width: 200, height: 200 }}></Box>}
                <div>
                    <TextField
                        onChange={onHandleChange}
                        name="nftName"
                        value={nftName}
                        required
                        id="outlined-password-input"
                        label="NAME"
                        type="string"
                        autoComplete=""
                        disabled={loading}
                    />
                    <TextField
                        onChange={onHandleChange}
                        name="nftFile"
                        required
                        id="outlined-password-input"
                        label=""
                        type="file"
                        autoComplete=""
                        disabled={loading}
                    />


                    <TextField
                        onChange={onHandleChange}
                        name="description"
                        value={description}
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        disabled={loading}
                    />
                    <TextField
                        onChange={onHandleChange}
                        name="nftCost"
                        value={nftCost}
                        required
                        id="outlined-password-input"
                        label="Ether"
                        type="Number"
                        autoComplete=""
                        disabled={loading}
                    />

                </div>
                <br />
                <Button onClick={handleSubmit} variant="outlined" disabled={loading}>
                    {!loading?<>Create NFT</>:<>NFT Creating<CircularProgress/></>}
                    </Button>
            </Box>
        </div>
    )
}

export default createNFT