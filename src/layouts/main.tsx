import React, { ReactNode } from "react"
import Head from "next/head"
import { Box, Container, useColorModeValue,} from "@chakra-ui/react"
import Navbar from "~/components/Features/Post/components/Navigation"
import Footer from "~/components/ui/footer"

interface HomePageProps {
    children: ReactNode
    router?: any
}

const MainLayout: React.FC<HomePageProps> = ({ children, router }) => {
    return (
        <Box as="main">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Web - Dates</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar path={router}/>
            <Container maxW="container.md" pt={14}>
                { children }
            </Container>
            <Footer/>
        </Box>
    )
}

export default MainLayout