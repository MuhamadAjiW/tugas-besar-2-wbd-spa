import { Box, Heading, Container, Text, Stack, Image } from "@chakra-ui/react";
import logoImage from "@assets/logo.svg"; // Assuming this is the correct path to your image
import TopBar from "@components/TopBar";
import { useEffect } from "react";
import { getAccountID } from "@utils/AuthUtil";
import { useCookies } from "react-cookie";

const Home = () => {
  // TODO: Delete later (Testing purposes)
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    getAccountID(cookies.token)
      .then((result) => {
        console.log(result['data']);
      });
  }, [])
  
  return (
    <>
      <Box>
        <TopBar />
        <Container maxW={"3xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            spacing={{ base: 0, md: 0 }}
            py={{ base: 0, md: 6 }}
          >
            <Image
              src={logoImage}
              alt="Logo"
              boxSize="200px"
              mx="auto"
              mb={4}
            />
            <Heading
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Welcome To Platform <br />
              <Text as={"span"} color={"yellow.400"}>
                Baca.a
              </Text>
            </Heading>
            <Text color={"black"} mt={8}>
              Baca.a merupakan platform untuk mendengarkan audiobook yang dapat
              diakses secara gratis dan dapat diakses dimana saja dan kapan
              saja. Baca.a juga menyediakan fitur untuk membuat pengguna nyaman
              dalam menggunakannya. Telah digunakan oleh 2+ pengguna
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;