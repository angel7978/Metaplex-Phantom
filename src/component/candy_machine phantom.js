import React, { useEffect, useMemo, useState } from "react";
import {
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useMetaplex } from "../provider/metaplex/useMetaplex";
import { PublicKey, Keypair } from "@solana/web3.js";
import { getMerkleProof, getMerkleRoot, sol, toBigNumber, toDateTime  } from '@metaplex-foundation/js';


export const CandyMachineP = ({ }) => {
    const { metaplex } = useMetaplex();
    const wallet = useWallet();

    // 7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ
    async function makeCollectionNft() {

        const { nft: collectionNft } = await metaplex.nfts().create({
            name: "Test Collection",
            uri: "https://example.com/path/to/some/json/metadata.json",
            sellerFeeBasisPoints: 111,
            isCollection: true,
            updateAuthority: metaplex.identity(),
        });

        console.log(collectionNft)
    }

    async function findCollectionNft() {
        const mintAddress = new PublicKey("DQVXiiGR48CYGFNw21masHZB9jA5i3Axa946WVYECDQs");

        const collectionNft = await metaplex
            .nfts()
            .findByMint({ mintAddress });

        console.log(collectionNft)
    }

    async function buildAllProgress(collectionName, collectionCount, sellerFee, collectionUri, symbol, prefixUri, sellStartDate) {
        console.log(wallet)
        console.log(collectionName)
        console.log(collectionCount)
        console.log(sellerFee)
        console.log(symbol)
        console.log(prefixUri)
        console.log(sellStartDate)
        console.log(metaplex.identity())


        const { nft: collectionNft } = await metaplex.nfts().create({
            name: collectionName,
            symbol: symbol,
            uri: collectionUri,
            sellerFeeBasisPoints: 0,
            isCollection: true,
            updateAuthority: metaplex.identity(),
        });
        // mainnet-beta 기준 약 -◎0.0119812

        console.log(collectionNft)

        const allowList = [
            metaplex.identity().publicKey.toBase58(),
        ];

        console.log(allowList);

        const { candyMachine } = await metaplex.candyMachines().create({
            itemsAvailable: toBigNumber(collectionCount),
            sellerFeeBasisPoints: sellerFee, // 3.33%
            collection: {
                address: new PublicKey(collectionNft.address), // collectionNft.address,
                updateAuthority: metaplex.identity(),
            },
            symbol: symbol,
            itemSettings: {
                type: 'configLines',
                prefixName: collectionName + ' #',
                nameLength: 4,
                prefixUri: prefixUri,
                uriLength: 9,
                isSequential: true,
            },
            groups: [
                {
                    label: "normal",
                    guards: {
                        solPayment: { amount: sol(0.1), destination: wallet.publicKey },
                        startDate: { date: toDateTime(sellStartDate) },
                    },
                },
                {
                    label: "owner",
                    guards: {
                        solPayment: { amount: sol(0), destination: wallet.publicKey },
                        allowList: {
                            merkleRoot: getMerkleRoot(allowList),
                        }
                    },
                },
            ],
        });
        // mainnet-beta 기준 약 -◎0.1297444

        let items = [];
        for (var i = 0; i < 10; i++) {
            items.push({ name: i.toString(), uri: i + '.json' })
        }
        await metaplex.candyMachines().insertItems({
            candyMachine,
            index: 0,
            items: items,
        });

        console.log(candyMachine)

        const mintingWallet = metaplex.identity().publicKey.toBytes();

        metaplex.candyMachines().callGuardRoute({
            candyMachine,
            guard: 'allowList',
            group: 'owner',
            settings: {
                path: 'proof',
                merkleProof: getMerkleProof(allowList, mintingWallet),
            },
        }).then(console.log);
    };

    async function findAuctionHouse(address) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(address) });

        console.log(auctionHouse);
    }

    async function listingAssets(auctionHouseAddress, mintAccount, price) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        console.log(auctionHouse);

        const ret = await metaplex
            .auctionHouse()
            .list({
                auctionHouse,                              // A model of the Auction House related to this listing
                mintAccount: new PublicKey(mintAccount), // The mint account to create a listing for, used to find the metadata
                price: sol(price)
            });

        /**
         * {
            "listing": {
                "model": "listing",
                "lazy": false,
                "auctionHouse": {
                    "model": "auctionHouse",
                    "address": "8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M",
                    "creatorAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "treasuryMint": {
                        "model": "mint",
                        "address": "So11111111111111111111111111111111111111112",
                        "mintAuthorityAddress": null,
                        "freezeAuthorityAddress": null,
                        "decimals": 9,
                        "supply": {
                            "basisPoints": "00",
                            "currency": {
                                "symbol": "SOL",
                                "decimals": 9,
                                "namespace": "spl-token"
                            }
                        },
                        "isWrappedSol": true,
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9,
                            "namespace": "spl-token"
                        }
                    },
                    "feeAccountAddress": "GdehSkR9JoU6FKheFzBEx4bZprfjx42rCvtyXFmv2pJu",
                    "treasuryAccountAddress": "CaY5c4t72wKyQ7cfQSaDf8bhqQTsxLAcKcJbdwfo8ynf",
                    "feeWithdrawalDestinationAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "treasuryWithdrawalDestinationAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "sellerFeeBasisPoints": 500,
                    "requiresSignOff": false,
                    "canChangeSalePrice": true,
                    "isNative": true,
                    "scopes": [],
                    "hasAuctioneer": false
                },
                "tradeStateAddress": "2JXNSMy94VwkdowxJ7HrjvnFqFTwriwLNoSosBfGAFFj",
                "bookkeeperAddress": "9h8mL1SKDRyJ85FXPWTuma3RWW2scMzmrqkT27vwimu8",
                "sellerAddress": "9h8mL1SKDRyJ85FXPWTuma3RWW2scMzmrqkT27vwimu8",
                "metadataAddress": "2gVx2HeoTVf39ahA8djGnc3d49G1TRydApiTpL29DUqm",
                "receiptAddress": "DTyVZeh1v5WpUrmsRuooQzDaUEyMx79p1RAYirRUT54T",
                "purchaseReceiptAddress": null,
                "price": {
                    "basisPoints": "00",
                    "currency": {
                        "symbol": "SOL",
                        "decimals": 9
                    }
                },
                "tokens": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "C4CAC",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "createdAt": "639abf10",
                "canceledAt": null,
                "asset": {
                    "model": "nft",
                    "updateAuthorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "json": {
                        "name": "Solana NFT #0000",
                        "description": "This is nft of Solana.",
                        "image": "https://.../test_nft_image.jpg",
                        "external_url": "https://market_place",
                        "attributes": [
                            {
                                "trait_type": "trait1",
                                "value": "value1"
                            },
                            {
                                "trait_type": "trait2",
                                "value": "value2"
                            }
                        ]
                    },
                    "jsonLoaded": true,
                    "name": "Solana Auction Test NFT #0",
                    "symbol": "SAT",
                    "uri": "https://.../test_collection/0.json",
                    "isMutable": true,
                    "primarySaleHappened": true,
                    "sellerFeeBasisPoints": 555,
                    "editionNonce": 255,
                    "creators": [
                        {
                            "address": "DHSFUAsQW4cunfChgvmn9hs3WLMh8CFThsUEH6uQyaVm",
                            "verified": true,
                            "share": 0
                        },
                        {
                            "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                            "verified": false,
                            "share": 100
                        }
                    ],
                    "tokenStandard": 0,
                    "collection": {
                        "verified": true,
                        "key": "8fCTGgRKXRU2Z4W3qg7SUnsDhj9WXMAr4ySZMbM6f3rA",
                        "address": "8fCTGgRKXRU2Z4W3qg7SUnsDhj9WXMAr4ySZMbM6f3rA"
                    },
                    "collectionDetails": null,
                    "uses": null,
                    "address": "9JQyZiE4sUJ2gFqX2wECtJapFSgxB8fxuGvTRGhHpv11",
                    "metadataAddress": "2gVx2HeoTVf39ahA8djGnc3d49G1TRydApiTpL29DUqm",
                    "mint": {
                        "model": "mint",
                        "address": "9JQyZiE4sUJ2gFqX2wECtJapFSgxB8fxuGvTRGhHpv11",
                        "mintAuthorityAddress": "CDNyR1Sn2cQYszFnS7p79MiExB3C1wRRuFxdUdjNuGPz",
                        "freezeAuthorityAddress": "CDNyR1Sn2cQYszFnS7p79MiExB3C1wRRuFxdUdjNuGPz",
                        "decimals": 0,
                        "supply": {
                            "basisPoints": "01",
                            "currency": {
                                "symbol": "C4CAC",
                                "decimals": 0,
                                "namespace": "spl-token"
                            }
                        },
                        "isWrappedSol": false,
                        "currency": {
                            "symbol": "C4CAC",
                            "decimals": 0,
                            "namespace": "spl-token"
                        }
                    },
                    "token": {
                        "model": "token",
                        "address": "BRGfuaF8hFLLYW94a9pMGVjMvHjnUuFdDEnqCbSQXtc9",
                        "isAssociatedToken": true,
                        "mintAddress": "9JQyZiE4sUJ2gFqX2wECtJapFSgxB8fxuGvTRGhHpv11",
                        "ownerAddress": "9h8mL1SKDRyJ85FXPWTuma3RWW2scMzmrqkT27vwimu8",
                        "amount": {
                            "basisPoints": "01",
                            "currency": {
                                "symbol": "C4CAC",
                                "decimals": 0,
                                "namespace": "spl-token"
                            }
                        },
                        "closeAuthorityAddress": null,
                        "delegateAddress": "HS2eL9WJbh7pA4i4veK3YDwhGLRjY3uKryvG1NbHRprj",
                        "delegateAmount": {
                            "basisPoints": "01",
                            "currency": {
                                "symbol": "C4CAC",
                                "decimals": 0,
                                "namespace": "spl-token"
                            }
                        },
                        "state": 1
                    },
                    "edition": {
                        "model": "nftEdition",
                        "isOriginal": true,
                        "address": "CDNyR1Sn2cQYszFnS7p79MiExB3C1wRRuFxdUdjNuGPz",
                        "supply": "00",
                        "maxSupply": "00"
                    }
                }
            },
            "response": {
                "signature": "4PxrJBvq4X2reYfSttbQxAqnSYDu8jsnk5aR1HK8PGjiSZ22w3Pc7EFwctbq9SqcAZ6Pgh3eq4BYVjVjrH78wKFx",
                "confirmResponse": {
                    "context": {
                        "apiVersion": "1.14.10",
                        "slot": 182229839
                    },
                    "value": {
                        "confirmationStatus": "confirmed",
                        "confirmations": 1,
                        "err": null,
                        "slot": 182229837,
                        "status": {
                            "Ok": null
                        }
                    }
                },
                "blockhash": "9uJnCf73dt2X4caCvYhZoGeeEiX2LgDWWpHK3hut7z38",
                "lastValidBlockHeight": 171955616
            },
            "sellerTradeState": "2JXNSMy94VwkdowxJ7HrjvnFqFTwriwLNoSosBfGAFFj",
            "freeSellerTradeState": "2JXNSMy94VwkdowxJ7HrjvnFqFTwriwLNoSosBfGAFFj",
            "tokenAccount": "BRGfuaF8hFLLYW94a9pMGVjMvHjnUuFdDEnqCbSQXtc9",
            "metadata": "2gVx2HeoTVf39ahA8djGnc3d49G1TRydApiTpL29DUqm",
            "seller": "9h8mL1SKDRyJ85FXPWTuma3RWW2scMzmrqkT27vwimu8",
            "receipt": "DTyVZeh1v5WpUrmsRuooQzDaUEyMx79p1RAYirRUT54T",
            "bookkeeper": "9h8mL1SKDRyJ85FXPWTuma3RWW2scMzmrqkT27vwimu8",
            "price": {
                "basisPoints": "00",
                "currency": {
                    "symbol": "SOL",
                    "decimals": 9
                }
            },
            "tokens": {
                "basisPoints": "01",
                "currency": {
                    "symbol": "Token",
                    "decimals": 0,
                    "namespace": "spl-token"
                }
            }
        }
        */
        console.log(ret);
    }


    async function cancelListing(auctionHouseAddress, listingReceipt) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        const listing = await metaplex
            .auctionHouse()
            .findListingByReceipt({
                receiptAddress: new PublicKey(listingReceipt),
                auctionHouse
            }) // we will see how to fetch listings in the coming pages

        console.log(listing);

        const cancelListingResponse = await metaplex
            .auctionHouse()
            .cancelListing({
                auctionHouse,            // The Auction House in which to cancel listing
                listing: listing,        // The listing to cancel
            });

        console.log(cancelListingResponse);
    }

    async function buyAssets(auctionHouseAddress, listingReceipt) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        const listing = await metaplex
            .auctionHouse()
            .findListingByReceipt({
                receiptAddress: new PublicKey(listingReceipt),
                auctionHouse
            }) // we will see how to fetch listings in the coming pages

        console.log(listing);


        const directBuyResponse = await metaplex
            .auctionHouse()
            .buy({
                auctionHouse,                   // The Auction House in which to create a Bid and execute a Sale
                listing: listing,               // The Listing that is used in the sale, we only need a
                // subset of the `Listing` model but we need enough information
                // regarding its settings to know how to execute the sale.
            });

        console.log(directBuyResponse);

    }

    return (
        <div className="containr">
            <WalletMultiButton />
            <button onClick={makeCollectionNft}>makeCollectionNft</button>
            <button onClick={findCollectionNft}>findCollectionNft</button>
            <button onClick={() => buildAllProgress("Solana NFT3", 20, 555, "https://", "C4CSNFT3", 'https://url', "2022-10-17T16:00:00Z")}>buildAllProgress</button>
            <button onClick={() => findAuctionHouse("8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M")}>findAuctionHouse</button>
            <button onClick={() => listingAssets("8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M", "3Eji5jWAFvCx82RF5UXARTcFJSUFnYC589ewJwFKHdNq", 1.5)}>listingAssets</button>
            <button onClick={() => cancelListing("8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M", "5eq5sZSkEH7G5GSpZWk2gLZhCB7c6iWYFr5AGjKXL7E8")}>cancelListing</button>
            <button onClick={() => buyAssets("2BZSJe6rZz3NDXzhcz9woLi2ZULpkaYHF2nS3RiDQVrg", "CVgdvioavf7qumygMTw4g3xfQPWUFGsQFRRhWj4iAKQM")}>buyAssets</button>
        </div>
    )
}