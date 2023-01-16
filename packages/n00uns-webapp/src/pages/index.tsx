import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import logo from "../assets/logo.svg";
import n00uns_soon from "../assets/animations/n00uns_soon.json";
import {FaTwitter, FaDiscord} from 'react-icons/fa';
import og_img from "../../public/og-image.png";

const Landing: NextPage = (props) => {
  return (
    <>
    <Head>
      <meta property="og:title" content="n00uns dao" key="title" />
      <meta property="og:type" content="website" key="type" />
      <meta property="og:image" content={og_img.src} key="image" />
      <meta property="og:url" content="https://www.n00uns.com" key="url" />
    </Head>
    <main className="w-screen h-screen relative">
      <div className="w-full h-full flex flex-col items-center justify-center bg-nuetral -mt-10 sm:mt-0">
        <Image
          src={logo}
          className="mx-auto object-cover w-72 mb-36 sm:mb-56"
          alt="n00uns logo"
          aria-label="n00uns logo"
          priority={false}
        />
        <div className="w-[100%] mx-auto absolute overflow-hidden">
          <Player
            autoplay
            loop
            src={n00uns_soon}
            style={{ width: '100%', height:'500px' }}
          >
            {/* <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} /> */}
          </Player>
          
        </div>
        <span className="mb-12 sm:mb-14">[Q2 2023]</span>
        <div className="flex flex-col items-center absolute bottom-12 sm:bottom-24 px-5">
          <p className="text-2xl sm:text-3xl pb-2 font-light text-center">The best way to predict the future is to create it.</p>
          <p className="text-xs py-4 font-thin text-center">n00unsDAO is an ambitious multi-chain DAO and community proliferating via the <span className="font-bold">@nounsdao</span> protocol and <span className="font-bold">@y00tsNFT</span></p>
        </div>
      </div>
      <footer className="fixed h-20 bg-white bottom-0 w-full items-center justify-between p-6">
        {/* <div className="w-3/4 border-t border-gray-700"></div> */}
          <ul className="flex items-center justify-center mx-auto text-black space-x-8">
              <li>
                  <a href="https://twitter.com/snounsdao?s=20&t=YOW-qmN9O20RX-lB-fOmiA" 
                    target="_blank"
                    rel="noreferrer"
                    aria-label="link to n00uns twitter"
                    className="mr-4 hover:scale-110 md:mr-6 ">
                    <FaTwitter className="text-3xl" />
                  </a>
              </li>
              <li>
                  <a href="https://discord.gg/2Gp55Uzsad" 
                    target="_blank"
                    rel="noreferrer"
                    aria-label="link to n00uns discord"
                    className="mr-4 hover:scale-110 md:mr-6">
                    <FaDiscord className="text-3xl" />
                  </a>
              </li>
          </ul>
      </footer>
    </main>
</>
  );
};

export default Landing;
