import React, { useState } from 'react';
import { Grid, Container } from '@mui/material';
import ProductList from '../../components/display/product/ProductList';
import Sidebar from '../../components/display/free/Sidebar';
import ProductFilter from '../../components/display/free/ProductFilter';
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent';
import CustomerReviewsSlider from '../../components/action/CustomerReviewsSlider';
import InstagramGallery from '../../components/display/GroupItems/InstagramGallery';
import LatestPosts from '../../components/display/post/LatestPosts';

const ShopPage = () => {
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    language: '',
    priceRange: '',
    searchQuery: '',
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <BreadcrumbsComponent
        title="Shop"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop' },
        ]}
      />
      <Container
        maxWidth="90%"
        sx={{
          paddingY: 4,
          width: { xs: '95%', md: '90%' },
          marginX: 'auto',
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={2}>
            <Sidebar onFilterChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} md={10}>
            <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
            <ProductList filters={filters} />
          </Grid>
        </Grid>
      </Container>
      <CustomerReviewsSlider />
      <InstagramGallery />
      <LatestPosts />
    </>
  );
};

export default ShopPage;