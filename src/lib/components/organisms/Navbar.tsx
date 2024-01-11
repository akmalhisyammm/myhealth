'use client';

import { useContext } from 'react';
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';
import { FaCalendarAlt, FaKey, FaNotesMedical, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { SiInternetcomputer } from 'react-icons/si';

import { AuthContext } from '@/lib/contexts/auth';
import { usePathname, useRouter } from 'next/navigation';

type NavbarProps = {
  isLoggedIn?: boolean;
};

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const { user, isLoading, signIn, signOut } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const onSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Berhasil keluar!',
        description: 'Anda diarahkan ke halaman beranda.',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Gagal keluar!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      as="header"
      width="full"
      position="fixed"
      backgroundColor={isLoggedIn ? 'white' : 'rgba(247, 250, 252, 0.8)'}
      backdropFilter={isLoggedIn ? 'none' : 'blur(10px)'}
      borderBottomWidth={2}
      height={85}
      zIndex={5}
    >
      <Container
        as="nav"
        height="full"
        maxWidth={isLoggedIn ? 'full' : 'container.xl'}
        paddingX={[4, 4, 8]}
        paddingY={2}
        centerContent
      >
        <HStack
          width="full"
          height="full"
          alignItems="center"
          justifyContent={isLoggedIn ? ['start', 'start', 'space-between'] : 'space-between'}
          spacing={4}
        >
          {isLoggedIn && (
            <>
              <IconButton
                aria-label="Navigation menu"
                display={['flex', 'flex', 'none']}
                icon={<BiMenu />}
                onClick={onOpen}
              />
              <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader color="brand.500" fontWeight={700} borderBottomWidth={1}>
                    MyHealth
                  </DrawerHeader>
                  <DrawerBody>
                    <VStack alignItems="stretch">
                      <Button
                        variant={pathname === '/main/dashboard' ? 'solid' : 'ghost'}
                        colorScheme="brand"
                        size="lg"
                        justifyContent="start"
                        leftIcon={<MdDashboard />}
                        onClick={() => router.push('/main/dashboard')}
                      >
                        Dashboard
                      </Button>
                      {['doctor', 'patient'].includes(user?.role || '') && (
                        <Button
                          variant={pathname === '/main/appointments' ? 'solid' : 'ghost'}
                          colorScheme="brand"
                          size="lg"
                          justifyContent="start"
                          leftIcon={<FaCalendarAlt />}
                          onClick={() => router.push('/main/appointments')}
                        >
                          Janji Temu
                        </Button>
                      )}
                      {['doctor', 'nurse', 'patient'].includes(user?.role || '') && (
                        <Button
                          variant={pathname === '/main/medical-records' ? 'solid' : 'ghost'}
                          colorScheme="brand"
                          size="lg"
                          justifyContent="start"
                          leftIcon={<FaNotesMedical />}
                          onClick={() => router.push('/main/medical-records')}
                        >
                          Rekam Medis
                        </Button>
                      )}
                      {['admin'].includes(user?.role || '') && (
                        <Button
                          variant={pathname === '/main/verify-users' ? 'solid' : 'ghost'}
                          colorScheme="brand"
                          size="lg"
                          justifyContent="start"
                          leftIcon={<FaKey />}
                          onClick={() => router.push('/main/verify-users')}
                        >
                          Verifikasi Pengguna
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        colorScheme="red"
                        size="lg"
                        justifyContent="start"
                        leftIcon={<FaSignOutAlt />}
                        onClick={onSignOut}
                      >
                        Keluar
                      </Button>
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          )}

          <Heading as="h3" size="lg" color="brand.500">
            MyHealth
          </Heading>

          {isLoggedIn ? (
            <Button
              colorScheme="red"
              display={['none', 'none', 'flex']}
              leftIcon={<FaSignOutAlt />}
              onClick={onSignOut}
            >
              Keluar
            </Button>
          ) : (
            <>
              <HStack spacing={8} display={['none', 'none', 'flex']}>
                <Button variant="link">Beranda</Button>
                <Button variant="link">Tentang</Button>
                <Button variant="link">Dokter</Button>
                <Button variant="link">Pelayanan</Button>
                <Button variant="link">Kontak</Button>
              </HStack>

              <Button
                colorScheme="brand"
                display={['none', 'none', 'flex']}
                loadingText="Masuk"
                isLoading={isLoading}
                onClick={signIn}
                leftIcon={<SiInternetcomputer />}
              >
                Masuk
              </Button>

              <Menu isLazy>
                <MenuButton
                  as={IconButton}
                  aria-label="Navigation menu"
                  display={['flex', 'flex', 'none']}
                  icon={<BiMenu />}
                />
                <MenuList>
                  <MenuItem onClick={signIn}>Masuk</MenuItem>
                  <MenuDivider />
                  <MenuItem>Beranda</MenuItem>
                  <MenuItem>Pelayanan</MenuItem>
                  <MenuItem>Tentang</MenuItem>
                  <MenuItem>Kontak</MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;
