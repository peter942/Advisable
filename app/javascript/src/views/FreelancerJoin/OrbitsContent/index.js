import React from "react";
import { Box, Text, Button, useBreakpoint } from "@advisable/donut";
import { ChevronRight } from "@styled-icons/feather";
import lambdaSchoolLogoWhite from "./logos/lambdaSchoolLogoWhite.png";
import StackOverflowLogo from "./logos/StackOverflowLogo";
import SpotifyLogo from "./logos/SpotifyLogo";
import ProductHuntLogo from "./logos/ProductHuntLogo";
import BigCommerceLogo from "./logos/BigCommerceLogo";
import WorldRemitLogo from "./logos/WorldRemitLogo";
import BabbelLogo from "./logos/BabbelLogo";
import UberAllLogo from "./logos/UberAllLogo";
import { AnimatePresence, motion } from "framer-motion";
import { useHistory } from "react-router";
import { transitionVariants } from "../transitionVariants";

function ThankYouContent() {
  const history = useHistory();
  return (
    <Box pb={20} mt={{ _: 10, xl: 0 }} maxWidth={560}>
      <Title mb={5}>Thank you</Title>
      <Text
        fontSize={{ _: "m", l: "l" }}
        color="white"
        lineHeight={{ _: "m", l: "l" }}
        mb={{ _: 6, xl: 8 }}
      >
        We&apos;re ready to start now. Please follow the app, fill the profile
        page, and add your previous projects so that we could match you with the
        best clients.
      </Text>
      <Button
        variant="dark"
        size={{ _: "m", xl: "l" }}
        suffix={<ChevronRight />}
        onClick={() => history.push("/")}
      >
        Get Started
      </Button>
    </Box>
  );
}

function Logos() {
  const params = {
    width: "100%",
    height: "100%",
    preserveAspectRatio: "xMinYMin meet",
    fill: "white",
  };
  return (
    <Box
      display={{ xl: "grid", _: "none" }}
      gridTemplateColumns="157px 157px"
      gridTemplateRows="32px 30px 28px 26px"
      gridColumnGap="54px"
      gridRowGap="22px"
    >
      <SpotifyLogo {...params} />
      <StackOverflowLogo {...params} height="96%" />
      <Box
        as="img"
        src={lambdaSchoolLogoWhite}
        alt="lambda-school-logo"
        height="100%"
        css={`
          object-fit: scale-down;
        `}
        opacity="0.6"
      />
      <ProductHuntLogo {...params} opacity="0.8" height="98%" />
      <WorldRemitLogo {...params} fill="none" opacity="0.6" />
      <BabbelLogo {...params} opacity="0.6" height="88%" />
      <UberAllLogo {...params} opacity="0.4" />
      <BigCommerceLogo {...params} opacity="0.4" />
    </Box>
  );
}

function Title({ children, ...props }) {
  return (
    <Text
      fontSize={{ _: "5xl", xl: 48 }}
      letterSpacing="-0.02rem"
      color="white"
      fontWeight="medium"
      {...props}
    >
      {children}
    </Text>
  );
}

function FormsContent() {
  return (
    <>
      <Box mb={{ xl: 20 }}>
        <Title>Advisable helps</Title>
        <Title color="#FEB6C8">top freelancers</Title>
        <Title mb={{ _: 4, l: 5 }}>succeed</Title>
        <Text
          fontSize={{ _: "m", l: "l" }}
          color="white"
          lineHeight={{ _: "m", l: "l" }}
        >
          Discover a world of opportunity with clients who value your brilliance
          and a network of world-class peers from 500+ marketing-related skills.
        </Text>
      </Box>
      <Logos />
    </>
  );
}

export default function OrbitsContent({ step, custom }) {
  const isMobile = useBreakpoint("s");
  const framerParams = {
    variants: transitionVariants,
    initial: "enter",
    animate: "center",
    exit: "exit",
    custom,
  };
  return (
    <Box
      position="relative"
      gridArea="orbits-content"
      alignSelf={{ _: "start", xl: "center" }}
      maxWidth={{ _: "640px", xl: "500px" }}
      pt={{ _: 0, xl: 14 }}
      pb={{ xl: 14 }}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <AnimatePresence exitBeforeEnter initial={false} custom={custom}>
        {step === 2 ? (
          <motion.div {...framerParams} key="thanks">
            <ThankYouContent />
          </motion.div>
        ) : isMobile && step === 1 ? (
          <motion.div {...framerParams} />
        ) : (
          <motion.div {...framerParams} key="forms">
            <FormsContent />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
