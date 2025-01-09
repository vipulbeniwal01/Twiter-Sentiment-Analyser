import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

import { useRef, useState } from "react";

export function TokenLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [avatarUrl, setAvatarUrl] = useState("");
  const generateRandomAvatarUrl = () => {
    const getRandomItem = (array) =>
      array[Math.floor(Math.random() * array.length)];

    const avatarStyle = ["Circle", "Transparent"];
    const topType = [
      "NoHair",
      "Eyepatch",
      "Hat",
      "Hijab",
      "Turban",
      "WinterHat1",
      "WinterHat2",
      "WinterHat3",
      "WinterHat4",
      "LongHairBigHair",
      "LongHairBob",
      "LongHairBun",
      "LongHairCurly",
      "LongHairCurvy",
      "LongHairDreads",
      "LongHairFrida",
      "LongHairFro",
      "LongHairFroBand",
      "LongHairNotTooLong",
      "LongHairShavedSides",
      "LongHairMiaWallace",
      "LongHairStraight",
      "LongHairStraight2",
      "LongHairStraightStrand",
      "ShortHairDreads01",
      "ShortHairDreads02",
      "ShortHairFrizzle",
      "ShortHairShaggyMullet",
      "ShortHairShortCurly",
      "ShortHairShortFlat",
      "ShortHairShortRound",
      "ShortHairShortWaved",
      "ShortHairSides",
      "ShortHairTheCaesar",
      "ShortHairTheCaesarSidePart",
    ];
    const accessoriesType = [
      "Blank",
      "Kurt",
      "Prescription01",
      "Prescription02",
      "Round",
      "Sunglasses",
      "Wayfarers",
    ];
    const hairColor = [
      "Auburn",
      "Black",
      "Blonde",
      "BlondeGolden",
      "Brown",
      "BrownDark",
      "Platinum",
      "Red",
    ];
    const facialHairType = [
      "Blank",
      "BeardMedium",
      "BeardLight",
      "BeardMajestic",
      "MoustacheFancy",
      "MoustacheMagnum",
    ];
    const facialHairColor = [
      "Auburn",
      "Black",
      "Blonde",
      "BlondeGolden",
      "Brown",
      "BrownDark",
      "Platinum",
      "Red",
    ];
    const clotheType = [
      "BlazerShirt",
      "BlazerSweater",
      "CollarSweater",
      "GraphicShirt",
      "Hoodie",
      "Overall",
      "ShirtCrewNeck",
      "ShirtScoopNeck",
      "ShirtVNeck",
    ];
    const clotheColor = [
      "Black",
      "Blue01",
      "Blue02",
      "Blue03",
      "Gray01",
      "Gray02",
      "Heather",
      "PastelBlue",
      "PastelGreen",
      "PastelOrange",
      "PastelRed",
      "PastelYellow",
      "Pink",
      "Red",
      "White",
    ];
    const graphicType = [
      "Bat",
      "Cumbia",
      "Deer",
      "Diamond",
      "Hola",
      "Pizza",
      "Resist",
      "Selena",
      "Bear",
      "SkullOutline",
      "Skull",
    ];
    const eyeType = [
      "Close",
      "Cry",
      "Default",
      "Dizzy",
      "EyeRoll",
      "Happy",
      "Hearts",
      "Side",
      "Squint",
      "Surprised",
      "Wink",
      "WinkWacky",
    ];
    const eyebrowType = [
      "Angry",
      "AngryNatural",
      "Default",
      "DefaultNatural",
      "FlatNatural",
      "RaisedExcited",
      "RaisedExcitedNatural",
      "SadConcerned",
      "SadConcernedNatural",
      "UnibrowNatural",
      "UpDown",
      "UpDownNatural",
    ];
    const mouthType = [
      "Concerned",
      "Default",
      "Disbelief",
      "Eating",
      "Grimace",
      "Sad",
      "ScreamOpen",
      "Serious",
      "Smile",
      "Tongue",
      "Twinkle",
      "Vomit",
    ];
    const skinColor = [
      "Tanned",
      "Yellow",
      "Pale",
      "Light",
      "Brown",
      "DarkBrown",
      "Black",
    ];

    const url = `https://avataaars.io/?avatarStyle=${getRandomItem(
      avatarStyle
    )}&topType=${getRandomItem(topType)}&accessoriesType=${getRandomItem(
      accessoriesType
    )}&hairColor=${getRandomItem(hairColor)}&facialHairType=${getRandomItem(
      facialHairType
    )}&facialHairColor=${getRandomItem(
      facialHairColor
    )}&clotheType=${getRandomItem(clotheType)}&clotheColor=${getRandomItem(
      clotheColor
    )}&graphicType=${getRandomItem(graphicType)}&eyeType=${getRandomItem(
      eyeType
    )}&eyebrowType=${getRandomItem(eyebrowType)}&mouthType=${getRandomItem(
      mouthType
    )}&skinColor=${getRandomItem(skinColor)}`;

    return url;
  };

  const imageref = useRef(null);
  const [tokenDetails, setTokenDetails] = useState({
    name: "",
    symbol: "",
    imageUrl: "",
    initialSupply: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTokenDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTokenDetails((prevDetails) => ({
          ...prevDetails,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  async function createToken() {
    if (!wallet.publicKey) {
      alert("Please connect your wallet");
      return;
    }
    console.log("Connected!");

    const mintKeypair = Keypair.generate();

    const metadata = {
      mint: mintKeypair.publicKey,
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    // const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    try {
      await wallet.sendTransaction(transaction, connection);

      const newToken = {
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        imageUrl: tokenDetails.imageUrl,
        mintAddress: mintKeypair.publicKey.toBase58(),
      };

      const existingTokens =
        JSON.parse(localStorage.getItem("createdTokens")) || [];
      localStorage.setItem(
        "createdTokens",
        JSON.stringify([...existingTokens, newToken])
      );

      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
      alert("Token created successfully!");
    } catch (error) {
      console.error("Failed to create token:", error);
    }

    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(associatedToken.toBase58());

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const initialSupply = parseInt(tokenDetails.initialSupply, 10);
    if (isNaN(initialSupply) || initialSupply <= 0) {
      alert("Invalid initial supply. Please enter a positive number.");
      return;
    }

    const transaction3 = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          initialSupply * Math.pow(10, 9), // Multiply by 10^9 for decimals
          [], // Signers (empty array since mintAuthority is a signer)
          TOKEN_2022_PROGRAM_ID
        )
      );

    await wallet.sendTransaction(transaction3, connection);

    console.log("Minted!");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-700">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-400">
          Solana Token Launchpad
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-base font-semibold text-gray-200"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={tokenDetails.name}
              onChange={handleInputChange}
              placeholder="Token Name"
              className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base p-3"
            />
          </div>

          <div>
            <label
              htmlFor="symbol"
              className="block text-base font-semibold text-gray-200"
            >
              Symbol
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={tokenDetails.symbol}
              onChange={handleInputChange}
              placeholder="Token Symbol"
              className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base p-3"
            />
          </div>

          <div>
            <label
              htmlFor="imageInput"
              className="block text-base font-semibold text-gray-200"
            >
              Token Image
            </label>
            <input
              ref={imageref}
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={tokenDetails.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL"
              className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base p-3"
            />
            <button
              onClick={() => {
                const newurl = generateRandomAvatarUrl();
                setAvatarUrl(newurl);
                setTokenDetails((prevDetails) => ({
                  ...prevDetails,
                  imageUrl: newurl,
                }));
              }}
              type="button"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-5 rounded-lg shadow-md hover:from-blue-600 mt-6 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Or Generate Avatar
            </button>
            {avatarUrl !== "" && (
              <div className="w-full flex items-center justify-center mt-4">
                <img src={avatarUrl} alt="" />
              </div>
            )}
            <div className="mt-4">
              <label
                htmlFor="imageUpload"
                className="block text-base font-semibold text-gray-200"
              >
                Or Upload Image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base p-3"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="initialSupply"
              className="block text-base font-semibold text-gray-200"
            >
              Initial Supply
            </label>
            <input
              type="text"
              id="initialSupply"
              name="initialSupply"
              value={tokenDetails.initialSupply}
              onChange={handleInputChange}
              placeholder="Initial Supply"
              className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base p-3"
            />
          </div>

          <button
            type="button"
            onClick={createToken}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Create Token
          </button>
        </form>
      </div>
    </div>
  );
}
