import { createGlobalStyle } from "styled-components";


export const GlobalStyle = createGlobalStyle`
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
body { margin: 0; }
button { font: inherit; }
input, select, textarea { font: inherit; }
`;