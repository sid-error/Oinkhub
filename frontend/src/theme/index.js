import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    body: `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },
  colors: {
    brand: {
      50: "#FFF5F7",
      100: "#FFE4E9",
      200: "#FFC9D4",
      300: "#FF9FAD",
      400: "#FF7A8F",
      500: "#EC4D6A",
      600: "#D93D5C",
      700: "#B82E4A",
      800: "#8B2238",
      900: "#5C1626",
    },
    black: {
      50: "#1a1a1a",
      100: "#000000",
      200: "#0d0d0d",
      300: "#141414",
      400: "#1c1c1c",
      500: "#242424",
      600: "#2c2c2c",
      700: "#363636",
      800: "#404040",
      900: "#4a4a4a",
    },
  },
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "xl",
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "xl",
          bg: "whiteAlpha.100",
          color: "white",
          _placeholder: {
            color: "whiteAlpha.500",
          },
        },
      },
      defaultProps: {
        focusBorderColor: "brand.400",
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "gray.900",
          borderRadius: "2xl",
          boxShadow: "xl",
          color: "white",
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "gray.900",
          borderTopRightRadius: "2xl",
          borderBottomRightRadius: "2xl",
          color: "white",
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "gray.900",
          borderColor: "whiteAlpha.200",
        },
        item: {
          bg: "gray.900",
          _hover: {
            bg: "whiteAlpha.100",
          },
          _focus: {
            bg: "whiteAlpha.100",
          },
        },
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
