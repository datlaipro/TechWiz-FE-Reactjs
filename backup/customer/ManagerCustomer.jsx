// import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ConfirmDeleteModal from '../../components/ConfirmDeleteModal'; // Gọi modal xác nhận xóa
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// import { Container, Typography, TextField, Button, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Link } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import axios from 'axios';
// import Grid from '@mui/material/Grid2';


// const theme = createTheme({
//   typography: {
//     fontFamily: 'Roboto, sans-serif',
//   },
//   palette: {
//     primary: {
//       main: '#3498db',
//     },
//     secondary: {
//       main: '#E1306C',
//     },
//   },
// });

// function ManagerCustomer() {
//   const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'firstName', headerName: 'Full name', width: 130 },
//     { field: 'lastName', headerName: 'User name', width: 130 },
//     {field: 'age', headerName: 'Email', type: 'number', width: 90,},
//     {field: 'fullName', headerName: 'Phone Number', description: 'This column has a value getter and is not sortable.',sortable: false,width: 160,valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,},
//     { field: 'lastName', headerName: 'Gender', width: 130 },
 
 
//   ];
  
//   const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//   ];
  
//   const paginationModel = { page: 0, pageSize: 5 };
//   // const [fullName, setFullName] = useState('');
//   // const [username, setUsername] = useState('');
//   // const [email, setEmail] = useState('');
//   // const [phoneNumber, setPhoneNumber] = useState('');
//   // const [password, setPassword] = useState('');
//   // const [confirmPassword, setConfirmPassword] = useState('');
//   // const [gender, setGender] = useState('');
//   // const [error, setError] = useState('');
//   // const [success, setSuccess] = useState('');

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (password !== confirmPassword) {
//   //     setError('Passwords do not match');
//   //     return;
//   //   }

//         // Log dữ liệu sẽ được gửi
//     // const postData = { fullName, username, email, phoneNumber, password, gender };
//     // console.log('Data to send:', postData);
//         // Log dữ liệu sẽ được gửi

//     // try {
//     //   const response = await axios.post('http://localhost:3000/phpm/ManagerCustomer.php', { fullName, username, email, phoneNumber, password, gender });
//     //   if (response.data.success) {
//     //     setSuccess('Registration successful');
//     //     setError('');
//     //   } else {
//     //     setError(response.data.message);
//     //   }
//     // } catch (error) {
//     //   console.error('Error registering:', error);
//     //   setError('An error occurred. Please try again later.');
//     // }
//   // };

//   return (
//     <ThemeProvider theme={theme}>
//       {/* <div style={{ backgroundImage: 'url(../sp/sp3.png)', height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           height: '100%',
//           width: '100%',
//           background: 'rgba(227, 244, 251, 0.5)',
//         }}></div> */}
//         {/* <Container maxWidth="md" sx={{
//           // backgroundColor: 'rgba(31, 81, 93, 0.8)',
//           // // padding: 5,
//           // borderRadius: 2,
//           // textAlign: 'center',
//           // position: 'absolute',
//           // top: '50%',
//           // left: '50%',
//           // transform: 'translate(-50%, -50%)',
//           // zIndex: 2,
//         }}> */}
//           <Typography variant="h4" component="h1" gutterBottom color="black">Manager Customer Account</Typography>
//           {/* {error && <Typography variant="body2" color="error">{error}</Typography>}
//           {success && <Typography variant="body2" color="primary">{success}</Typography>} */}
//           {/* <form onSubmit={handleSubmit}> */}

//           <form >
//             <Grid container spacing={2} alignItems="stretch" justifyContent="center">
//               <Grid item xs={12} sm={10}>
//                 <TextField
//                   fullWidth
//                   label="Full Name"
//                   variant="outlined"
//                   margin="normal"
//                   // value={fullName}
//                   // onChange={(e) => setFullName(e.target.value)}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>

//                 <TextField
//                   fullWidth
//                   label="Username"
//                   variant="outlined"
//                   margin="normal"
//                   // value={username}
//                   // onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   variant="outlined"
//                   margin="normal"
//                   // value={email}
//                   // onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Phone Number"
//                   variant="outlined"
//                   margin="normal"
//                   // value={phoneNumber}
//                   // onChange={(e) => setPhoneNumber(e.target.value)}
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="password"
//                   label="Password"
//                   variant="outlined"
//                   margin="normal"
//                   // value={password}
//                   // onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="password"
//                   label="Confirm Password"
//                   variant="outlined"
//                   margin="normal"
//                   // value={confirmPassword}
//                   // onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//               </Grid>
//             </Grid>


//             <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
//               <FormControl component="fieldset" margin="normal">
//                 <FormLabel component="legend" sx={{ color: 'black' }}>Gender</FormLabel>
//                 <RadioGroup
//                   row
//                   // value={gender}
//                   // onChange={(e) => setGender(e.target.value)}
//                 >
//                   <FormControlLabel value="male" control={<Radio />} label="Male" />
//                   <FormControlLabel value="female" control={<Radio />} label="Female" />
//                   <FormControlLabel value="preferNotToSay" control={<Radio />} label="Prefer not to say" />
//                 </RadioGroup>
//               </FormControl>

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//                 sx={{ paddingY: 1.5, fontSize: '16px', mt: 2 }}
//               >
//                 Register
//               </Button>
//             </Grid>


//           </form>
//         {/* </Container> */}
//       {/* </div> */}
//       <Box sx={{ display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
//     <Paper sx={{ height: 400, width: '60%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{ pagination: { paginationModel } }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         sx={{ border: 0 }}
//       />
//     </Paper>
//  </Box>
//     </ThemeProvider>
//   );
// }





// export default ManagerCustomer;
