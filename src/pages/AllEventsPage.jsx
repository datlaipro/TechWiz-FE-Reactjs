import React, { useState } from "react";
import { Container } from "@mui/material";
import EventFilterBar from "../components/filters/EventFilterBar";
import ProductList from "../components/display/product/ProductList";

export default function AllEventsPage() {
  const [filters, setFilters] = useState({
    searchQuery: "",
    department: "",
    eventType: "",
    dateFrom: "",
    dateTo: "",
    sort: "",
  });

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Chỉ còn thanh lọc trên đầu */}
      <EventFilterBar filters={filters} setFilters={setFilters} />

      {/* Lưới kết quả bên dưới */}
      <ProductList filters={filters} />
    </Container>
  );
}
