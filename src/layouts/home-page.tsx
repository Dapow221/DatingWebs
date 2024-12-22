import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Collapse,
  Image,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { Heart, Music, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import HomeLayouts from "./home-layouts";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <Box
    className="prose"
    fontSize="lg"
    lineHeight="tall"
    mx="auto"
    my={4}
    px={4}
    maxWidth="65ch"
  >
    {children}
  </Box>
);


interface MomentsType {
  icon: any;
  title: string;
  children: React.ReactNode;
  images?: string[];
}

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize="lg" lineHeight="taller" letterSpacing="wide" mb={4}>
    {children}
  </Text>
);


const MemoryCard: React.FC<MomentsType> = ({ icon, title, children, images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("pink.100", "pink.700");
  const titleColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  
  return (
    <Box
      w="full"
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      className="transform transition-all duration-300 hover:shadow-lg"
      shadow="md"
    >
      <HStack 
        p={6} 
        justify="space-between" 
        w="full"
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
      >
        <HStack spacing={3}>
          <Icon as={icon} color="pink.500" boxSize={6} />
          <Heading size="md" color={titleColor}>
            {title}
          </Heading>
        </HStack>
        <Icon 
          as={isOpen ? ChevronUp : ChevronDown} 
          color="pink.500" 
          boxSize={5} 
        />
      </HStack>

      <Collapse in={isOpen}>
        <Box p={6} pt={0} color={textColor}>
          <Text mb={images ? 4 : 0}>
            {children}
          </Text>
          
          {images && (
            <Grid 
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))" 
              gap={4}
              mt={4}
            >
              {images.map((img, index) => (
                <GridItem key={index}>
                  <Image
                    src={img}
                    alt={`Memory ${index + 1}`}
                    borderRadius="lg"
                    className="hover:opacity-90 transition-opacity duration-300"
                    fallback={<Box height="200px" bg="gray.100" borderRadius="lg" />}
                  />
                </GridItem>
              ))}
            </Grid>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const HomePage = () => {
  const headerBg = useColorModeValue("pink.50", "rgba(236, 72, 153, 0.1)");
  const headerTitleClass = "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
  const headerTextColor = useColorModeValue("gray.600", "gray.300");

  // Example image URLs - replace with your actual images
  const howWeMetImages = [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300"
  ];

  const favoriteImages = [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300"
  ];

  const specialPlacesImages = [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300"
  ];
  
  return (
    <HomeLayouts>
      <Container maxW="container.lg" pt={8}>
        <Box
          borderRadius="2xl"
          bg={headerBg}
          p={8}
          mb={12}
          textAlign="center"
          className="backdrop-blur-sm"
        >
          <Heading 
            as="h1" 
            size="xl"
            mb={4}
            className={headerTitleClass}
          >
            Divanda and Dapoww Journey
          </Heading>
          <Text 
            fontSize="lg" 
            color={headerTextColor}
          >
            Documenting our precious moments and beautiful journey together ✨
          </Text>
        </Box>

        <VStack spacing={6} align="stretch">
          <MemoryCard 
              icon={Calendar} 
              title="How We Met"
              >
              <Prose>
                <Paragraph>
                  Our story began on Twitter 🐦, where we first connected and started to know each other 💕. 
                  For one week, we exchanged messages, slowly understanding each other&apos;s world, our thoughts, and our dreams 💭. 
                  There was something special brewing between us, a connection that felt both exciting and unexpected 🌟.
                  As the year was drawing to a close, we decided to meet on December 31st, 2023 🗓️. 
                  The anticipation was electric - would we have the same connection in person that we had online? 🤔,
                  To our surprise and delight, we matched perfectly 💖. 
                </Paragraph>
                <Paragraph>
                    We shared bebek (roasted duck) in place called &quot;Gion&quot;, its flavors mingling with the excitement of our newfound connection 🍽️.
                    Before this moment, we made a commitment to each other in &quot;Warung Kopi&quot; called &quot;Giras&quot; while sheltering from the rain 🌧️ and became a couple 💑.
                </Paragraph>
                <blockquote>
                  <Text as="em" color="pink.500">
                  &quot;That night was magical ✨.&quot;
                  </Text>
                </blockquote>
                <Paragraph>
                  Outside, the sky erupted with New Year&apos;s fireworks 🎆. In that moment, surrounded by the celebrations of a new year, the world seemed to celebrate our love.
                </Paragraph>
                <Paragraph>After that, something unexpected happened and let it be our secret 🤫💕.</Paragraph>
              </Prose>
          </MemoryCard>

          <MemoryCard 
            icon={Heart} 
            title="About us"
          >
            Still under development ....
          </MemoryCard>

          <MemoryCard icon={Music} title="Our Favorite Music">
            Still under development ....
          </MemoryCard>

          <MemoryCard 
            icon={MapPin} 
            title="Special Places"
            images={specialPlacesImages}
          >
            Still under development ....
          </MemoryCard>
        </VStack>
      </Container>
    </HomeLayouts>
  );
};

export default HomePage;