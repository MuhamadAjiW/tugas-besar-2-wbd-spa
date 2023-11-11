import React, {useState} from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Heading,
    Flex,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    ModalFooter,
    FormLabel,
    Input,
    InputGroup,
    FormControl,
    Textarea,
  } from '@chakra-ui/react'

import { EditIcon, DeleteIcon, AddIcon, ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Playlist = () => {

    const dummyData = [
        {
            id: 1,
            title: "Playlist 1",
            description: "Ini playlist 1",
            bookCount: 10,
            totalDuration: 200
        },
        {
            id: 2, 
            title: "Playlist 2",
            description: "Ini playlist 2",
            bookCount: 5,
            totalDuration: 100
        },
        {
            id: 3, 
            title: "Playlist 3",
            description: "Ini playlist 3",
            bookCount: 2,
            totalDuration: 40
        },
        {
            id: 4, 
            title: "Playlist 4",
            description: "Ini playlist 4",
            bookCount: 4,
            totalDuration: 80
        },
        {
            id: 5, 
            title: "Playlist 5",
            description: "Ini playlist 5",
            bookCount: 8,
            totalDuration: 150
        }
    ]

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState("")

    // Function to open delete modal
    const openDeleteModal = (title) => {
        setIsDeleteModalOpen(true);
        setPlaylistTitle(title)
    }

    // Function to close delete modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const [isModalOpen, setisModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [modalMode, setModalMode] = useState("add")
    
    // Function to open addmodal
    const openAddModal = () => {
        setisModalOpen(true)
        setModalMode("add")
        setEditItem(null)
    }

    // Function to open edit modal
    const openEditModal = (item) => {
        setisModalOpen(true)
        setModalMode("edit")
        setEditItem(item)
    }

    // Function to close add/edit modal
    const closeModal = () => {
        setisModalOpen(false)
        setModalMode("add")
        setEditItem(null)
    }

    const navigate = useNavigate();

    return (
        <>
            <Sidebar />
            <Flex flex="1" p="20px" marginLeft="13%">
                <Flex
                flexDir="column"
                justifyContent="flex-start"
                alignItems="center"
                >
                    <Flex
                    flexDir="row"
                    justifyContent="space-between"
                    alignItems="center"
                    w="145vh"
                    marginBottom="2rem">
                        <Heading as="h1" size="2xl">Playlists Management</Heading>
                        <IconButton
                            icon={<AddIcon />}
                            variant="outline"
                            colorScheme="green"
                            mr={2}
                            onClick={() => {
                                openAddModal();
                            }}
                        />
                    </Flex>
                    <TableContainer>
                        <Table variant="striped" size="lg" w="145vh" colorScheme="gray">
                            <TableCaption>Author's playlists</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th textAlign="center" verticalAlign="middle">No.</Th>
                                    <Th textAlign="center" verticalAlign="middle">Title</Th>
                                    <Th textAlign="center" verticalAlign="middle">Description</Th>
                                    <Th textAlign="center" verticalAlign="middle">Book Count</Th>
                                    <Th textAlign="center" verticalAlign="middle">Total Duration</Th>
                                    <Th textAlign="center" verticalAlign="middle">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    dummyData.map((item) => (
                                        <Tr key={item.title}>
                                            <Td textAlign="center" verticalAlign="middle">{item.id}</Td>
                                            <Td textAlign="center" verticalAlign="middle">{item.title}</Td>
                                            <Td textAlign="center" verticalAlign="middle">{item.description}</Td>
                                            <Td textAlign="center" verticalAlign="middle">{item.bookCount}</Td>
                                            <Td textAlign="center" verticalAlign="middle">{item.totalDuration}</Td>
                                            <Td textAlign="center" verticalAlign="middle">
                                                <IconButton
                                                    icon={<ViewIcon />}
                                                    variant="outline"
                                                    colorScheme="blue"
                                                    mr={2}
                                                    onClick={() => {
                                                        navigate(`/playlistdetails/${item.id}`, { state: { playlist: item } })
                                                    }}
                                                />
                                                <IconButton
                                                    icon={<EditIcon />}
                                                    variant="outline"
                                                    colorScheme="teal"
                                                    mr={2}
                                                    onClick={() => {
                                                        openEditModal(item)
                                                    }}
                                                />
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    variant="outline"
                                                    colorScheme="red"
                                                    mr={2}
                                                    onClick={() => {
                                                        openDeleteModal(item.title)
                                                    }}
                                                />
                                            </Td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>

                
                <Modal 
                //This is delete modal
                isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader textAlign="center" verticalAlign="middle">Delete Playlist</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody textAlign="center" verticalAlign="middle">
                            Are you sure you want to delete {playlistTitle}?
                        </ModalBody>
                        <ModalFooter textAlign="center" verticalAlign="middle">
                            <Flex
                            flexDir="row"
                            alignItems="center"
                            w="100%"
                            >
                                <Button onClick={closeDeleteModal} style={{color: "white"}} backgroundColor="red.400" w="50%">Delete</Button>
                                <Button onClick={closeDeleteModal} style={{color: "white"}} backgroundColor="blue.100" ml={3} w="50%">Cancel</Button>
                            </Flex>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                // This is add modal
                isOpen={isModalOpen} onClose={closeModal} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader textAlign="center" verticalAlign="middle">{modalMode === "add" ? "Add Playlist" : "Edit Playlist"}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl marginRight="1rem">
                                <FormLabel>Title</FormLabel>
                                <Input placeholder='Title' type='text' value={editItem ? editItem.title : ""} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea placeholder="Your playlist description" size="sm" value={editItem ? editItem.description : ""} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Insert Playlist Cover Image</FormLabel>
                                <Input type="file" accept="image/*" />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={closeModal} colorScheme='blue' mr={3}>
                                Save Playlist
                            </Button>
                            <Button onClick={closeModal}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
        </>
    )
};

export default Playlist;