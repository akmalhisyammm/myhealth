import pallete from '@/lib/style/pallete';
import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Textarea,
  Text,
  Image,
  SimpleGrid,
  Link,
  VStack,
} from '@chakra-ui/react';
import { Nunito } from 'next/font/google';
import { BiMenu } from 'react-icons/bi';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const nunito = Nunito({
  subsets: ['latin'],
  // weight: ['400', '500', '600', '700', '800', '900'],
});

const Footer = () => {
  return (
    <HStack
      width="full"
      height="full"
      alignItems="center"
      bgColor={pallete.colors.blue[500]}
      // flexDirection={['column', 'column', 'row']}
      minH={520}
      spacing={6}
      paddingY={12}
      justifyContent={'center'}
      marginTop={85}
      paddingX={6}
    >
      <SimpleGrid row={3} spacing={6}>
        <HStack
          width="full"
          height="full"
          alignItems="center"
          paddingX={12}
          minH={520}
          spacing={12}
          flexWrap={'wrap'}
        >
          <Box padding={5}>
            <Heading
              paddingY={15}
              as="h6"
              size="md"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Healthies
            </Heading>
            <Heading
              paddingY={15}
              as="h6"
              size="sm"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Kontak Kami
            </Heading>
            <Text
              fontSize="md"
              textAlign="justify"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              JL. HealthyCare KM 18.9 Kawasan Industri Daan Mogot Blok G no.25, Jakarta Selatan -
              Indonesia
            </Text>
            <Text
              paddingTop={30}
              fontSize="md"
              textAlign="justify"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Phone : (62)21 5361061
            </Text>
            <Text
              fontSize="md"
              textAlign="justify"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Fax : (62)21 5309156, 53660620
            </Text>
            <Text
              fontSize="md"
              textAlign="justify"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              E-Mail : healthy@gmail.com
            </Text>
          </Box>
          <Box padding={5} marginTop={78}>
            <Heading
              marginBottom={5}
              as="h6"
              size="sm"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Tautan
            </Heading>
            <VStack alignItems="start">
              <Link fontFamily={nunito.style.fontFamily} color={'white'} href="#" isExternal>
                Beranda
              </Link>
              <Link fontFamily={nunito.style.fontFamily} color={'white'} href="#" isExternal>
                Tentang
              </Link>
              <Link fontFamily={nunito.style.fontFamily} color={'white'} href="#" isExternal>
                Dokter
              </Link>
              <Link fontFamily={nunito.style.fontFamily} color={'white'} href="#" isExternal>
                Pelayanan
              </Link>
              <Link fontFamily={nunito.style.fontFamily} color={'white'} href="#" isExternal>
                Kontak
              </Link>
            </VStack>
          </Box>
          <Box padding={5}>
            <Heading
              marginBottom={5}
              as="h6"
              size="sm"
              fontFamily={nunito.style.fontFamily}
              color={'white'}
            >
              Sosial Media
            </Heading>
            <HStack alignItems="start">
              <IconButton
                isRound={true}
                variant="solid"
                colorScheme="yellow"
                aria-label="Done"
                fontSize="20px"
                icon={<FaInstagram />}
              />
              <IconButton
                isRound={true}
                variant="solid"
                colorScheme="blue"
                aria-label="Done"
                fontSize="20px"
                icon={<FaTwitter />}
              />
              <IconButton
                isRound={true}
                variant="solid"
                colorScheme="red"
                aria-label="Done"
                fontSize="20px"
                icon={<FaYoutube />}
              />
            </HStack>
          </Box>
        </HStack>
      </SimpleGrid>
    </HStack>
  );
};

export default Footer;
