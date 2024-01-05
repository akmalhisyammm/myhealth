import {
  Box,
  Divider,
  HStack,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      color="white"
      backgroundColor="brand.500"
      textAlign={['center', 'center', 'start']}
      paddingX={[4, 4, 12]}
      paddingY={8}
    >
      <Heading as="h4" size="lg">
        MyHealth
      </Heading>

      <SimpleGrid columns={[1, 1, 3]} paddingY={8} spacing={8}>
        <Box>
          <Heading as="h5" size="md" marginBottom={4}>
            Kontak Kami
          </Heading>
          <Text fontSize="md" marginBottom={4}>
            JL. HealthyCare KM 18.9 Kawasan Industri Daan Mogot Blok G no.25, Jakarta Selatan -
            Indonesia
          </Text>
          <Text fontSize="md">Phone: (62)21 5361061</Text>
          <Text fontSize="md">Fax: (62)21 5309156, 53660620</Text>
          <Text fontSize="md">E-Mail: healthy@gmail.com</Text>
        </Box>

        <Box marginX="auto">
          <Heading as="h5" size="md" marginBottom={4}>
            Link Terkait
          </Heading>
          <HStack spacing={12}>
            <VStack alignItems="start">
              <Link href="#" isExternal>
                Beranda
              </Link>
              <Link href="#" isExternal>
                Tentang
              </Link>
              <Link href="#" isExternal>
                Dokter
              </Link>
              <Link href="#" isExternal>
                Pelayanan
              </Link>
              <Link href="#" isExternal>
                Kontak
              </Link>
            </VStack>
            <VStack alignItems="start">
              <Link href="#" isExternal>
                Beranda
              </Link>
              <Link href="#" isExternal>
                Tentang
              </Link>
              <Link href="#" isExternal>
                Dokter
              </Link>
              <Link href="#" isExternal>
                Pelayanan
              </Link>
              <Link href="#" isExternal>
                Kontak
              </Link>
            </VStack>
          </HStack>
        </Box>

        <Box marginX="auto">
          <Heading as="h5" size="md" marginBottom={4}>
            Sosial Media
          </Heading>
          <HStack spacing={4}>
            <IconButton aria-label="Instagram" fontSize="20px" icon={<FaInstagram />} isRound />
            <IconButton aria-label="Twitter" fontSize="20px" icon={<FaTwitter />} isRound />
            <IconButton aria-label="YouTube" fontSize="20px" icon={<FaYoutube />} isRound />
          </HStack>
        </Box>
      </SimpleGrid>

      <Divider />

      <Text textAlign="center" marginTop={8}>
        &copy; {new Date().getFullYear()} MyHealth. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
