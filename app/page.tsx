'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import About from "./components/about";
import AboutOverlay from "./components/about/AboutOverlay";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Skills from "./components/skills";
import ImageFooter from "./components/image-footer";
import GlobalFooterLinks from "./components/common/GlobalFooterLinks";

const Home = () => {
  return (
    <>
      <CanvasLoader>
        <ScrollWrapper>
          <Hero/>
          <About/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>
      {/* DOM overlays — fixed position, above canvas, driven by scroll store */}
      <AboutOverlay/>
      {/* Image footer overlay sits at z-index 20 */}
      <ImageFooter/>
      <Skills/>
      <GlobalFooterLinks/>
    </>
  );
};
export default Home;
