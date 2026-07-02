import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {TextField} from "@material-ui/core";
import {ButtonContainer} from "../../lib/ButtonContainer";
const Web3 = require('web3');
const web3 = new Web3(process.env.REACT_APP_NETWORK_URL || 'https://bsc-dataseed1.binance.org/');

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
    },
}));

export default function PopUpModal() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [receiver, setReceiver] = React.useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Send Now</h2>
            <p id="simple-modal-description">
                You will never get this back. Make sure the address is correct.
            </p>
            <TextField required id="standard-required" label="Required" defaultValue="Enter Address" />
            <button type="button" onClick={handleOpen}>
                Send Now
            </button>
        </div>
    );

    return (
        <div>
        <ButtonContainer onClick={handleOpen}>
                Send
        </ButtonContainer>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}