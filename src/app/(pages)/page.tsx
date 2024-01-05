'use client';

import { useContext } from 'react';
import {
  Button,
  Card,
  CardHeader,
  FormControl,
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

const Home = () => {
  const { isLoading, signIn } = useContext(AuthContext);

  return (
    <HomeLayout>
      <HStack
        width="full"
        height="full"
        alignItems="center"
        color="white"
        backgroundColor="brand.500"
        paddingX={[4, 4, 12]}
        marginBottom={8}
        minHeight={650}
        spacing={12}
      >
        <VStack alignItems="start" paddingY={12}>
          <Heading as="h2" size="xl" lineHeight={1.5}>
            <Highlight
              query={['Memahami', 'Membimbing']}
              styles={{ px: '3', py: '0.2', rounded: '12', backgroundColor: 'brand.50' }}
            >
              Bersama Kami, Kesehatan Bukan Hanya Layanan Medis, Tetapi Pengalaman Peduli yang
              Memahami dan Membimbing Setiap Langkah Perjalanan Anda!
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
            leftIcon={<Image src="icons/icp-logo.png" alt="ICP Logo" width={[18, 30, 30]} />}
            isLoading={isLoading}
            onClick={signIn}
          >
            Masuk dengan Internet Identity
          </Button>
        </VStack>
        <Image
          src="images/doctor-1.png"
          alt="Doctor 1"
          width={600}
          marginTop="auto"
          display={['none', 'none', 'block']}
        />
      </HStack>

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
            src="images/hospital-1.jpg"
            alt="Hospital 1"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopLeftRadius={24}
          />
          <Image
            src="images/hospital-2.jpg"
            alt="Hospital 2"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopRightRadius={24}
          />
          <Image
            src="images/hospital-3.jpg"
            alt="Hospital 3"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderBottomLeftRadius={24}
          />
          <Image
            src="images/hospital-4.jpg"
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
            MyHealth menjadi pilihan unggul karena menyajikan pengalaman kesehatan yang terbaik bagi
            setiap pasien, ditandai oleh berbagai keunggulan dan nilai tambah yang dihadirkannya:
          </Text>
          <List spacing={2}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth memanfaatkan teknologi terkini dengan menyajikan platform digital
              terintegrasi yang memudahkan pasien mengakses informasi kesehatan mereka, membuat
              janji dokter, dan mengelola data medis secara efisien.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              Dengan pendekatan terintegrasi, MyHealth mengkoordinasikan berbagai aspek perawatan
              kesehatan, mulai dari diagnosis hingga pemantauan pasca-perawatan.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              Pelayanan MyHealth didesain untuk memberikan pengalaman pasien yang positif, dengan
              staf yang ramah dan perhatian terhadap kebutuhan individual.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth menyediakan teknologi pemantauan kesehatan terkini untuk membantu pasien
              dalam memantau kondisi kesehatan mereka secara real-time.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              Keamanan data pasien merupakan prioritas utama MyHealth, dengan menerapkan sistem
              keamanan tinggi dan kebijakan privasi yang ketat.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="brand.500" />
              MyHealth bukan sekadar penyedia layanan kesehatan, tetapi menjadi mitra perjalanan
              kesehatan pasien dengan fokus pada kepuasan pasien, teknologi terkini, dan pelayanan
              yang memberikan dampak positif bagi kesehatan masyarakat.
            </ListItem>
          </List>
          <Text>
            Melalui kombinasi inovasi teknologi, pelayanan terintegrasi, pengalaman pasien yang
            personal, keamanan data, dan promosi kesehatan preventif, MyHealth menjadi destinasi
            yang menarik bagi pasien yang mencari perawatan kesehatan yang komprehensif dan
            berorientasi pada kebutuhan individu mereka
          </Text>
        </VStack>
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
          Departemen Kami
        </Heading>
        <Text>
          Setiap departemen di MyHealth memiliki peran yang krusial dalam memberikan pelayanan
          kesehatan terbaik dan menciptakan lingkungan perawatan yang menyeluruh dan efisien. Kerja
          sama antar departemen adalah kunci untuk memberikan perawatan kesehatan yang terkoordinasi
          dan terintegrasi.
        </Text>
        <HStack flexWrap="wrap" justifyContent="center" spacing={4}>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Penyakit Dalam
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                THT
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Jantung
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Bedah
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Radiologi
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Laboratorium
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Jiwa
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Anak
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Gizi
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Kedokteran Nuklir
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Rehabilitasi Medik
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Gigi & Mulut
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Mata
              </Heading>
            </CardHeader>
          </Card>
          <Card backgroundColor="brand.500" borderRadius={12}>
            <CardHeader>
              <Heading as="h6" size="sm" color="white">
                Kulit & Kelamin
              </Heading>
            </CardHeader>
          </Card>
        </HStack>
      </VStack>

      <HStack
        width="full"
        height="full"
        background="white"
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
        <SimpleGrid columns={2} spacing={4} width="full" justifyContent={'center'}>
          <Image
            src="images/hospital-1.jpg"
            alt="Hospital 1"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopLeftRadius={24}
          />
          <Image
            src="images/hospital-2.jpg"
            alt="Hospital 2"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderTopRightRadius={24}
          />
          <Image
            src="images/hospital-3.jpg"
            alt="Hospital 3"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderBottomLeftRadius={24}
          />
          <Image
            src="images/hospital-4.jpg"
            alt="Hospital 4"
            width="full"
            boxShadow="sm"
            rounded="md"
            borderBottomRightRadius={24}
          />
        </SimpleGrid>
      </HStack>

      <HStack width="full" height="full" alignItems="center" paddingX={[4, 4, 12]} spacing={12}>
        <Image
          src="images/doctor-2.png"
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
          <FormControl>
            <Textarea placeholder="Pesan Anda..." />
          </FormControl>
          <Button colorScheme="brand">Kirim Pesan</Button>
        </VStack>
      </HStack>
    </HomeLayout>
  );
};

export default Home;
