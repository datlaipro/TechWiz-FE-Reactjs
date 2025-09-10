import React from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Paper,
  IconButton,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

const InfoProduct = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          variant='fullWidth'
          value={value}
          onChange={handleChange}
          aria-label="product tabs"
          centered
          TabIndicatorProps={{ style: { backgroundColor: '#F86D72' } }}
        >
          <Tab
            label={<Typography variant="h6" style={{ color: value === 0 ? '#F86D72' : 'inherit' }}>Description</Typography>}
          />
          <Tab
            label={<Typography variant="h6" style={{ color: value === 1 ? '#F86D72' : 'inherit' }}>Information</Typography>}
          />
          <Tab
            label={<Typography variant="h6" style={{ color: value === 2 ? '#F86D72' : 'inherit' }}>Shipping & Return</Typography>}
          />
          <Tab
            label={<Typography variant="h6" style={{ color: value === 3 ? '#F86D72' : 'inherit' }}>Reviews (02)</Typography>}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {/* <Typography variant="h6">Product Description</Typography>
        <br /> */}
        <Typography variant="h6">
        Steven Johnson is a true master of the history of ideas. In this book, he focuses on 
        just six technologies and explores their ramifications, both good and bad. 
        He has created a hummingbird symbol for the types of inventions that interest him: 
        the co-evolution of flowers and insects – intruders from another order of creation. 
        This book is a collection of completely unexpected “hummingbird inventions”. The six themes presented are: 
        Glass, Refrigeration, Sound, Cleaning, Time, Light.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            {/* <ListItemText primary="The book's highlight is its engaging storytelling style." /> */}
            <Typography variant="h6">The book's highlight is its engaging storytelling style.</Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            {/* <ListItemText primary="which ties together historical pieces in a vivid and easy-to-understand way." /> */}
            <Typography variant="h6">Which ties together historical pieces in a vivid and easy-to-understand way.</Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            {/* <ListItemText primary="helping readers see that progress comes from connection and creativity." /> */}
            <Typography variant="h6">Helping readers see that progress comes from connection and creativity.</Typography>
          </ListItem>
        </List>
        <Typography variant="h6">
        Not just describing technology, Johnson analyzes how small improvements 
        in each invention led to major turning points in human history – such 
        as the invention of the microscope that advanced medicine, the refrigeration 
        system that changed the way food was preserved globally, 
        or the highly accurate clock that supported maritime activities and world trade.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6">There are 6 outstanding inventions in the book</Typography>
        <Typography variant="h6">
        These are glass, refrigeration, sound, hygiene, time
        These contents may sound abstract but in fact their applications have brought many innovations to life.
        Overall, Steven Johnson shows that great innovations are not just due to individual geniuses, 
        but are the result of an entire innovation ecosystem, where small ideas connect and create huge breakthroughs.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h6">Shipping</Typography>
        <Typography variant="h6">
        We will support customers to place orders and deliver products to customers within 7 working days.
        If orders are placed on holidays, we will also process them but it will be 1 day later than usual
        </Typography>
        <Typography variant="h6">
        Products delivered to customers will fully meet delivery standards.
        </Typography>
        <Typography variant="h6">Returns Policy</Typography>
        <Typography variant="h6">
        All products received by customers but not intact will be refunded immediately
Customers will be able to return the product within 7 days for any reason
After 7 days, customers will be able to exchange the product with a 10% fee for unused products
For used products, we will buy back at a value of 2% of the original value for charity
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ReviewBox />
      </TabPanel>
    </Container>
  );
};

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </Box>
);

const ReviewBox = () => ( // Box này sẽ hiển thị thông tin review, dữ liệu review, và form review
  <Box>
    <ReviewItem
      imageSrc="/demo/images/review-image1.jpg"
      author="Tom Johnson"
      date="07/02/2025"
      text="This book has opened my eyes to a lot of useful knowledge about human progress."
    />
    <ReviewItem
      imageSrc="/demo/images/review-image2.jpg"
      author="Jenny Willis"
      date="06/03/2025"
      text="I really admire the creativity and intelligence of scientists. They have made my life today better and easier."
    />
    <AddReview />
  </Box>
);

const ReviewItem = ({ imageSrc, author, date, text }) => (
  <Box display="flex" mb={3}>
    <Paper>
      <img src={imageSrc} alt="review" style={{ width: 100, height: 100, objectFit: 'cover' }} />
    </Paper>
    <Box ml={2}>
      <Rating value={5} readOnly />
      <Typography variant="subtitle1">{author}</Typography>
      <Typography variant="body1" color="textSecondary">
        {date}
      </Typography>
      <Typography variant="h6">{text}</Typography>
    </Box>
  </Box>
);

const AddReview = () => (
  <Box mt={3}>
    <Typography variant="h6">Add a review</Typography>
    <Typography variant="h6">Your email address will not be published. Required fields are marked *</Typography>
    <Box component="form" mt={2}>
      <Box display="flex" gap={2} mb={2}>
        <TextField name="name" label="Write your name here *" fullWidth />
        <TextField name="email" label="Write your email here *" fullWidth />
      </Box>
      <TextField
        name="review"
        label="Write your review here *"
        multiline
        rows={4}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={<Checkbox required />}
        label="Save my name, email, and website in this browser for the next time."
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  </Box>
);

export default InfoProduct;
