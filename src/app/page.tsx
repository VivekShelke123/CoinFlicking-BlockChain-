import { AccounConnection } from "@/components/AccounConnection";
import CoinFlip from "@/components/FlickingAnimation";
import { NavBar } from "@/components/NavBar";
import Image from "next/image";

export default function Home() {
  return (
  <main>
    <NavBar/>

    <div className="">
      <AccounConnection/>
    </div>
  </main>  
  );
}
