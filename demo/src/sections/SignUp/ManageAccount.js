import React from 'react';
import {
    Typography,
    Button,
    Box,
} from '@mui/material';
import { useStore } from 'store';
import { MyPaper, CustomTextField } from 'theme';

const ManageAccount = () => {
    const { state, actions } = useStore();
    const user = state.user;

    const handleLogout = () => {
        actions.setUser(null);
        // You might want to add additional logout logic here,
        // such as clearing local storage or calling a logout API
    };

    return (
        <MyPaper>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Account Management
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Welcome, {user.username}!
                </Typography>
                <CustomTextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    value={user.username}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                {user.email && (
                    <CustomTextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        value={user.email}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{ mt: 3 }}
                >
                    Logout
                </Button>
            </Box>
        </MyPaper>
    );
};

export default ManageAccount;