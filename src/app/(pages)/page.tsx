'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Text,
  useTheme,
  Heading,
  useToast,
  Image,
  HStack,
  VStack,
  SimpleGrid,
  Highlight,
  List,
  ListItem,
  ListIcon,
  CardHeader,
  Card,
  Center,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';

import { FaCheckCircle } from 'react-icons/fa';

import { HomeLayout } from '@/lib/components/layouts';
import { Nunito } from 'next/font/google';
import { AuthContext } from '@/lib/contexts/auth';
// import Image from '@/lib/assets/image';
import pallete from '@/lib/style/pallete';

const nunito = Nunito({
  subsets: ['latin'],
  // weight: ['400', '500', '600', '700', '800', '900'],
});

const Home = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const { isAuthenticated, isRegistered, isLoading, signIn } = useContext(AuthContext);

  const router = useRouter();
  const toast = useToast();

  const onSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signIn();
    } catch (err) {
      toast({
        title: 'Gagal masuk!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isLoggingIn) return;
    if (isRegistered) {
      toast({
        title: 'Berhasil masuk!',
        description: 'Anda akan diarahkan ke halaman utama.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setTimeout(
      () => (isRegistered ? router.push('/main/dashboard') : router.push('/auth/register')),
      1000
    );
  }, [router, toast, isAuthenticated, isRegistered, isLoggingIn]);

  return (
    <HomeLayout>
      {/* Header */}
      <HStack
        width="full"
        height="full"
        alignItems="center"
        backgroundColor={pallete.colors.blue[500]}
        paddingX={12}
        minH={520}
        spacing={12}
      >
        <Box>
          <Heading as="h2" size="xl" fontFamily={nunito.style.fontFamily} color="white">
            <Highlight
              query={['Memahami', 'Membimbing']}
              styles={{
                px: '3',
                py: '0.2',
                rounded: 'full',
                backgroundColor: pallete.colors.blue[50],
              }}
            >
              Bersama Kami, Kesehatan Bukan Hanya Layanan Medis, Tetapi Pengalaman Peduli yang
              Memahami dan Membimbing Setiap Langkah Perjalanan Anda!
            </Highlight>
          </Heading>
          <Text fontSize="md" color="white" textAlign="justify">
            Kami Mendedikasikan Diri untuk Memberikan Pelayanan Kesehatan Berkualitas Tinggi,
            Menyatukan Ilmu Pengetahuan.
          </Text>
          <Button
            // colorScheme={pallete.colors.blue[50]}
            loadingText="Pendaftaran"
            colorScheme="yellow"
            marginY={10}
            variant={'solid'}
            borderRadius={10}
            isLoading={isLoading}
            onClick={onSignIn}
            color={'white'}
          >
            Pendaftaran Baru
          </Button>
        </Box>
        <Image
          src="/_0003.png"
          alt="doctor"
          // bgColor="tomato"
          width="625px"
          display={{ base: 'none', md: 'none', lg: 'block' }}
          // position="relative"
          mt="-5px"
          // marginY={{ base: 0, md: -100, lg: -156 }}
          // marginX={{ base: 0, md: 490, lg: 600 }}
        />
      </HStack>

      {/* ABOUT */}
      <HStack
        width="full"
        height="full"
        alignItems="center"
        background="white"
        flexDirection={['column', 'column', 'row']}
        minH={520}
        spacing={6}
        paddingY={12}
        // marginY={12}

        paddingX={6}
      >
        <SimpleGrid columns={2} spacing={6} width={['full', 'full', '50%']}>
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            backdropFilter="blur(10px)"
            backgroundColor={'rgba(0, 109, 151, 0.5)'}
            boxSize="full"
            width="full"
            src="/hospital1.jpg"
            alt="image1"
            // backdropFilter="invert(rgba(0, 109, 151, 0.5))"
            // style={{ backdropFilter: 'invert(0) saturate(100%)' }}
            borderRadius="25px 0px 0px 0px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            boxSize="full"
            width="full"
            src="/hospital2.jpg"
            alt="image2"
            borderRadius="0px 25px 0px 0px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            width="full"
            boxSize="full"
            src="/hospital3.jpg"
            alt="image3"
            borderRadius="0px 0px 0px 25px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            width="full"
            boxSize="full"
            src="/hospital4.jpg"
            alt="image4"
            borderRadius="0px 0px 25px 0px"
          />
        </SimpleGrid>
        <VStack alignItems="start" maxW="55rem" textAlign="justify">
          <Heading
            as="h3"
            size="lg"
            fontFamily={nunito.style.fontFamily}
            color={pallete.colors.blue[500]}
          >
            Kenapa MyHealth?
          </Heading>
          <Text fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
            MyHealth menjadi pilihan unggul karena menyajikan pengalaman kesehatan yang terbaik bagi
            setiap pasien, ditandai oleh berbagai keunggulan dan nilai tambah yang dihadirkannya:
          </Text>
          <List>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              MyHealth memanfaatkan teknologi terkini dengan menyajikan platform digital
              terintegrasi yang memudahkan pasien mengakses informasi kesehatan mereka, membuat
              janji dokter, dan mengelola data medis secara efisien.
            </ListItem>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              Dengan pendekatan terintegrasi, MyHealth mengkoordinasikan berbagai aspek perawatan
              kesehatan, mulai dari diagnosis hingga pemantauan pasca-perawatan.
            </ListItem>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              Pelayanan MyHealth didesain untuk memberikan pengalaman pasien yang positif, dengan
              staf yang ramah dan perhatian terhadap kebutuhan individual.
            </ListItem>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              MyHealth menyediakan teknologi pemantauan kesehatan terkini untuk membantu pasien
              dalam memantau kondisi kesehatan mereka secara real-time.
            </ListItem>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              Keamanan data pasien merupakan prioritas utama MyHealth, dengan menerapkan sistem
              keamanan tinggi dan kebijakan privasi yang ketat.
            </ListItem>
            <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
              MyHealth bukan sekadar penyedia layanan kesehatan, tetapi menjadi mitra perjalanan
              kesehatan pasien dengan fokus pada kepuasan pasien, teknologi terkini, dan pelayanan
              yang memberikan dampak positif bagi kesehatan masyarakat.
            </ListItem>
          </List>
          <Text fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
            Melalui kombinasi inovasi teknologi, pelayanan terintegrasi, pengalaman pasien yang
            personal, keamanan data, dan promosi kesehatan preventif, MyHealth menjadi destinasi
            yang menarik bagi pasien yang mencari perawatan kesehatan yang komprehensif dan
            berorientasi pada kebutuhan individu mereka
          </Text>
        </VStack>
      </HStack>

      <HStack
        width="full"
        height="full"
        justifyContent="center"
        // alignItems="center"
        paddingX={12}
        // marginY={15}
        minH={400}
        spacing={12}
      >
        <Box alignItems="center" justifyItems="center" width="full" height="full" maxW="80rem">
          <Heading
            as="h2"
            size="xl"
            fontFamily={nunito.style.fontFamily}
            textAlign={'center'}
            color={pallete.colors.blue[500]}
          >
            Departemen Kami
          </Heading>
          <Text
            fontFamily={nunito.style.fontFamily}
            textAlign="center"
            color={pallete.colors.blue[500]}
            //
          >
            Setiap departemen di MyHealth memiliki peran yang krusial dalam memberikan pelayanan
            kesehatan terbaik dan menciptakan lingkungan perawatan yang menyeluruh dan efisien.
            Kerja sama antar departemen adalah kunci untuk memberikan perawatan kesehatan yang
            terkoordinasi dan terintegrasi.
          </Text>

          <HStack padding={25} spacing={15} flexWrap={'wrap'} justifyContent={'center'}>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Penyakit Dalam
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  THT
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Jantung
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Bedah
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Radiologi
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Laboratorium
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Jiwa
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Anak
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Gizi
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Kedokteran Nuklir
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Rehabilitasi Medik
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Gigi & Mulut
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Mata
                </Heading>
              </CardHeader>
            </Card>
            <Card bgColor={pallete.colors.blue[500]} borderRadius={15}>
              <CardHeader>
                <Heading as="h6" size="sm" color="white">
                  Kulit & Kelamin
                </Heading>
              </CardHeader>
            </Card>
          </HStack>
        </Box>
      </HStack>

      <HStack
        width="full"
        height="full"
        alignItems="center"
        background="white"
        flexDirection={['column', 'column', 'row']}
        minH={520}
        spacing={6}
        paddingY={12}
        justifyContent={'center'}
        marginY={12}
        paddingX={6}
      >
        <VStack alignItems="start" maxW="55rem" textAlign="justify">
          <Heading
            as="h3"
            size="lg"
            fontFamily={nunito.style.fontFamily}
            color={pallete.colors.blue[500]}
          >
            Tentang Kami
          </Heading>
          <Text fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
            MyHealth adalah sebuah pusat kesehatan yang didedikasikan untuk memberikan layanan
            kesehatan terbaik dan menyeluruh kepada masyarakat. Dengan komitmen untuk memberikan
            perawatan yang berkualitas, MyHealth menjadi pilihan utama bagi individu dan keluarga
            yang mengutamakan kesehatan dan kesejahteraan mereka.
          </Text>
          <Tabs variant="enclosed">
            <TabList as="b" fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
              <Tab>Visi</Tab>
              <Tab>Misi</Tab>
            </TabList>
            <TabPanels>
              <TabPanel fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
                <p>
                  Visi kami adalah menciptakan masyarakat yang lebih sehat dan bahagia melalui
                  penyediaan layanan kesehatan terdepan. Misi kami adalah memberikan perawatan
                  kesehatan yang terjangkau, inovatif, dan terdepan, serta meningkatkan kualitas
                  hidup setiap pasien yang percaya kepada kami.
                </p>
              </TabPanel>
              <TabPanel fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
                <List>
                  <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
                    <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
                    Pelayanan Kesehatan Terpadu
                  </ListItem>
                </List>
                <p>
                  MyHealth menawarkan pelayanan kesehatan terpadu yang mencakup berbagai aspek,
                  mulai dari pemeriksaan rutin hingga perawatan penyakit kronis, dengan tim medis
                  yang berkompeten dan berpengalaman.
                </p>
                <List>
                  <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
                    <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
                    Teknologi Terkini
                  </ListItem>
                </List>
                <p>
                  Mengusung konsep kesehatan digital, MyHealth memanfaatkan teknologi terkini untuk
                  mempermudah pasien mengakses informasi kesehatan, membuat janji online, dan
                  mengikuti konsultasi telemedicine.
                </p>
                <List>
                  <ListItem fontFamily={nunito.style.fontFamily} color={pallete.colors.blue[500]}>
                    <ListIcon as={FaCheckCircle} color={pallete.colors.blue[500]} />
                    Kenyamanan dan Kepuasan Pasien
                  </ListItem>
                </List>
                <p>
                  MyHealth berkomitmen untuk memberikan pengalaman pasien yang nyaman dan memuaskan
                  melalui layanan pendaftaran online, fasilitas yang bersih dan modern, serta
                  pelayanan yang ramah.
                </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
        <SimpleGrid
          columns={2}
          spacing={6}
          width={['full', 'full', '50%']}
          justifyContent={'center'}
        >
          <Image
            boxShadow="sm"
            rounded="md"
            backdropFilter="blur(10px)"
            boxSize="full"
            width="full"
            src="/hospital1.jpg"
            alt="image1"
            borderRadius="25px 0px 0px 0px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            boxSize="full"
            width="full"
            src="/hospital2.jpg"
            alt="image2"
            borderRadius="0px 25px 0px 0px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            width="full"
            boxSize="full"
            src="/hospital3.jpg"
            alt="image3"
            borderRadius="0px 0px 0px 25px"
          />
          <Image
            boxShadow="sm"
            rounded="md"
            // bg="white"
            width="full"
            boxSize="full"
            src="/hospital4.jpg"
            alt="image4"
            borderRadius="0px 0px 25px 0px"
          />
        </SimpleGrid>
      </HStack>

      <HStack
        width="full"
        height="full"
        alignItems="center"
        // backgroundColor={'tomato'}
        paddingX={12}
        minH={520}
        spacing={12}
      >
        <Image
          src="/Doctor-1.png"
          alt="doctor"
          width="530px"
          display={{ base: 'none', md: 'none', lg: 'block' }}
          mt="-5px"
        />
        <Box padding={5}>
          <Heading
            as="h2"
            size="xl"
            fontFamily={nunito.style.fontFamily}
            color={pallete.colors.blue[500]}
          >
            Mencari professinal & terpercaya kesehatan medis?
          </Heading>
          <Text
            fontSize="md"
            textAlign="justify"
            fontFamily={nunito.style.fontFamily}
            color={pallete.colors.blue[500]}
          >
            Jangan Ragu Untuk Menghubungi Kami di Bawah Ini :
          </Text>
          <FormControl>
            <Textarea borderRadius={10} placeholder="Pesan Anda..." />
          </FormControl>
          <Button
            // colorScheme={pallete.colors.blue[50]}
            loadingText="Pendaftaran"
            bgColor={pallete.colors.blue[500]}
            marginY={5}
            variant={'solid'}
            borderRadius={10}
            isLoading={isLoading}
            onClick={onSignIn}
            color={'white'}
          >
            Kirim Pesan
          </Button>
        </Box>
      </HStack>
    </HomeLayout>
  );
};

export default Home;
