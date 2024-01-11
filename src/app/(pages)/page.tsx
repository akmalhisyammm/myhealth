'use client';

import { useContext } from 'react';
import {
  Button,
  Card,
  CardHeader,
  HStack,
  Heading,
  Highlight,
  Image,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

import { AuthContext } from '@/lib/contexts/auth';
import { HomeLayout } from '@/lib/components/layouts';
import { Barlow_Condensed } from 'next/font/google';

const Home = () => {
  const { isLoading, signIn } = useContext(AuthContext);

  return (
    <HomeLayout>
      <HStack
        width="full"
        height="full"
        alignItems="center"
        color="white"
        bgGradient="linear(to-r, brand.500, brand.300)"
        paddingX={[4, 4, 12]}
        minHeight={650}
        spacing={12}
      >
        <VStack alignItems="start" paddingY={12}>
          <Heading as="h2" size="xl" lineHeight={1.5}>
            <Highlight
              query={['Inovatif', 'Pelayanan Unggul']}
              styles={{ px: '3', py: '0.2', rounded: '12', backgroundColor: 'brand.50' }}
            >
              Sistem Manajemen Rumah Sakit yang Inovatif untuk Pelayanan Unggul dan Kesejahteraan Pasien!
            </Highlight>
          </Heading>
          <Text fontSize="md">
            Kami mendedikasikan diri untuk memberikan pelayanan kesehatan yang aman, berkualitas,
            dan terpercaya.
          </Text>
          <Button
            size={['md', 'lg', 'lg']}
            loadingText="Masuk dengan Internet Identity"
            width={['full', 'auto', 'auto']}
            marginY={4}
            leftIcon={<Image src="/icons/icp-logo.png" alt="ICP Logo" width={[18, 30, 30]} />}
            isLoading={isLoading}
            onClick={signIn}
          >
            Masuk dengan Internet Identity
          </Button>
        </VStack>
        <Image
          src="/images/doctor-1.png"
          alt="Doctor 1"
          width={600}
          marginTop="auto"
          display={['none', 'none', 'block']}
        />
      </HStack>

      <HStack
        width="full"
        height="full"
        backgroundColor="white"
        flexDirection={['column', 'column', 'row']}
        alignItems="start"
        paddingX={[4, 4, 12]}
        paddingY={12}
        minHeight={600}
        spacing={8}
      >
        <VStack alignItems="start" textAlign="justify" spacing={4}>
          <Heading as="h3" size="lg" color="brand.500">
            Tentang Kami
          </Heading>
          <Text>
            MyHealth adalah sebuah pusat kesehatan yang didedikasikan untuk memberikan layanan
            kesehatan terbaik dan menyeluruh kepada masyarakat. Dengan komitmen untuk memberikan
            perawatan yang berkualitas, MyHealth menjadi pilihan utama bagi individu dan keluarga
            yang mengutamakan kesehatan dan kesejahteraan mereka.
          </Text>
          <Tabs variant="enclosed" isFitted>
            <TabList color="brand.500">
              <Tab fontWeight="bold">Visi</Tab>
              <Tab fontWeight="bold">Misi</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                Visi kami adalah menciptakan masyarakat yang lebih sehat dan bahagia melalui
                penyediaan layanan kesehatan terdepan. Misi kami adalah memberikan perawatan
                kesehatan yang terjangkau, inovatif, dan terdepan, serta meningkatkan kualitas hidup
                setiap pasien yang percaya kepada kami.
              </TabPanel>
              <TabPanel>
                <List spacing={2}>
                  <ListItem color="brand.500" fontWeight="bold">
                    <ListIcon as={FaCheckCircle} color="brand.500" />
                    Pelayanan Kesehatan Terpadu
                  </ListItem>
                  <Text>
                    MyHealth menawarkan pelayanan kesehatan terpadu yang mencakup berbagai aspek,
                    mulai dari pemeriksaan rutin hingga perawatan penyakit kronis, dengan tim medis
                    yang berkompeten dan berpengalaman.
                  </Text>
                  <ListItem color="brand.500" fontWeight="bold">
                    <ListIcon as={FaCheckCircle} color="brand.500" />
                    Teknologi Terkini
                  </ListItem>
                  <Text>
                    Mengusung konsep kesehatan digital, MyHealth memanfaatkan teknologi terkini
                    untuk mempermudah pasien mengakses informasi kesehatan, membuat janji online,
                    dan mengikuti konsultasi telemedicine.
                  </Text>
                  <ListItem color="brand.500" fontWeight="bold">
                    <ListIcon as={FaCheckCircle} color="brand.500" />
                    Kenyamanan dan Kepuasan Pasien
                  </ListItem>
                  <Text>
                    MyHealth berkomitmen untuk memberikan pengalaman pasien yang nyaman dan
                    memuaskan melalui layanan pendaftaran online, fasilitas yang bersih dan modern,
                    serta pelayanan yang ramah.
                  </Text>
                </List>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
        <SimpleGrid spacing={4} width="full" justifyContent={'center'}>
          <Image
            src="/icons/myhealth-logo.png"
            alt="Hospital 4"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderRadius={24}
          />
        </SimpleGrid>
      </HStack>

      <VStack
        justifyContent="center"
        textAlign="center"
        width="full"
        height="full"
        paddingX={[4, 4, 12]}
        paddingY={12}
        minHeight={400}
        spacing={4}
      >
        <Heading as="h2" size="xl" color="brand.500">
          Mitra Kami
        </Heading>
        <Text>
          MyHealth sudah dipercayai oleh berbagai rumah sakit ternama yang ada di Indonesia
          untuk di terapkan pada rumah sakit mereka.
        </Text>
        <HStack flexWrap="wrap" justifyContent="center" spacing={5}>
          <Card
            width="10rem"
            height="5rem"
            display="flex"
            justifyContent="center"
            borderColor="brand.50"
            alignItems="center"
            backgroundColor="white"
            padding={2}
            borderWidth={1}
            borderRadius={8}
          >
            <Image
              src="images/rs-1.png"
              width="50"
              height="50"
              alt="partnership1"
              boxShadow="sm"
              rounded="md"
              borderTopLeftRadius={8}
            />
          </Card>
          <Card
            width="10rem"
            height="5rem"
            display="flex"
            justifyContent="center"
            borderColor="brand.50"
            alignItems="center"
            backgroundColor="white"
            padding={2}
            borderWidth={1}
            borderRadius={8}
          >
            <Image
              justifyContent="center"
              src="images/rs-2.png"
              width="50"
              height="50"
              alt="partnership1"
              boxShadow="sm"
              rounded="md"
              borderTopLeftRadius={8}
            />
          </Card>
          <Card
            width="10rem"
            height="5rem"
            display="flex"
            justifyContent="center"
            borderColor="brand.50"
            alignItems="center"
            backgroundColor="white"
            padding={2}
            borderWidth={1}
            borderRadius={8}
          >
            <Image
              justifyContent="center"
              src="images/rs-3.png"
              width="50"
              height="50"
              alt="partnership1"
              boxShadow="sm"
              rounded="md"
              borderTopLeftRadius={8}
            />
          </Card>
          <Card
            width="10rem"
            height="5rem"
            display="flex"
            justifyContent="center"
            borderColor="brand.50"
            alignItems="center"
            backgroundColor="white"
            padding={2}
            borderWidth={1}
            borderRadius={8}
          >
            <Image
              justifyContent="center"
              src="images/rs-4.png"
              width="50"
              height="50"
              alt="partnership1"
              boxShadow="sm"
              rounded="md"
              borderTopLeftRadius={8}
            />
          </Card>
          <Card
            width="10rem"
            height="5rem"
            display="flex"
            justifyContent="center"
            borderColor="brand.50"
            alignItems="center"
            backgroundColor="white"
            padding={2}
            borderWidth={1}
            borderRadius={8}
          >
            <Image
              justifyContent="center"
              src="images/rs-5.png"
              width="50"
              height="50"
              alt="partnership1"
              boxShadow="sm"
              rounded="md"
              borderTopLeftRadius={8}
            />
          </Card>
        </HStack>
      </VStack>

      <HStack
        width="full"
        height="full"
        alignItems="center"
        background="white"
        flexDirection={['column', 'column', 'row']}
        paddingX={[4, 4, 12]}
        paddingY={12}
        minHeight={600}
        spacing={8}
      >
        <SimpleGrid columns={2} spacing={4} width="full">
          <Image
            src="/images/hospital-1.jpg"
            alt="Hospital 1"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopLeftRadius={24}
          />
          <Image
            src="/images/hospital-2.jpg"
            alt="Hospital 2"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopRightRadius={24}
          />
          <Image
            src="/images/hospital-3.jpg"
            alt="Hospital 3"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderBottomLeftRadius={24}
          />
          <Image
            src="/images/hospital-4.jpg"
            alt="Hospital 4"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderBottomRightRadius={24}
          />
        </SimpleGrid>
        <VStack alignItems="start" spacing={4} textAlign="justify">
          <Heading as="h3" size="lg" color="brand.500">
            Kenapa MyHealth?
          </Heading>
          <Text>
            Terpilihnya MyHealth sebagai Pilihan Unggul tidak terlepas dari dedikasi kami untuk memberikan pengalaman kesehatan terbaik kepada setiap pasien. Keunggulan dan nilai tambah yang kami hadirkan menjadi landasan utama bagi kepuasan dan kesejahteraan Anda.
          </Text>
          <List spacing={2}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth memimpin era kesehatan modern dengan memanfaatkan teknologi terkini.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              Platform digital terintegrasi kami mempermudah pasien untuk mengakses informasi kesehatan, membuat janji dokter, dan mengelola data medis dengan keefisienan yang belum pernah terjadi sebelumnya.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth merancang pelayanan dengan penuh perhatian untuk menciptakan pengalaman positif bagi setiap pengguna.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth menyediakan teknologi pemantauan kesehatan terkini untuk membantu pasien memantau status kesehatannya secara real time.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              Keamanan data pasien menjadi prioritas utama MyHealth dengan menerapkan sistem keamanan tinggi.
            </ListItem>
          </List>
          <Text>
            MyHealth bukan hanya sekadar penyedia layanan kesehatan, melainkan mitra strategis dalam perjalanan manajemen rumah sakit. Fokus utama kami adalah kepuasan pasien, penerapan teknologi terkini, dan pelayanan yang memberikan dampak positif bagi kesehatan masyarakat. Sebagai vendor sistem manajemen rumah sakit, MyHealth hadir untuk mendukung efisiensi dan kualitas layanan kesehatan di institusi Anda.
          </Text>
        </VStack>
      </HStack>

      <HStack
        width="full"
        height="full"
        alignItems="center"
        paddingX={[4, 4, 12]}
        paddingTop={4}
        spacing={12}
      >
        <Image
          src="/images/doctor-2.png"
          alt="Doctor 2"
          width={500}
          marginTop="auto"
          display={['none', 'none', 'block']}
        />
        <VStack alignItems="start" width="full" paddingY={12}>
          <Heading as="h2" size="xl" color="brand.500">
            Mencari platform medis yang profesional dan terpercaya?
          </Heading>
          <Text fontSize="md" textAlign="justify">
            Jangan ragu untuk menghubungi kami.
          </Text>
          <Textarea placeholder="Pesan Anda" backgroundColor="white" />
          <Button colorScheme="brand">Kirim Pesan</Button>
        </VStack>
      </HStack>
    </HomeLayout>
  );
};

export default Home;
