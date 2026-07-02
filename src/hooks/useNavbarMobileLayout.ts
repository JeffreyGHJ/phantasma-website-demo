import { Theme, useMediaQuery } from "@mui/material";

const useNavbarMobileLayout = () => {
    const mobileLayout = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down(921)
    );

    return mobileLayout;
};

export default useNavbarMobileLayout;
