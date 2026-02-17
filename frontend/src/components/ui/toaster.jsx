
import { Toaster as ChakraToaster } from "@chakra-ui/react"
import { toaster } from "./toaster-utils"

export const Toaster = () => {
    return <ChakraToaster toaster={toaster} />
}
