import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: theme.palette.text.primary,
    },
});

export function CustomizedTabs() {
    const theme=useTheme();



    const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: "h5",
            color: theme.palette.text.primary,
            '&.Mui-selected': {
                color: theme.palette.text.primary,
            },
            '&.Mui-focusVisible': {
                backgroundColor: 'transparent',
            },
        }),
    );


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ bgcolor: theme.palette.background.paper}}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example"
                >
                            <StyledTab label="Terminal" />
                            <StyledTab label="Charting Board" />

                        </StyledTabs>
                <Box sx={{ p: 3 }} />
            </Box>
        </Box>
    );
}