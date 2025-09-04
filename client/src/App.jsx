import React from "react";
import { Shell, Container, Title, Sub } from "./pages/ItemsPage.styled";
import ItemsPage from "./pages/ItemsPage";


export default function App() {
return (
<Shell>
<Container>
<Title>Items</Title>
<Sub>CRUD demo with phone validation via microservice</Sub>
<ItemsPage />
</Container>
</Shell>
);
}