import { Box } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box className="flex justify-center items-center text-center opacity-40 text-sm p-4">
      &copy; {new Date().getFullYear()} Build with t3 Stack, made with love 💖.
    </Box>
  )
}

export default Footer
