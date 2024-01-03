import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';

const Navbar = () => {
  return (
    <Box
      as="header"
      width="full"
      height={85}
      backgroundColor={'rgba(247, 250, 252, 0.8)'}
      backdropFilter="blur(10px)"
      position="fixed"
      zIndex={5}
    >
      <Container as="nav" maxWidth="container.lg" height="full" paddingY={2} centerContent>
        <HStack justifyContent="space-between" alignItems="center" width="full" height="full">
          <Heading as="h3" size="lg" color="blue.500">
            MyHealth
          </Heading>

          <HStack spacing={8} display={['none', 'none', 'flex']}>
            <Button variant="link">Beranda</Button>
            <Button variant="link">Pelayanan</Button>
            <Button variant="link">Tentang</Button>
            <Button variant="link">Kontak</Button>
          </HStack>

          <Button colorScheme="blue" display={['none', 'none', 'flex']}>
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
              <MenuItem>Masuk</MenuItem>
              <MenuDivider />
              <MenuItem>Beranda</MenuItem>
              <MenuItem>Pelayanan</MenuItem>
              <MenuItem>Tentang</MenuItem>
              <MenuItem>Kontak</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;
