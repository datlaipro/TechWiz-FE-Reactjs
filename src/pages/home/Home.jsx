import * as React from 'react';
import CompanyServices from "../../components/display/info/CompanyServices";
import LimitedOffer from "../../components/display/free/LimitedOffer";
import BestSellingItems from "../../components/display/GroupItems/BestSellingItems";
import ProductSection from "../../components/display/product/ProductSection";
import CategoriesSection from "../../components/display/info/CategoriesSection";
import CustomerReviewsSlider from "../../components/action/CustomerReviewsSlider";
import LatestPosts from "../../components/display/post/LatestPosts";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import GalleryBook from "../../components/display/GroupItems/GalleryBook";




export default function Home() {
  
  return (
    <>
      <GalleryBook />
      <CompanyServices />
      <BestSellingItems />
      <LimitedOffer />
      <ProductSection />
      <CategoriesSection />
      <CustomerReviewsSlider />
      <LatestPosts />
      <InstagramGallery />

    </>
  );
}