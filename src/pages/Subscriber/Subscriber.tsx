import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
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
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import TopBar from "@components/TopBar";
import { useCookies } from "react-cookie";
import { REST_API_URL } from "@constants/constants";
import { fetchPendingSubscribers, fetchSubscribers } from './SubscriberUtil';
import { getAccountID } from "@utils/AuthUtil";
import { IUser } from "@utils/interfaces/IUser";
import { ISubscribeData } from "@utils/interfaces/ISubscribeData";

const Subscriber = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [subscriberData, setSubscriberData] = useState<ISubscribeData[]>([]);
  const [author_id, setAuthorId] = useState(0);
  const [user_id, setSubscriberId] = useState(0);
  const [pendingSubscriber, setPendingSubscriber] = useState<ISubscribeData[]>([]);

  let rowCount = 1;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberUsername, setSubscriberUsername] = useState("");

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Function to open pending request modal
  const openSubscribeModal = () => {
    setIsSubscribeModalOpen(true);
  };

  // Function to close pending request modal
  const closeSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
  };

  // Function to open delete modal
  const openDeleteModal = (item: IUser) => {
    setIsDeleteModalOpen(true);
    setSubscriberUsername(item.username);
    setSubscriberId(item.user_id);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    getAccountID(cookies.token).then((result) => {
      if(!result.valid){
        removeCookie('token',{path:'/'});
        window.location.href = "/login";
        return;
      }
      setAuthorId(result.data);

      fetchSubscribers(result.data, cookies.token).then((activeSubscribers) => {
        console.log(activeSubscribers);
        if(activeSubscribers.valid){
          setSubscriberData(activeSubscribers.data);
        }
      });
      fetchPendingSubscribers(result.data, cookies.token).then((pendingSubscribers) => {
        if(pendingSubscribers.valid){
          setPendingSubscriber(pendingSubscribers.data);
        }
      });
    })
  }, [])

  // Delete subscribers
  const deleteSubscriber = async () => {
    const token = cookies.token;

    const body = {
      author_id,
      user_id,
    };

    const response = await fetch(
      `${REST_API_URL}/authors/${author_id}/subscribers/requests/${user_id}`,
      {
        method: "DELETE",
        headers: {
          ...(token && {"Authorization": `Bearer ${token}`}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
    } else {
      console.log("Subscriber deleted successfully");

      setSubscriberData((prevSubscribers) =>
        prevSubscribers.filter((item) => item.user_details.user_id !== user_id)
      );

      closeDeleteModal();
    }
  };

  const rejectSubscriber = async (user_id: number) => {
    const token = cookies.token;

    const body = {
      author_id: author_id,
      user_id: user_id,
      status: "REJECT",
    };

    const response = await fetch(
      `${REST_API_URL}/authors/${author_id}/subscribers/requests/${user_id}`,
      {
        method: "PATCH",
        headers: {
          ...(token && {"Authorization": `Bearer ${token}`}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
    } else {
      console.log("Subscriber rejected successfully");

      setPendingSubscriber((prevPendingSubscribers) =>
        prevPendingSubscribers.filter((item) => item.user_details.user_id !== user_id)
      );
    }
  };

  const acceptSubscriber = async (user_id: number) => {
    const token = cookies.token;

    const body = {
      author_id: author_id,
      user_id: user_id,
      status: "ACCEPT",
    };
    console.log(body);

    const response = await fetch(
      `${REST_API_URL}/authors/${author_id}/subscribers/requests/${user_id}`,
      {
        method: "PATCH",
        headers: {
          ...(token && {"Authorization": `Bearer ${token}`}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
    } else {
      console.log("Subscriber accepted successfully");

      setSubscriberData((prevSubscribers) => {
        const acceptedSubscriber = pendingSubscriber.find(
          (item) => item.user_details.user_id === user_id
        );

        if (acceptedSubscriber) {
          return [...prevSubscribers, acceptedSubscriber];
        }

        return prevSubscribers;
      });

      setPendingSubscriber((prevPendingSubscribers) =>
        prevPendingSubscribers.filter((item) => item.user_details.user_id !== user_id)
      );
    }
  };

  return (
    <>
      <TopBar />
      <Flex flex="1" p="20px" flexDirection="column">
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ md: "space-between" }}
          alignItems={{ base: "center", md: "flex-start" }}
          px={{ md: "20px", base: "10px" }}
        >
          <Heading as="h1" size="2xl">
            Subscriber List
          </Heading>
          <Button
            variant="outline"
            colorScheme="black"
            _hover={{ backgroundColor: "black", color: "white" }}
            mr={2}
            onClick={() => {
              openSubscribeModal();
            }}
          >
            Pending Request
          </Button>
        </Flex>
        <TableContainer mt="4">
          <Table variant="striped" size="md" colorScheme="gray">
            <TableCaption>Author's Subscribers</TableCaption>
            <Thead>
              <Tr>
                <Th textAlign="center" verticalAlign="middle">
                  No.
                </Th>
                <Th textAlign="center" verticalAlign="middle">
                  Username
                </Th>
                <Th textAlign="center" verticalAlign="middle">
                  Email
                </Th>
                <Th textAlign="center" verticalAlign="middle">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {subscriberData.map((item) => (
                <Tr key={item.user_id}>
                  <Td textAlign="center" verticalAlign="middle">
                    {rowCount++}
                  </Td>
                  <Td textAlign="center" verticalAlign="middle">
                    {item.user_details.username}
                  </Td>
                  <Td textAlign="center" verticalAlign="middle">
                    {item.user_details.email}
                  </Td>
                  <Td textAlign="center" verticalAlign="middle">
                    <IconButton
                      icon={<DeleteIcon />}
                      variant="outline"
                      colorScheme="red"
                      mr={2}
                      onClick={() => {
                        openDeleteModal(item.user_details);
                      } } aria-label={"Button for rejecting subscriber"}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal
          // This is delete modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" verticalAlign="middle">
              Remove Subscriber
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign="center" verticalAlign="middle">
              Are you sure you want to remove user {subscriberUsername} from
              your subscriber list?
            </ModalBody>
            <ModalFooter textAlign="center" verticalAlign="middle">
              <Flex flexDir="row" alignItems="center" w="100%">
                <Button
                  onClick={deleteSubscriber}
                  style={{ color: "white" }}
                  backgroundColor="red.400"
                  w="50%"
                >
                  Remove
                </Button>
                <Button
                  onClick={closeDeleteModal}
                  style={{ color: "white" }}
                  backgroundColor="blue.100"
                  ml={3}
                  w="50%"
                >
                  Cancel
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          // This is pending request modal
          isOpen={isSubscribeModalOpen}
          onClose={closeSubscribeModal}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" verticalAlign="middle">
              Subscribe Requests
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign="center" verticalAlign="middle">
              <Table variant="simple" w="100%">
                <Thead>
                  <Tr>
                    <Th textAlign="center" verticalAlign="middle">
                      Username
                    </Th>
                    <Th textAlign="center" verticalAlign="middle">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingSubscriber.map((item) => (
                    <Tr key={item.user_id}>
                      <Td textAlign="center" verticalAlign="middle">
                        {item.user_details.username}
                      </Td>
                      <Td textAlign="center" verticalAlign="middle">
                        <Button
                          onClick={() => {
                            acceptSubscriber(item.user_details.user_id);
                            closeSubscribeModal();
                          }}
                          style={{ color: "white" }}
                          backgroundColor="blue.500"
                          ml={3}
                          w="30%"
                        >
                          Confirm
                        </Button>
                        <Button
                          onClick={() => {
                            rejectSubscriber(item.user_details.user_id);
                            closeSubscribeModal();
                          }}
                          style={{ color: "white" }}
                          backgroundColor="red.400"
                          w="30%"
                          marginLeft="10px"
                        >
                          Reject
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default Subscriber;
