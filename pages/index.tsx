import { useAddress, useContract, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { BigNumber } from 'ethers';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import FirstOfCollection from '../public/1.png';
import SecondOfCollection from '../public/2.png';
import ThirdOfCollection from '../public/3.png';
import QuarterOfCollection from '../public/4.png';
import MainCollection from '../public/main.png';
import toast from 'react-hot-toast'

const Home: NextPage = () => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [princeInEth, setPrinceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const { contract } = useContract(process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS, "nft-drop")

  const connectWithMetamask = useMetamask()
  const address = useAddress();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (!contract) return;

    const fetchNFTDropData = async () => {
      const claimed = await contract.getAllClaimed()
      const total = await contract.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setLoading(false)
    }

    const fetchPrice = async () => {
      const claimConditioons = await contract.claimConditions.getAll();
      setPrinceInEth(claimConditioons?.[0].currencyMetadata.displayValue)
    }

    setLoading(true)
    fetchNFTDropData();
    fetchPrice()
    setLoading(false)
  }, [contract])


  const mintNFT = async () => {
    if (!contract || !address) return

    setLoading(true)
    try {
      const quantity = 1
      await contract.claimTo(address, quantity)
      toast.success("HOORAY.. You Successfully Minted!")
    } catch (err) {
      toast.error("Whoops... Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Head>
        <title>Developer Collection NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className='py-12 h-full flex-col text-center'>
        <div className='flex flex-col items-center justify-center py-2 min-h-full'>
          <div>
            <Image className='w-60 rounded-xl object-cover h-96 lg:w-72' src={MainCollection} alt="" />
          </div>

          <h1 className='text-4xl font-bold text-white py-3'>Developer Collection</h1>
          <h2 className='text-xl text-gray-300 '>A Collection of Developer Collection differents styles</h2>

        </div>

      </div>

      <div className='w-full py-12 h-full'>
        <div className='flex flex-col lg:flex-row items-center justify-between pb-3 lg:px-32'>
          <h1 className='cursor-pointer text-xl text-white font-extralight'>
            The{' '}
            <span className='font-extrabold  text-white'>Developer Collection</span>{' '}
            NFT Drop
          </h1>

          <button className={`w-80 my-10 text-xs rounded-full px-4 py-2 
             text-white lg:px-5 lg:py-3 lg:text-base lg:w-40 ${address ? "bg-red-800" : "bg-emerald-700"}`}
            onClick={() => address ? disconnect() : connectWithMetamask()}
          >{address ? 'Sign Out' : 'Sign In'}</button>
        </div>

        <hr className='my-2 border mx-32 border-red-900' />

        {address && (
          <p className='text-center text-sm text-red-800'>
            You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)} </p>
        )}

        <div className='my-14 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0'>
          <div className=' flex flex-col gap-y-3 lg:flex-row lg:gap-x-3'>
            <Image className='w-60 rounded-xl object-cover h-96 lg:w-72' src={FirstOfCollection} alt="" />
            <Image className='w-60 rounded-xl object-cover h-96 lg:w-72' src={SecondOfCollection} alt="" />
            <Image className='w-60 rounded-xl object-cover h-96 lg:w-72' src={ThirdOfCollection} alt="" />
          </div>

          {loading ? (
            <p className='py-4 text-xl text-white animate-pulse'>Loading Supply Count...</p>
          ) : (
            <p className='py-4 text-xl text-white'>{claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
          )}

          {loading && <div className='py-12'><BarLoader color="#991B1B" /></div>}

          <button
            onClick={mintNFT}
            disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
            className='h-16 w-80 bg-red-600 text-white rounded-full my-10 font-bold disabled:bg-gray-400'>
            {loading ? (
              <>Loading</>
            ) : claimedSupply === totalSupply?.toNumber() ? (
              <>SOLD OUT</>
            ) : !address ? (
              <>Sign in to Mint</>
            ) : (
              <span className='font-bold'>Mint NFT ({princeInEth} ETH)</span>
            )}

          </button>

        </div>

        <hr className='my-2 border mx-32 border-red-900' />

      </div>

      <div className='py-12 px-16 h-full flex-col'>S
        <div className='flex items-center justify-between pb-3'>
          <h1 className='cursor-pointer text-xl text-white font-extralight'>
            The{' '}
            <span className='font-extrabold  text-white'>Future Collections</span>{' '}
          </h1>

        </div>

        <div className='flex flex-col mb-12 items-center space-y-6 gap-x-4 lg:space-y-0 lg:flex-row '>
          <div className='items-start lg:w-96'>
            <p className='pt-2 text-xl text-white leading-9'>The first collection was based on futuristic mysterious developers.
              Seeking more and more to improve, we are thinking of a line of variations associating humor and cuteness</p>
          </div>

          <div className='items-center'>
            <Image className='w-60 rounded-xl object-cover h-96 lg:w-72' src={QuarterOfCollection} alt="" />
          </div>

        </div>

      </div>

    </div>
  )
}

export default Home
