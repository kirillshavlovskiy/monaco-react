import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useStore } from 'store';
import {MyPaper, CustomTextField} from 'theme';
import {withStyles} from "@material-ui/core/styles";
import ManageAccount from './ManageAccount';

const HOST_URL = 'http://13.60.82.196:8000'

// Custom styled ToggleButton
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: theme.palette.getContrastText('#90CAF9'), // Ensures text is readable
        backgroundColor: '#90CAF9', // The color you specified
        '&:hover': {
            backgroundColor: '#64B5F6', // A slightly darker shade for hover effect
        },
    },
    '&:not(.Mui-selected)': {
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    borderColor: '#90CAF9',
    '&:not(:first-of-type)': {
        borderLeft: '1px solid #90CAF9 !important',
    },
}));


const AuthComponent = () => {
    const [alignment, setAlignment] = useState('Login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { state, actions } = useStore();

    const handleAlignmentChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            setError('');
            setSuccess('');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            let response;
            if (alignment === 'Login') {
                response = await axios.post(`${HOST_URL}/courses/login/`, {
                    username: formData.username,
                    password: formData.password,
                });
                setSuccess('Logged in successfully!');
                actions.setUser(response.data.user);
            } else {
                response = await axios.post(`${HOST_URL}/courses/signup/`, formData);
                setSuccess('User created successfully! Please log in.');
                setAlignment('Login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleLogout = () => {
        actions.setUser(null);
        setSuccess('Logged out successfully!');
    };

    return (
        <MyPaper>
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {state.user ? (
                    <>
                        <Typography component="h1" variant="h5">
                            Welcome, {state.user.username}!
                        </Typography>
                        <Button
                            onClick={handleLogout}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography component="h1" variant="h5">
                            Please Authorize
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleAlignmentChange}
                            aria-label="Authentication mode"
                            sx={{ mb: 2, marginTop: '15px' }}
                        >
                            <StyledToggleButton value="Login">Login</StyledToggleButton>
                            <StyledToggleButton value="Sign Up">Sign-up</StyledToggleButton>
                        </ToggleButtonGroup>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <CustomTextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            {alignment === 'Sign Up' && (
                                <CustomTextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            )}
                            <CustomTextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete={alignment === 'Login' ? "current-password" : "new-password"}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {alignment}
                            </Button>
                        </Box>
                    </>
                )}
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">{success}</Typography>}
            </Box>
        </MyPaper>
    );
};

export default AuthComponent;
