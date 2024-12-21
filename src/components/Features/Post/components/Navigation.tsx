import React, { forwardRef } from "react";
import NextLink from "next/link";
import {
    Container,
    Box,
    Link,
    Stack,
    Text,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    IconButton,
    Wrap,
    WrapItem,
    Avatar,
    Button,
    useColorModeValue,
} from "@chakra-ui/react";
import { AlignJustify } from "lucide-react";
import { signIn, useSession, signOut } from "next-auth/react";
import { ThemeButton } from "~/components/ui/theme-toggle";

type LinkProps = {
    href: string;
    path: string;
    target?: string;
    children: React.ReactNode;
}

type MenuLinkProps = React.ComponentProps<typeof Link> & {
    href: string;
}

const LinkItem: React.FC<LinkProps> = ({ href, path, target, children, ...props }) => {
    const active = path === href;
    const inactiveColor = useColorModeValue("gray.800", "whiteAlpha.900");

    return (
        <Link
            as={NextLink}
            href={href}
            scroll={false}
            p={2}
            bg={active ? "grassTeal" : undefined}
            color={active ? "#202023" : inactiveColor}
            target={target}
            {...props}
        >
            {children}
        </Link>
    );
}

const MenuLink = forwardRef<HTMLAnchorElement, MenuLinkProps>(
    ({ href, ...props }, ref) => (
        <Link as={NextLink} href={href} ref={ref} {...props} />
    )
);

MenuLink.displayName = "MenuLink";

type NavbarProps = {
    path: string;
};

const Navbar: React.FC<NavbarProps> = ({ path }) => {
    const { data } = useSession();

    return (
        <Box
            position="fixed"
            as="nav"
            w="100%"
            bg={useColorModeValue("#ffffff40", "#20202380")}
            style={{ backdropFilter: "blur(10px)" }}
            zIndex={1}
        >
            <Container
                display="flex"
                p={2}
                maxW="container.md"
                alignItems="center"
                justifyContent="space-between"
            >
                {
                    data?.user ?
                    <Flex align="center" mr={5}>
                    <Wrap>
                        <WrapItem>
                            <Avatar src={data?.user.image ?? " "} size='md'/>
                        </WrapItem>
                    </Wrap>
                    <Box ml={3}>
                        <Text fontSize="md" fontWeight="semibold">
                            {data?.user.name}
                        </Text>
                    </Box>
                </Flex> : null

                }

                {
                    data?.user ? 
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        display={{ base: "none", md: "flex" }}
                        width={{ base: "full", md: "auto" }}
                        alignItems="center"
                        flexGrow={1}
                        mt={{ base: 4, md: 0 }}
                    >
                        <LinkItem href="/" path={path}>
                            Wishlist
                        </LinkItem>
                        <LinkItem href="/" path={path}>
                            To Do
                        </LinkItem>
                    </Stack> : null
                }
                
                <Box flex={1} textAlign="right">
                    {
                        data?.user ? <Button colorScheme='gray' className="mr-2" onClick={() => signOut()}>Log Out</Button> : <Button colorScheme='gray' className="mr-2" onClick={() => signIn("google")}>Log In</Button>
                    }
                    <ThemeButton />
                    {
                        data?.user ?
                        <Box ml={2} display={{ base: "inline-block", md: "none" }}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<AlignJustify />}
                                variant="outline"
                                aria-label="Options"
                            />
                            <MenuList>
                                <MenuItem as={MenuLink} href="/">
                                    Wishlist
                                </MenuItem>
                                <MenuItem as={MenuLink} href="/">
                                    To Do
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box> : null
                    }
                </Box>
            </Container>
        </Box>
    );
};

export default Navbar;
