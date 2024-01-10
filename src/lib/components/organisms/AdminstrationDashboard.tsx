'use client';

import { useContext, useEffect, useState } from 'react';
import { User } from '@/contract';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'

import { AuthContext } from '@/lib/contexts/auth';
import type { Result } from 'azle';
import { nat64ToDate } from '@/lib/utils/date';
import { Principal } from '@dfinity/principal';
import dayjs from 'dayjs';
import { FaInfo } from 'react-icons/fa';

const AdminstrationDashboard = () => {
	// const [roles, setRoles] = useState<User[]>([]);
	// const [doctorDetail, setDoctorDetail] = useState<User | null>(null);

	// const { actor } = useContext(AuthContext);

	// const onOpenDetail = async (user: User) => {
	// 	if (!actor) return;

	// 	const doctor: Result<any, Error> = await actor.getUser(
	// 		Principal.fromText(user.id.toText())
	// 	);

	// 	setDoctorDetail(doctor.Ok || null)
	// }

	return (
		<VStack
			width="full"
			alignItems="start"
			backgroundColor="white"
			boxShadow="md"
			padding={8}
			borderWidth={1}
			borderRadius={8}
			spacing={4}>
			<Heading as="h6" size="md" color="brand.500">
				Role
			</Heading>
			<Accordion width="full" allowToggle>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box as="span" flex='1' textAlign='left'>
								Section 1 title
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<TableContainer>
							<Table variant="simple">
								<Thead backgroundColor="brand.50">
									<Tr>
										<Th>No</Th>
										<Th>Nama Lengkap</Th>
										<Th>Jenis Kelamin</Th>
										<Th>Tanggal Lahir</Th>
										<Th>NIK/NIP</Th>
										<Th>Aksi</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>
											1
										</Td>
										<Td>
											Rilo Anggoro Saputra
										</Td>
										<Td>
											Laki-Laki
										</Td>
										<Td>
											07-10-2001
										</Td>
										<Td>
											0000000000000000
										</Td>
										<Td>
											<IconButton
												aria-label="Detail"
												colorScheme="brand"
												icon={<FaInfo />}

											/>
										</Td>
									</Tr>

								</Tbody>
							</Table>
						</TableContainer>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box as="span" flex='1' textAlign='left'>
								Section 2 title
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
						veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</VStack>
	)
}

export default AdminstrationDashboard