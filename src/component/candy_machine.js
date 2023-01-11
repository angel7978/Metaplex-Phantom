import React, { useEffect, useState } from "react";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { bundlrStorage, getMerkleProof, getMerkleRoot, keypairIdentity, Metaplex, sol, toBigNumber, toDateTime } from '@metaplex-foundation/js';
import { binary_to_base58 } from 'base58-js'


export const CandyMachine = ({ }) => {
    //const rpc = "https://solana-mainnet.g.alchemy.com/v2/api_key"; // RPC URL for connecting with a Solana node
    //const connection = new Connection(rpc, "confirmed"); // confirming the connection

    const connection = new Connection(clusterApiUrl("devnet")); // confirming the connection
    let metaplex = Metaplex.make(connection)

    const masterWallet = Keypair.generate();
    const creatorWallet = Keypair.generate();
    const user1Wallet = Keypair.generate();
    const user2Wallet = Keypair.generate();

    // 7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ
    async function makeCollectionNft() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet));

        /**
         * 꽤 자주 아래와 같은 에러가 뜸
         * Uncaught (in promise) MetaplexError: Account Not Found
            >> Source: SDK
            >> Problem: The account of type [MintAccount] was not found at the provided address [yPA5fwSKwCXutDijdNRxa5xaMHHY7TeuR68ksntyjNL].
            >> Solution: Ensure the provided address is correct and that an account exists at this address.

                at assertAccountExists (Account.mjs:24:1)
                at Account.mjs:17:1
                at Object.handle (findNftByMint.mjs:65:1)
                at async Disposable.run (Disposable.mjs:18:1)
                at async Object.handle (createNft.mjs:66:1)
                at async Disposable.run (Disposable.mjs:18:1)
                at async makeCollectionNft (candy_machine.js:26:1)
        */
        const { nft: collectionNft } = await creatorMetaplex.nfts().create({
            name: "My Collection NFT",
            uri: "https://example.com/path/to/some/json/metadata.json",
            sellerFeeBasisPoints: 0,
            isCollection: true,
            updateAuthority: creatorMetaplex.identity(),
        });
        // devnet 기준 약 10s ~ 15s
        // 4 SOL -> 3.9760376 SOL 
        // 3.9760376 SOL -> 3.8681668 SOL
        // 2 SOL -> 1.9880188 SOL

        /**
         * 성공 시 data
         * {
            "model": "nft",
            "updateAuthorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "json": null,
            "jsonLoaded": true,
            "name": "My Collection NFT",
            "symbol": "",
            "uri": "https://example.com/path/to/some/json/metadata.json",
            "isMutable": true,
            "primarySaleHappened": false,
            "sellerFeeBasisPoints": 0,
            "editionNonce": 255,
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": true,
                    "share": 100
                }
            ],
            "tokenStandard": 0,
            "collection": null,
            "collectionDetails": {
                "version": "V1",
                "size": "00"
            },
            "uses": null,
            "address": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
            "metadataAddress": "59LZPdjZ1sgsSfvTV2a2Rw6Hg6V76gkQvqoyt4gy197r",
            "mint": {
                "model": "mint",
                "address": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
                "mintAuthorityAddress": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "freezeAuthorityAddress": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "decimals": 0,
                "supply": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "isWrappedSol": false,
                "currency": {
                    "symbol": "Token",
                    "decimals": 0,
                    "namespace": "spl-token"
                }
            },
            "token": {
                "model": "token",
                "address": "Ev4GLYcVq1rtwG9vCrhxVfTAB1n3F7AbEVdfHckkKioS",
                "isAssociatedToken": true,
                "mintAddress": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
                "ownerAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "amount": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "closeAuthorityAddress": null,
                "delegateAddress": null,
                "delegateAmount": {
                    "basisPoints": "00",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "state": 1
            },
            "edition": {
                "model": "nftEdition",
                "isOriginal": true,
                "address": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "supply": "00",
                "maxSupply": "00"
            }
        }
        * */
        console.log(collectionNft)

        //// Pass the Collection NFT and its authority in the settings.
        //const candyMachineSettings = {
        //    collection: {
        //        address: collectionNft.address,
        //        updateAuthority: masterWallet,
        //    },
        //};
    }

    async function findCollectionNft() {
        let creatorMetaplex = metaplex.use(keypairIdentity(masterWallet));

        const mintAddress = new PublicKey("DQVXiiGR48CYGFNw21masHZB9jA5i3Axa946WVYECDQs");

        const collectionNft = await creatorMetaplex
            .nfts()
            .findByMint({ mintAddress });


        /**
         * {
            "model": "nft",
            "updateAuthorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "json": null,
            "jsonLoaded": true,
            "name": "My Collection NFT",
            "symbol": "",
            "uri": "https://example.com/path/to/some/json/metadata.json",
            "isMutable": true,
            "primarySaleHappened": false,
            "sellerFeeBasisPoints": 0,
            "editionNonce": 255,
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": true,
                    "share": 100
                }
            ],
            "tokenStandard": 0,
            "collection": null,
            "collectionDetails": {
                "version": "V1",
                "size": "00"
            },
            "uses": null,
            "address": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
            "metadataAddress": "59LZPdjZ1sgsSfvTV2a2Rw6Hg6V76gkQvqoyt4gy197r",
            "mint": {
                "model": "mint",
                "address": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
                "mintAuthorityAddress": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "freezeAuthorityAddress": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "decimals": 0,
                "supply": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "isWrappedSol": false,
                "currency": {
                    "symbol": "Token",
                    "decimals": 0,
                    "namespace": "spl-token"
                }
            },
            "edition": {
                "model": "nftEdition",
                "isOriginal": true,
                "address": "8ebGvx2YmF5DS1ec91zpSrEqBgM3hXixjxFH96VjHjCN",
                "supply": "00",
                "maxSupply": "00"
            }
        }
         * */
        console.log(collectionNft);

    }

    // AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr
    async function makeCandyMachine() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet));

        // Create the Candy Machine.
        /** 
         * 아래 에러 자주 뜸
         * Uncaught (in promise) MetaplexError: Account Not Found
            >> Source: SDK
            >> Problem: The account of type [CandyMachine] was not found at the provided address [5knbRaXgG7vwXdUcHuN5X2qCHpo8pyDBLi75FqX4WU5n].
            >> Solution: Ensure the provided address is correct and that an account exists at this address.

                at assertAccountExists (Account.mjs:24:1)
                at Object.handle (findCandyMachineByAddress.mjs:57:1)
                at async Disposable.run (Disposable.mjs:18:1)
                at async Object.handle (createCandyMachine.mjs:64:1)
                at async Disposable.run (Disposable.mjs:18:1)
                at async makeCandyMachine (candy_machine.js:152:1)
         * */
        const { candyMachine } = await creatorMetaplex.candyMachines().create({
            itemsAvailable: toBigNumber(5),
            sellerFeeBasisPoints: 333, // 3.33%
            collection: {
                address: new PublicKey('78jUpTMjxVjT6uVyRk9LS2EqeN2nUmW2zPHFMpQN423i'), // collectionNft.address,
                updateAuthority: creatorMetaplex.identity(),
            },
        });
        // devnet 기준 약 10s~15s
        // 1.9880188 SOL -> 1.93480744 SOL

        /**
         * 성공 시 반환
         * {
            "model": "candyMachine",
            "address": "AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr",
            "accountInfo": {
                "executable": false,
                "owner": "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
                "lamports": {
                    "basisPoints": "e69010",
                    "currency": {
                        "symbol": "SOL",
                        "decimals": 9
                    }
                },
                "rentEpoch": 0
            },
            "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "mintAuthorityAddress": "2KLJyeCHrMRmhTsdWiziS4wANeJ5hFdUE3VLTZ9m8DM6",
            "collectionMintAddress": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
            "symbol": "",
            "sellerFeeBasisPoints": 333,
            "isMutable": true,
            "maxEditionSupply": "00",
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": false,
                    "percentageShare": 100,
                    "share": 100
                }
            ],
            "items": [],
            "itemsAvailable": "05",
            "itemsMinted": "00",
            "itemsRemaining": "05",
            "itemsLoaded": 0,
            "isFullyLoaded": false,
            "itemSettings": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false,
                "type": "configLines"
            },
            "featureFlags": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
            "candyGuard": {
                "model": "candyGuard",
                "address": "2KLJyeCHrMRmhTsdWiziS4wANeJ5hFdUE3VLTZ9m8DM6",
                "accountInfo": {
                    "executable": false,
                    "owner": "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
                    "lamports": {
                        "basisPoints": "169ef0",
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9
                        }
                    },
                    "rentEpoch": 0
                },
                "baseAddress": "AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr",
                "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "guards": {
                    "botTax": null,
                    "solPayment": null,
                    "tokenPayment": null,
                    "startDate": null,
                    "thirdPartySigner": null,
                    "tokenGate": null,
                    "gatekeeper": null,
                    "endDate": null,
                    "allowList": null,
                    "mintLimit": null,
                    "nftPayment": null,
                    "redeemedAmount": null,
                    "addressGate": null,
                    "nftGate": null,
                    "nftBurn": null,
                    "tokenBurn": null,
                    "freezeSolPayment": null,
                    "freezeTokenPayment": null
                },
                "groups": []
            }
        }
         * */
        console.log(candyMachine);

        /**
         * candyMachine.address;         // The public key of the Candy Machine account.
            candyMachine.itemsAvailable;  // Number of NFTs available.
            candyMachine.itemsMinted;     // Number of NFTs minted.
            candyMachine.itemsRemaining;  // Number of NFTs left to mint.
            candyMachine.items[0].index;  // The index of the first loaded item.
            candyMachine.items[0].name;   // The name of the first loaded item (with prefix).
            candyMachine.items[0].uri;    // The URI of the first loaded item (with prefix).
            candyMachine.items[0].minted; // Whether the first item has been minted.
         */
    }

    async function findCandyMachine() {
        let creatorMetaplex = metaplex.use(keypairIdentity(masterWallet));

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("B8JYM4xF39HLcYefMC8pwtEeANXh546qpHTDJFAY8s8B") });

        /**
         * {
            "model": "candyMachine",
            "address": "AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr",
            "accountInfo": {
                "executable": false,
                "owner": "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
                "lamports": {
                    "basisPoints": "e69010",
                    "currency": {
                        "symbol": "SOL",
                        "decimals": 9
                    }
                },
                "rentEpoch": 0
            },
            "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "mintAuthorityAddress": "2KLJyeCHrMRmhTsdWiziS4wANeJ5hFdUE3VLTZ9m8DM6",
            "collectionMintAddress": "7PbR75Tdx4ywDwSxQfamn1dtFLJdDBRgrhAdSWYSr2LQ",
            "symbol": "",
            "sellerFeeBasisPoints": 333,
            "isMutable": true,
            "maxEditionSupply": "00",
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": false,
                    "percentageShare": 100,
                    "share": 100
                }
            ],
            "items": [],
            "itemsAvailable": "05",
            "itemsMinted": "00",
            "itemsRemaining": "05",
            "itemsLoaded": 0,
            "isFullyLoaded": false,
            "itemSettings": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false,
                "type": "configLines"
            },
            "featureFlags": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
            "candyGuard": {
                "model": "candyGuard",
                "address": "2KLJyeCHrMRmhTsdWiziS4wANeJ5hFdUE3VLTZ9m8DM6",
                "accountInfo": {
                    "executable": false,
                    "owner": "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
                    "lamports": {
                        "basisPoints": "169ef0",
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9
                        }
                    },
                    "rentEpoch": 0
                },
                "baseAddress": "AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr",
                "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "guards": {
                    "botTax": null,
                    "solPayment": null,
                    "tokenPayment": null,
                    "startDate": null,
                    "thirdPartySigner": null,
                    "tokenGate": null,
                    "gatekeeper": null,
                    "endDate": null,
                    "allowList": null,
                    "mintLimit": null,
                    "nftPayment": null,
                    "redeemedAmount": null,
                    "addressGate": null,
                    "nftGate": null,
                    "nftBurn": null,
                    "tokenBurn": null,
                    "freezeSolPayment": null,
                    "freezeTokenPayment": null
                },
                "groups": []
            }
        }
         * */
        console.log(candyMachine);
    }

    async function updateCandyMachine() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("HVzNU3h2VMjatbFck55VAi3rXBhTRpqzkm4tJMLqXdFq") });

        console.log(candyMachine);

        await creatorMetaplex.candyMachines().update({
            candyMachine,
            symbol: 'C4CSOL',
            sellerFeeBasisPoints: 100,
            // itemsAvailable: 10,
            itemSettings: {
                type: 'configLines',
                prefixName: 'Solana NFT #',
                nameLength: 4,
                prefixUri: 'https://.../test_collection/',
                uriLength: 9,
                isSequential: true,
            },
        });
        // 1.93480244 SOL -> 1.93479744 SOL
        // 1.93479744 SOL -> 1.93479244 SOL

        const updatedCandyMachine = await creatorMetaplex
            .candyMachines()
            .refresh(candyMachine);

        /**
         *
         * {
            ...
            "symbol": "C4CSOL",
            "sellerFeeBasisPoints": 100,
            "isMutable": true,
            "maxEditionSupply": "00",
            ...
            "itemSettings": {
                "prefixName": "Solana NFT #",
                "nameLength": 4,
                "prefixUri": "https://.../test_collection/",
                "uriLength": 9,
                "isSequential": true,
                "type": "configLines"
            },
            ...
        }
         * */
        console.log(updatedCandyMachine);
    }

    async function insertCandyMachine() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75") });

        console.log(candyMachine);

        // item capa가 5개 짜리 캔디머신이라 더 이상 추가가 안 됨 (아래 에러)
        // Uncaught (in promise) MetaplexError: Candy Machine V3 > Candy Machine Cannot Add Amount
        // 웃긴건 수정도 안 됨 (해당 인덱스에 추가 한 뒤 기존 아이템을 삭제하는 방식으로 보여짐, 그래서 아래 에러가 뜸)
        // Uncaught (in promise) MetaplexError: Candy Machine V3 > Candy Machine Is Full
        // 캔디머신의 아이템 capa는 넉넉하게 할 것

        var items = []
        for (var i = 0; i < 10; i++) {
            items.push({ name: i.toString(), uri: i + '.json' })
        }

        for (var i = 0; i < 100; i++) {
            console.log(i);
            creatorMetaplex.candyMachines().insertItems({
                candyMachine,
                index: i,
                items: [{ name: i.toString(), uri: i + '.json' }],
            });
        }


        // 1.93478744 SOL -> 1.93478244 SOL -> 1.93477744 SOL (3개)


        const updatedCandyMachine = await creatorMetaplex
            .candyMachines()
            .refresh(candyMachine);

        /**
         * 
         * {
            ...
            "items": [
                {
                    "index": 0,
                    "minted": false,
                    "name": "Solana NFT #1",
                    "uri": "https://.../test_collection/1.json"
                },
                {
                    "index": 1,
                    "minted": false,
                    "name": "Solana NFT #2",
                    "uri": "https://.../test_collection/2.json"
                },
                {
                    "index": 2,
                    "minted": false,
                    "name": "Solana NFT #3",
                    "uri": "https://.../test_collection/3.json"
                }
            ],
            ...
        }
         * */
        console.log(updatedCandyMachine);
    }

    async function unwrapCandyGuard() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("AGepiSYs9jEPmhgoSx7vSDumwHHFAUY1zc1cUHjr3PAr") });

        console.log(candyMachine);


        await creatorMetaplex.candyMachines().unwrapCandyGuard({
            candyMachine: candyMachine.address,
            candyGuard: candyMachine.candyGuard.address,
        });

        const updatedCandyMachine = await creatorMetaplex
            .candyMachines()
            .refresh(candyMachine);

        /**
         * {
            ...
            "candyGuard": null
        }
         * */
        console.log(updatedCandyMachine);
    }

    async function wrapCandyGuard() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("HVzNU3h2VMjatbFck55VAi3rXBhTRpqzkm4tJMLqXdFq") });

        console.log(candyMachine);

        const { candyGuard } = await creatorMetaplex.candyMachines().createCandyGuard({
            guards: {
                botTax: { lamports: sol(0.01), lastInstruction: false },
                solPayment: { amount: sol(0.1), destination: new PublicKey("6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A") },
                startDate: { date: toDateTime("2022-10-17T16:00:00Z") },
            },
        });

        console.log(candyGuard);

        await creatorMetaplex.candyMachines().wrapCandyGuard({
            candyMachine: candyMachine.address,
            candyGuard: candyGuard.address,
        });
        // 위에 두 작업 다 해서 1.93477744 SOL -> 1.93288824 SOL

        const updatedCandyMachine = await creatorMetaplex
            .candyMachines()
            .refresh(candyMachine);

        /**
         * 
         * {
            ...
            "candyGuard": {
                "model": "candyGuard",
                "address": "CP89o9NzzJn4Y777ZrBrdQhuMARaNVRVgDr5FTJxqWGd",
                "accountInfo": {
                    "executable": false,
                    "owner": "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
                    "lamports": {
                        "basisPoints": "1caca0",
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9
                        }
                    },
                    "rentEpoch": 0
                },
                "baseAddress": "7g2AKGwupUrRNtRyaDhZqWb5vfRH3EE16GMHr1WnRT6A",
                "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "guards": {
                    "botTax": {
                        "lamports": {
                            "basisPoints": "989680",
                            "currency": {
                                "symbol": "SOL",
                                "decimals": 9
                            }
                        },
                        "lastInstruction": false
                    },
                    "solPayment": {
                        "lamports": "05f5e100",
                        "destination": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                        "amount": {
                            "basisPoints": "05f5e100",
                            "currency": {
                                "symbol": "SOL",
                                "decimals": 9
                            }
                        }
                    },
                    "tokenPayment": null,
                    "startDate": {
                        "date": "634d7c00"
                    },
                    "thirdPartySigner": null,
                    "tokenGate": null,
                    "gatekeeper": null,
                    "endDate": null,
                    "allowList": null,
                    "mintLimit": null,
                    "nftPayment": null,
                    "redeemedAmount": null,
                    "addressGate": null,
                    "nftGate": null,
                    "nftBurn": null,
                    "tokenBurn": null,
                    "freezeSolPayment": null,
                    "freezeTokenPayment": null
                },
                "groups": []
            }
        }
         * */
        console.log(updatedCandyMachine);
    }

    async function updateCandyGuardGroup() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75") });

        console.log(candyMachine);
        const allowList = [
            creatorWallet.publicKey.toString(),
        ];

        await creatorMetaplex.candyMachines().update({
            candyMachine,
            groups: [
                {
                    label: "normal",
                    guards: {
                        solPayment: { amount: sol(0.1), destination: new PublicKey("6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A") },
                        startDate: { date: toDateTime("2022-10-18T16:00:00Z") },
                    },
                },
                {
                    label: "owner",
                    guards: {
                        solPayment: { amount: sol(0), destination: new PublicKey("6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A") },
                        allowList: {
                            merkleRoot: getMerkleRoot(allowList),
                        }
                    },
                },
            ],
        });
        // 

        const updatedCandyMachine = await creatorMetaplex
            .candyMachines()
            .refresh(candyMachine);

        /**
         *
         * {
            ...
            "candyGuard": {
                "model": "candyGuard",
                "address": "59yD6sZc4kuGnvRBKdM35wY4qrVBBNrpyHW9UgbYbmp5",
                "accountInfo": {
                    "executable": false,
                    "owner": "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
                    "lamports": {
                        "basisPoints": "274b60",
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9
                        }
                    },
                    "rentEpoch": 0
                },
                "baseAddress": "C4gnEmXriQFreinPGB2B1nyWa4ZizvSmiB5jRsSvJRRb",
                "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "guards": {
                    "botTax": {
                        "lamports": {
                            "basisPoints": "0f4240",
                            "currency": {
                                "symbol": "SOL",
                                "decimals": 9
                            }
                        },
                        "lastInstruction": true
                    },
                    "solPayment": null,
                    "tokenPayment": null,
                    "startDate": null,
                    "thirdPartySigner": null,
                    "tokenGate": null,
                    "gatekeeper": null,
                    "endDate": null,
                    "allowList": null,
                    "mintLimit": null,
                    "nftPayment": null,
                    "redeemedAmount": null,
                    "addressGate": null,
                    "nftGate": null,
                    "nftBurn": null,
                    "tokenBurn": null,
                    "freezeSolPayment": null,
                    "freezeTokenPayment": null
                },
                "groups": [
                    {
                        "label": "normal",
                        "guards": {
                            "botTax": null,
                            "solPayment": {
                                "lamports": "05f5e100",
                                "destination": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                                "amount": {
                                    "basisPoints": "05f5e100",
                                    "currency": {
                                        "symbol": "SOL",
                                        "decimals": 9
                                    }
                                }
                            },
                            "tokenPayment": null,
                            "startDate": {
                                "date": "634ecd80"
                            },
                            "thirdPartySigner": null,
                            "tokenGate": null,
                            "gatekeeper": null,
                            "endDate": null,
                            "allowList": null,
                            "mintLimit": null,
                            "nftPayment": null,
                            "redeemedAmount": null,
                            "addressGate": null,
                            "nftGate": null,
                            "nftBurn": null,
                            "tokenBurn": null,
                            "freezeSolPayment": null,
                            "freezeTokenPayment": null
                        }
                    },
                    {
                        "label": "owner",
                        "guards": {
                            "botTax": null,
                            "solPayment": {
                                "lamports": "00",
                                "destination": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                                "amount": {
                                    "basisPoints": "00",
                                    "currency": {
                                        "symbol": "SOL",
                                        "decimals": 9
                                    }
                                }
                            },
                            "tokenPayment": null,
                            "startDate": null,
                            "thirdPartySigner": null,
                            "tokenGate": null,
                            "gatekeeper": null,
                            "endDate": null,
                            "allowList": {
                                "merkleRoot": {
                                    "0": 117,
                                    "1": 91,
                                    "2": 155,
                                    "3": 103,
                                    "4": 56,
                                    "5": 53,
                                    "6": 42,
                                    "7": 254,
                                    "8": 47,
                                    "9": 188,
                                    "10": 24,
                                    "11": 93,
                                    "12": 24,
                                    "13": 9,
                                    "14": 100,
                                    "15": 129,
                                    "16": 215,
                                    "17": 98,
                                    "18": 9,
                                    "19": 146,
                                    "20": 161,
                                    "21": 146,
                                    "22": 202,
                                    "23": 251,
                                    "24": 162,
                                    "25": 251,
                                    "26": 133,
                                    "27": 11,
                                    "28": 172,
                                    "29": 237,
                                    "30": 132,
                                    "31": 21
                                }
                            },
                            "mintLimit": null,
                            "nftPayment": null,
                            "redeemedAmount": null,
                            "addressGate": null,
                            "nftGate": null,
                            "nftBurn": null,
                            "tokenBurn": null,
                            "freezeSolPayment": null,
                            "freezeTokenPayment": null
                        }
                    }
                ]
            }
        }
         * */
        console.log(updatedCandyMachine);
    }

    async function mintNft() {
        let user1Metaplex = metaplex.use(keypairIdentity(user1Wallet));

        const candyMachine = await user1Metaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("HVzNU3h2VMjatbFck55VAi3rXBhTRpqzkm4tJMLqXdFq") });

        console.log(candyMachine);

        user1Metaplex.candyMachines().mint({
            candyMachine,
            collectionUpdateAuthority: creatorWallet.publicKey,
        }).then(console.log)

    }

    async function mintNftByOwner() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet));

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("HVzNU3h2VMjatbFck55VAi3rXBhTRpqzkm4tJMLqXdFq") });

        console.log(candyMachine);

        creatorMetaplex.candyMachines().mint(
            {
                candyMachine,
                collectionUpdateAuthority: creatorWallet.publicKey,
                group: "owner", // allowList 검증을 위해 callGuardRoute 선 호출 필요
                owner: user2Wallet.publicKey,
            },
            {
                payer: creatorWallet,
            }).then(console.log)
    }

    async function proofAllowListToGuard() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet))
            .use(bundlrStorage());

        const allowList = [
            new PublicKey(creatorWallet.publicKey).toString(),
        ];
        const mintingWallet = creatorMetaplex.identity().publicKey.toBase58();

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey("Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75") });

        console.log(candyMachine);

        // 한 번만 하면 됨
        creatorMetaplex.candyMachines().callGuardRoute({
            candyMachine,
            guard: 'allowList',
            group: 'owner',
            settings: {
                path: 'proof',
                merkleProof: getMerkleProof(allowList, mintingWallet),
            },
        }).then(console.log);
    }

    // collection : FMZP4ovNTMEprcyyNpeTzurXr5yJKqpcLxGNQhhDWcse
    // candy machine : Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75
    async function buildAllProgress(wallet, collectionName, collectionCount, sellerFee, collectionUri, symbol, prefixUri, sellStartDate) {
        let creatorMetaplex = metaplex.use(keypairIdentity(wallet));

        console.log(wallet)
        console.log(collectionName)
        console.log(collectionCount)
        console.log(sellerFee)
        console.log(symbol)
        console.log(prefixUri)
        console.log(sellStartDate)

        const { nft: collectionNft } = await creatorMetaplex.nfts().create({
            name: collectionName,
            symbol: symbol,
            uri: collectionUri,
            sellerFeeBasisPoints: 0,
            isCollection: true,
            tokenOwner: creatorWallet.publicKey,
            updateAuthority: creatorMetaplex.identity(),
        });
        // mainnet-beta 기준 약 -◎0.0119812


        /**
         * {
            "model": "nft",
            "updateAuthorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "json": null,
            "jsonLoaded": true,
            "name": "Solana NFT2",
            "symbol": "",
            "uri": "",
            "isMutable": true,
            "primarySaleHappened": false,
            "sellerFeeBasisPoints": 0,
            "editionNonce": 255,
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": true,
                    "share": 100
                }
            ],
            "tokenStandard": 0,
            "collection": null,
            "collectionDetails": {
                "version": "V1",
                "size": "00"
            },
            "uses": null,
            "address": "FMZP4ovNTMEprcyyNpeTzurXr5yJKqpcLxGNQhhDWcse",
            "metadataAddress": "FqUdbAneeSnVRvsTunzMhz7Nzb3YTYFp2uJnL9bMoPM4",
            "mint": {
                "model": "mint",
                "address": "FMZP4ovNTMEprcyyNpeTzurXr5yJKqpcLxGNQhhDWcse",
                "mintAuthorityAddress": "6yfQgLJ1U1HMThRZenqaEVNLdrAVXMT4rJu8p6PT1yrv",
                "freezeAuthorityAddress": "6yfQgLJ1U1HMThRZenqaEVNLdrAVXMT4rJu8p6PT1yrv",
                "decimals": 0,
                "supply": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "isWrappedSol": false,
                "currency": {
                    "symbol": "Token",
                    "decimals": 0,
                    "namespace": "spl-token"
                }
            },
            "token": {
                "model": "token",
                "address": "4xKCpVPGgKpxy21kwKR5JonB7qK6AJyMa4kHEsD1jzoe",
                "isAssociatedToken": true,
                "mintAddress": "FMZP4ovNTMEprcyyNpeTzurXr5yJKqpcLxGNQhhDWcse",
                "ownerAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "amount": {
                    "basisPoints": "01",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "closeAuthorityAddress": null,
                "delegateAddress": null,
                "delegateAmount": {
                    "basisPoints": "00",
                    "currency": {
                        "symbol": "Token",
                        "decimals": 0,
                        "namespace": "spl-token"
                    }
                },
                "state": 1
            },
            "edition": {
                "model": "nftEdition",
                "isOriginal": true,
                "address": "6yfQgLJ1U1HMThRZenqaEVNLdrAVXMT4rJu8p6PT1yrv",
                "supply": "00",
                "maxSupply": "00"
            }
        }
         * */
        console.log(collectionNft)

        const allowList = [
            wallet.publicKey.toString(),
        ];

        console.log(allowList);

        const { candyMachine } = await creatorMetaplex.candyMachines().create({
            itemsAvailable: toBigNumber(collectionCount),
            sellerFeeBasisPoints: sellerFee, // 3.33%
            collection: {
                address: new PublicKey(collectionNft.address), // collectionNft.address,
                updateAuthority: creatorMetaplex.identity(),
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

        /**
         * {
            "model": "candyMachine",
            "address": "Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75",
            "accountInfo": {
                "executable": false,
                "owner": "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
                "lamports": {
                    "basisPoints": "0783f0c0",
                    "currency": {
                        "symbol": "SOL",
                        "decimals": 9
                    }
                },
                "rentEpoch": 0
            },
            "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
            "mintAuthorityAddress": "C7PxDQrHS7vr1JzxBgn3Yr9VvfnPUsJt7PgPXSpAVxKm",
            "collectionMintAddress": "FMZP4ovNTMEprcyyNpeTzurXr5yJKqpcLxGNQhhDWcse",
            "symbol": "C4CSNFT2",
            "sellerFeeBasisPoints": 555,
            "isMutable": true,
            "maxEditionSupply": "00",
            "creators": [
                {
                    "address": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                    "verified": false,
                    "percentageShare": 100,
                    "share": 100
                }
            ],
            "items": [],
            "itemsAvailable": "03e8",
            "itemsMinted": "00",
            "itemsRemaining": "03e8",
            "itemsLoaded": 0,
            "isFullyLoaded": false,
            "itemSettings": {
                "prefixName": "Solana NFT2 #",
                "nameLength": 4,
                "prefixUri": "https://.../test_collection/",
                "uriLength": 9,
                "isSequential": true,
                "type": "configLines"
            },
            "featureFlags": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
            "candyGuard": {
                "model": "candyGuard",
                "address": "C7PxDQrHS7vr1JzxBgn3Yr9VvfnPUsJt7PgPXSpAVxKm",
                "accountInfo": {
                    "executable": false,
                    "owner": "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
                    "lamports": {
                        "basisPoints": "2656b0",
                        "currency": {
                            "symbol": "SOL",
                            "decimals": 9
                        }
                    },
                    "rentEpoch": 0
                },
                "baseAddress": "Y3AopTM75pbyFiwVZwGFSzpU8NJLfYyZ7nc5sXeXM75",
                "authorityAddress": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                "guards": {
                    "botTax": null,
                    "solPayment": null,
                    "tokenPayment": null,
                    "startDate": null,
                    "thirdPartySigner": null,
                    "tokenGate": null,
                    "gatekeeper": null,
                    "endDate": null,
                    "allowList": null,
                    "mintLimit": null,
                    "nftPayment": null,
                    "redeemedAmount": null,
                    "addressGate": null,
                    "nftGate": null,
                    "nftBurn": null,
                    "tokenBurn": null,
                    "freezeSolPayment": null,
                    "freezeTokenPayment": null
                },
                "groups": [
                    {
                        "label": "normal",
                        "guards": {
                            "botTax": null,
                            "solPayment": {
                                "lamports": "05f5e100",
                                "destination": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                                "amount": {
                                    "basisPoints": "05f5e100",
                                    "currency": {
                                        "symbol": "SOL",
                                        "decimals": 9
                                    }
                                }
                            },
                            "tokenPayment": null,
                            "startDate": {
                                "date": "634d7c00"
                            },
                            "thirdPartySigner": null,
                            "tokenGate": null,
                            "gatekeeper": null,
                            "endDate": null,
                            "allowList": null,
                            "mintLimit": null,
                            "nftPayment": null,
                            "redeemedAmount": null,
                            "addressGate": null,
                            "nftGate": null,
                            "nftBurn": null,
                            "tokenBurn": null,
                            "freezeSolPayment": null,
                            "freezeTokenPayment": null
                        }
                    },
                    {
                        "label": "owner",
                        "guards": {
                            "botTax": null,
                            "solPayment": {
                                "lamports": "00",
                                "destination": "6XCZFjhqmgkywC6mkRhpLy3D6JwRUy8x41wbkxz8Mg2A",
                                "amount": {
                                    "basisPoints": "00",
                                    "currency": {
                                        "symbol": "SOL",
                                        "decimals": 9
                                    }
                                }
                            },
                            "tokenPayment": null,
                            "startDate": null,
                            "thirdPartySigner": null,
                            "tokenGate": null,
                            "gatekeeper": null,
                            "endDate": null,
                            "allowList": {
                                "merkleRoot": {
                                    "0": 117,
                                    "1": 91,
                                    "2": 155,
                                    "3": 103,
                                    "4": 56,
                                    "5": 53,
                                    "6": 42,
                                    "7": 254,
                                    "8": 47,
                                    "9": 188,
                                    "10": 24,
                                    "11": 93,
                                    "12": 24,
                                    "13": 9,
                                    "14": 100,
                                    "15": 129,
                                    "16": 215,
                                    "17": 98,
                                    "18": 9,
                                    "19": 146,
                                    "20": 161,
                                    "21": 146,
                                    "22": 202,
                                    "23": 251,
                                    "24": 162,
                                    "25": 251,
                                    "26": 133,
                                    "27": 11,
                                    "28": 172,
                                    "29": 237,
                                    "30": 132,
                                    "31": 21
                                }
                            },
                            "mintLimit": null,
                            "nftPayment": null,
                            "redeemedAmount": null,
                            "addressGate": null,
                            "nftGate": null,
                            "nftBurn": null,
                            "tokenBurn": null,
                            "freezeSolPayment": null,
                            "freezeTokenPayment": null
                        }
                    }
                ]
            }
        }
         * */

        let items = [];
        for (var i = 0; i < 10; i++) {
            items.push({ name: i.toString(), uri: i + '.json' })
        }
        await creatorMetaplex.candyMachines().insertItems({
            candyMachine,
            index: 0,
            items: items,
        });

        console.log(candyMachine)

        const mintingWallet = creatorMetaplex.identity().publicKey.toBase58();

        creatorMetaplex.candyMachines().callGuardRoute({
            candyMachine,
            guard: 'allowList',
            group: 'owner',
            settings: {
                path: 'proof',
                merkleProof: getMerkleProof(allowList, mintingWallet),
            },
        }).then(console.log);
    };

    async function mintNftByWallet(wallet, candymachineAddress) {
        let userMetaplex = metaplex.use(keypairIdentity(wallet));

        const candyMachine = await userMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey(candymachineAddress) });

        console.log(candyMachine);

        userMetaplex.candyMachines().mint({
            candyMachine,
            collectionUpdateAuthority: creatorWallet.publicKey,
            group: "normal"
        }).then(console.log)
    }

    async function mintNftByOwner2(creatorWallet, candymachineAddress, toAddress) {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet));

        const candyMachine = await creatorMetaplex
            .candyMachines()
            .findByAddress({ address: new PublicKey(candymachineAddress) });

        console.log(candyMachine);

        creatorMetaplex.candyMachines().mint(
            {
                candyMachine,
                collectionUpdateAuthority: creatorWallet.publicKey,
                owner: new PublicKey(toAddress),
                group: "owner"
            },
            {
                payer: creatorWallet,
            }).then(console.log)
    }

    async function findByMetadata(metadata) {
        const nft = await metaplex
            .nfts()
            .findByMetadata({ metadata: new PublicKey(metadata) });

        console.log(nft);
    }

    //async function createCustomToken() {
    //    const myCustomToken = splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)
    //}

    async function createAuctionHouse() {
        let creatorMetaplex = metaplex.use(keypairIdentity(creatorWallet));

        const { auctionHouse } = await creatorMetaplex
            .auctionHouse()
            .create({
                sellerFeeBasisPoints: 500, // 5% fee
                authority: creatorMetaplex.identity(),
                requiresSignOff: false,
                canChangeSalePrice: true,
            });

        /**
         * {
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
            "requiresSignOff": true,
            "canChangeSalePrice": true,
            "isNative": true,
            "scopes": [],
            "hasAuctioneer": false
        } */
        console.log(auctionHouse);
    }

    async function findAuctionHouse(address) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(address) });

        console.log(auctionHouse);
    }

    async function findListing(auctionHouseAddress) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        const listings = await metaplex
            .auctionHouse()
            .findListings({ auctionHouse });

        console.log(listings);

        const loadedListing = await metaplex
            .auctionHouse()
            .loadListing({ lazyListing: listings[0] });

        console.log(loadedListing);
    }

    async function findListingByReceipt(auctionHouseAddress, receiptAddress) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        const nft = await metaplex
            .auctionHouse()
            .findListingByReceipt({ receiptAddress: new PublicKey(receiptAddress), auctionHouse });

        console.log(nft);
    }

    async function findPurchases(auctionHouseAddress) {
        const auctionHouse = await metaplex
            .auctionHouse()
            .findByAddress({ address: new PublicKey(auctionHouseAddress) });

        const purchases  = await metaplex
            .auctionHouse()
            .findPurchases({ auctionHouse });

        console.log(purchases );
    }

    return (
        <div>
            <button onClick={makeCollectionNft}>makeCollectionNft</button>
            <button onClick={findCollectionNft}>findCollectionNft</button>
            <button onClick={makeCandyMachine}>makeCandyMachine</button>
            <button onClick={findCandyMachine}>findCandyMachine</button>
            <button onClick={updateCandyMachine}>updateCandyMachine</button>
            <button onClick={insertCandyMachine}>insertCandyMachine</button>
            <button onClick={unwrapCandyGuard}>unwrapCandyGuard</button>
            <button onClick={wrapCandyGuard}>wrapCandyGuard</button>
            <button onClick={updateCandyGuardGroup}>updateCandyGuardGroup</button>
            <button onClick={mintNft}>mintNft</button>
            <button onClick={mintNftByOwner}>mintNftByOwner</button>
            <button onClick={proofAllowListToGuard}>proofAllowListToGuard</button>
            <button onClick={() => buildAllProgress(creatorWallet, "Solana Auction Test NFT", 10, 555, "", "SATN", 'https://.../test_collection/', "2022-10-17T16:00:00Z")}>buildAllProgress</button>
            <button onClick={() => mintNftByWallet(user1Wallet, "77ieQsmZf6hMLDgnk47b9415qXSqkGge3S4NoXvF7Wc6")}>mintNftByWallet</button>
            <button onClick={() => mintNftByOwner2(creatorWallet, "DnaHeBCDiazKq8uMN25yZFvFDMLVQftcSoDBggx3AkKW", "GPWvi1cUBHdRCdk2nuo1m3rxJrQukbdXUikNnNJw242Y")}>mintNftByOwner2</button>
            <br />
            <button onClick={createAuctionHouse}>createAuctionHouse</button>
            <button onClick={() => findAuctionHouse("2BZSJe6rZz3NDXzhcz9woLi2ZULpkaYHF2nS3RiDQVrg")}>findAuctionHouse</button>
            <button onClick={() => findListing("2BZSJe6rZz3NDXzhcz9woLi2ZULpkaYHF2nS3RiDQVrg")}>findListing</button>
            <button onClick={() => findListingByReceipt("8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M", "5eq5sZSkEH7G5GSpZWk2gLZhCB7c6iWYFr5AGjKXL7E8")}>findListingByReceipt</button>
            <button onClick={() => findPurchases("8be19Z2KF8tN4vFpUDgdBddMLXELjrE3NTiesz6mEw7M")}>findPurchases</button>
            <br />
            <button onClick={() => findByMetadata("2gVx2HeoTVf39ahA8djGnc3d49G1TRydApiTpL29DUqm")}>findByMetadata</button>


        </div>
    )
}