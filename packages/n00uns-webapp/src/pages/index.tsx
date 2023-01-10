import type { NextPage } from "next";
import Image from "next/image";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import logo from "../assets/logo.png";
import n00uns_soon from "../assets/animations/n00uns_soon.json";
import {FaTwitter, FaDiscord} from 'react-icons/fa'

const Landing: NextPage = (props) => {
  return (
    <>
    <main className="w-screen h-screen relative">
      <div className="w-full h-full flex flex-col items-center justify-center bg-nuetral">
        <Image
          src={logo}
          className="mx-auto object-cover w-72 mb-48"
          alt="n00uns logo"
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
        <span className="mb-12">[Q2 2023]</span>
      </div>
      <footer className="fixed bottom-0 w-full flex flex-col items-center justify-between p-6">
        <div className="w-3/4 border-t border-gray-700"></div>
          <ul className="flex flex-wrap items-center mx-auto mt-5 text-gray-500 space-x-4">
              <li>
                  <a href="https://twitter.com/snounsdao?s=20&t=YOW-qmN9O20RX-lB-fOmiA" 
                  target="_blank"
                  className="mr-4 hover:scale-110 md:mr-6 ">
                    <FaTwitter className="text-3xl" />
                  </a>
              </li>
              <li>
                  <a href="discord.gg/2Gp55Uzsad" target="_blank" className="mr-4 hover:scale-110 md:mr-6">
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
