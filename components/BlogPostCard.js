import { alpha } from '@mui/material/styles'
import { Box, Card, Grid, Typography, CardContent, Avatar, Link, Button, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { fDate } from '../mock/formatTime';
import { fShortenNumber } from '../mock/formatNumber';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { ethers } from 'ethers';
var CryptoJS = require("crypto-js");
const BlogPostCard = ({ nft, index }) => {
    const [latestPost, setLatestPost] = useState(index === 4)
    const [latestPostLarge, setLatestPostLarge] = useState(index === 5 || index === 6)
    const [POST_INFO, setPOST_INFO] = useState([

        { number: 250000, icon: 'eva:eye-fill' },
        { number: 35000, icon: 'eva:share-fill' }
    ])
    useEffect(() => {
        // const a={id:nft.tokenId}
        console.log(JSON.stringify({id:nft.tokenId.toString()}))
        // console.log(CryptoJS.AES.encrypt(JSON.stringify({id:nft.tokenId}), 'lsakdcd').toString())
        const POST_INFO = [

            { number: 250000, icon: 'eva:eye-fill' },
            { number: 35000, icon: 'eva:share-fill' },
        ]
        setPOST_INFO(POST_INFO)
        const latestPostLarge = index === 4;
        const latestPost = index === 5 || index === 6;
        setLatestPost(latestPost)
        setLatestPostLarge(latestPostLarge)
    }, [])

    return (

        <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>

            <Card sx={{ position: 'relative' }}>
                <Box
                    component="div"

                    sx={{
                        position: 'relative',
                        paddingTop: 'calc(100% * 3 / 4)',
                        ...((latestPostLarge || latestPost) && {
                            pt: 'calc(100% * 4 / 3)',
                            '&:after': {
                                top: 0,
                                content: "''",
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            },
                        }),
                        ...(latestPostLarge && {
                            pt: {
                                xs: 'calc(100% * 4 / 3)',
                                sm: 'calc(100% * 3 / 4.66)',
                            },
                        }),
                    }}
                >
                    <Box
                        component="span" className="svg-color"
                        color="paper"
                        sx={{
                            width: 80,
                            backgroundColor: 'background.paper',
                            height: 36,
                            zIndex: 9,
                            bottom: -15,
                            mask: `url(/assets/icons/shape-avatar.svg) no-repeat center / contain`,
                            WebkitMask: `url("/assets/icons/shape-avatar.svg") no-repeat center / contain`,
                            display: 'inline-block',
                            position: 'absolute',
                            color: 'background.paper',
                            ...((latestPostLarge || latestPost) && { display: 'none' }),
                        }}

                    />

                    <Avatar
                        alt={nft.name}
                        src={nft.image}
                        sx={{
                            zIndex: 9,
                            width: 32,
                            height: 32,
                            position: 'absolute',
                            left: 24,
                            bottom: -17,
                            ...((latestPostLarge || latestPost) && {
                                zIndex: 9,
                                top: 24,
                                left: 24,
                                width: 40,
                                height: 40,
                            }),
                        }}
                    ></Avatar>

                    <Box
                        component="img"
                        alt={nft.name} src={nft.image} 
                        style={{
                            top: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                        }}
                    ></Box>

                </Box>
                <CardContent
                    sx={{
                        pt: 4,
                        ...((latestPostLarge || latestPost) && {
                            bottom: 0,
                            width: '100%',
                            position: 'absolute',
                        }),
                    }}
                >
                    <Typography gutterBottom variant="caption"
                        sx={{
                            color: 'text.disabled', display: 'block',
                            ...((latestPostLarge || latestPost) && {
                                color: 'common.white'
                            })
                        }}>
                        {nft.seller.slice(0, 6)}....{nft.seller.slice(38, 42)}
                    </Typography>
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',

                            color: 'gray',
                        }}
                    ><Tooltip title='ViewDetail' placement='right' arrow>
                        <Link
                            href={`/NFT?id=${CryptoJS.AES.encrypt(JSON.stringify({id:nft.tokenId.toString()}), 'lsakdcd').toString()}`}
                            color="inherit"
                            variant="subtitle2"
                            underline="hover"
                            sx={{

                                overflow: 'hidden',
                                WebkitLineClamp: 2,
                                display: '-webkit-box',
                                height: 30,
                                WebkitBoxOrient: 'vertical',
                                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                                ...((latestPostLarge || latestPost) && {
                                    color: 'common.white',
                                }),
                            }}
                        >
                            {nft.name.slice(0, 20)}
                            </Link></Tooltip>
                        <Typography variant='subtitle2' marginLeft='80px' color='black'
                            sx={{ ...(latestPostLarge && { typography: 'h5', height: 60,color:'white' }),
                            ...(latestPost&&{color:'white',marginLeft:'115px'})
                            
                        }}
                        >
                            {(ethers.utils.formatEther(nft.totalPrice)).slice(0,5)} Eth
                        </Typography>
                    </Box>
                    <Typography gutterBottom variant="caption"
                        sx={{
                            color: 'text.disabled', display: 'block',
                            ...((latestPostLarge || latestPost) && {
                                color: 'common.white',
                            }),
                        }}>
                        {nft.description.slice(0, 96)}...
                    </Typography>

                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                            marginTop: 1,
                            color: 'gray',
                            ...((latestPostLarge || latestPost) && {
                                paddingRight: '24px',
                            }),
                        }}
                    >
                        <Button variant="text" sx={{ marginRight: 'auto' }}>BuyNow</Button>
                        {POST_INFO.map((info, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ml: index === 0 ? 0 : 1.5,
                                    ...((latestPostLarge || latestPost) && {
                                        color: 'grey.500',
                                    }),
                                }}
                            >
                                <Box component={Icon} icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }}>
                                </Box>
                                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
                            </Box>
                        ))}
                    </Box>

                </CardContent>
            </Card>
        </Grid>

    )
}

export default BlogPostCard