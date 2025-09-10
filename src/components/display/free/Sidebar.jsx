import React, { useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  TextField, IconButton, Drawer, Divider, InputAdornment
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const Sidebar = ({ onFilterChange }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handleSearch = () => {
    onFilterChange({ searchQuery });
  };

  const handleCategoryChange = (category) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onFilterChange({ category: newCategory });
  };

  const handleLanguageChange = (language) => {
    const newLanguage = selectedLanguage === language ? '' : language;
    setSelectedLanguage(newLanguage);
    onFilterChange({ language: newLanguage });
  };

  const handlePriceRangeChange = (priceRange) => {
    const newPriceRange = selectedPriceRange === priceRange ? '' : priceRange;
    setSelectedPriceRange(newPriceRange);
    onFilterChange({ priceRange: newPriceRange });
  };

  const filterContent = (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <List>
          {['Novels', 'Romance', 'Ngoại Ngữ', 'Literature', 'Detective'].map((category) => (
            <ListItem
              button
              key={category}
              onClick={() => handleCategoryChange(category)}
              sx={{
                borderRadius: 1,
                transition: 'background-color 0.2s ease',
                backgroundColor: selectedCategory === category ? 'primary.light' : 'transparent',
                color: selectedCategory === category ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  backgroundColor: selectedCategory === category ? 'primary.light' : 'grey.200',
                },
              }}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Language
        </Typography>
        <List>
          {['English', 'Tiếng Việt', 'Chinese', 'Russian', 'French'].map((language) => (
            <ListItem
              button
              key={language}
              onClick={() => handleLanguageChange(language)}
              sx={{
                borderRadius: 1,
                transition: 'background-color 0.2s ease',
                backgroundColor: selectedLanguage === language ? 'primary.light' : 'transparent',
                color: selectedLanguage === language ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  backgroundColor: selectedLanguage === language ? 'primary.light' : 'grey.200',
                },
              }}
            >
              <ListItemText primary={language} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Price
        </Typography>
        <List>
          {[
            '0-10', // Less than $10
            '10-20', // $10-$20
            '20-30', // $20-$30
            '30-40', // $30-$40
            '40-50', // $40-$50
          ].map((priceRange) => (
            <ListItem
              button
              key={priceRange}
              onClick={() => handlePriceRangeChange(priceRange)}
              sx={{
                borderRadius: 1,
                transition: 'background-color 0.2s ease',
                backgroundColor: selectedPriceRange === priceRange ? 'primary.light' : 'transparent',
                color: selectedPriceRange === priceRange ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  backgroundColor: selectedPriceRange === priceRange ? 'primary.light' : 'grey.200',
                },
              }}
            >
              <ListItemText
                primary={
                  priceRange === '0-10'
                    ? 'Less than $10'
                    : `$${priceRange.split('-')[0]}-$${priceRange.split('-')[1]}`
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onFilterChange({ searchQuery: e.target.value });
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={toggleDrawer(true)} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {filterContent}
      </Box>

      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <Divider />
          {filterContent}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;