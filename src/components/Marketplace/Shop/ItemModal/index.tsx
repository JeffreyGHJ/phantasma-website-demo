import React, { useState, useEffect, useCallback } from 'react';
import { Menu, MenuItem } from "@mui/material";
import Web3 from 'web3';
import CloseIcon from "@mui/icons-material/Close";
import CurrencyIcon from "../../../CurrencyIcon";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Modal from "../../../widgets/Modal";
import {useActiveWeb3React} from "../../../../hooks";
import "./index.scss";
import ectoTokenAbi from "../../../../constants/abis/bsc/EctoTokenAbi";
import {AbiItem} from "web3-utils";
import genericErc20ABI from "../../../../constants/abis/genericErc20ABI";
import {ectoContractAddress} from "../../../../constants/ContractAddresses";
import {activeNode} from "../../../../constants/Nodes";
import cogoToast from 'cogo-toast';
import _ from "lodash";
import {toastOptions} from "../../../../configs/CogoToast";
import {handleWeb3Error} from "../../../../utils/Web3ResponseUtil";

const web3 = new Web3(activeNode);

const ectoABI= [{"inputs":[{"internalType":"address","name":"_oldContractAddress","type":"address"},{"internalType":"address","name":"_routerAddress","type":"address"},{"internalType":"address","name":"_rewardToken","type":"address"},{"internalType":"address","name":"_teamWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_address","type":"address"}],"name":"AddedToCirculatingSupplyExclusion","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"adr","type":"address"}],"name":"Authorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"distributor","type":"address"}],"name":"DistributorChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_address","type":"address"}],"name":"RemovedFromCirculatingSupplyExclusion","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newRouterAddress","type":"address"}],"name":"RouterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newTeamWallet","type":"address"}],"name":"TeamWalletChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"TradingStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"adr","type":"address"}],"name":"Unauthorized","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_walletMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"addToCirculatingSupplyExclusion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"airdropper","outputs":[{"internalType":"contract Airdropper","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"authorize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newinPeriod","type":"uint256"},{"internalType":"uint256","name":"newMinDistribution","type":"uint256"}],"name":"changeDistributionCriteria","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gas","type":"uint256"}],"name":"changeDistributorSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiqFee","type":"uint256"},{"internalType":"uint256","name":"newRewardFee","type":"uint256"},{"internalType":"uint256","name":"newExtraSellFee","type":"uint256"}],"name":"changeFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"changeIsDividendExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"changeIsFeeExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"changeIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newValue","type":"bool"}],"name":"changeRestrictWhales","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"bool","name":"chargeTxFee","type":"bool"}],"name":"changeRewardToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"enableSwapBack","type":"bool"},{"internalType":"uint256","name":"newSwapBackLimit","type":"uint256"}],"name":"changeSwapBackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"changeTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"changeWalletLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"circulatingSupplyExclusions","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"dividendDistributor","outputs":[{"internalType":"contract DividendDistributor","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"extraFeeOnSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"isAuthorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDividendExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isFeeExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isTxLimitExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"oldEctoContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"removeFromCirculatingSupplyExclusion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"restrictWhales","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardsFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newDistributor","type":"address"}],"name":"switchDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newRouterAddress","type":"address"}],"name":"switchRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newTeamWallet","type":"address"}],"name":"switchTeamWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"teamWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFeeIfSelling","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"tradingOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"newStatus","type":"bool"}],"name":"tradingStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"adr","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"unauthorize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const ectoContract = new web3.eth.Contract(ectoABI as AbiItem[], ectoContractAddress);
const ItemModal = ({
                       open,
                       closeModal,
                       item,
                       currency,
                       SUPPORTED_CURRENCIES
                   }) => {
    const { account,library } = useActiveWeb3React();
    const [activeCurrency, setActiveCurrency] = useState("");
    const [approved, setApproved] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [anchor, setAnchor] = useState(null);
    const [checkingApproval, setCheckingApproval] = useState(true);

    const optionsOpen = Boolean(anchor !== null);
    const openMenu = (e) => setAnchor(e.currentTarget);
    const closeMenu = () => setAnchor(null);


    useEffect(() => {
        if (item[currency.toLowerCase()]) setActiveCurrency(currency);
        else {
            for (let c of SUPPORTED_CURRENCIES) {
                if (item[c.toLowerCase()]) setActiveCurrency(c);
            }
        }
    }, [item, currency, SUPPORTED_CURRENCIES]);

    useEffect(() => {
        if(account) {
            setCheckingApproval(true);
            if (currency.toLowerCase() !== 'ecto') {
                setCheckingApproval(false);
            }
            if (currency.toLowerCase() === 'ecto') {
                // After the check
                ectoContract.methods.allowance(account, item.contractAddress).call({from: account})
                    .then(allowanceValue => {
                        if (Number(allowanceValue) > 0) {
                            setApproved(true);
                            setCheckingApproval(false);
                        } else {
                            setApproved(false);
                            setCheckingApproval(false);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching allowance:", error);
                    });
            }
        }
    }, [account, item.contractAddress, ectoContract,currency]);

    const handleApprove = useCallback(() => {
        if(account) {
            if (!approved) {
                const encoded = ectoContract.methods.approveMax(item.contractAddress).encodeABI();

                library?.getSigner()
                    .sendTransaction({
                        from: account || '',
                        to: ectoContractAddress,
                        data: encoded,
                    })
                    .then(result => {
                        if (result.hash) {
                            setApproved(true);
                        }
                    })
                    .catch(error => {
                        console.error("Error during the approval process:", error);
                    });
            }
        }
    }, [account, item.contractAddress, approved, ectoContract, library]);



    const handlePurchase = useCallback(() => {
        if(account) {
            const itemContract = new web3.eth.Contract(item.abi as AbiItem[], item.contractAddress);

            if (itemContract.methods[item.method]) {
                // Determine encoding based on item.free
                const methodArgs = [quantity];
                let encoded;

                if (item.free) {
                    encoded = itemContract.methods[item.method]().encodeABI();
                } else {
                    encoded = itemContract.methods[item.method](...methodArgs).encodeABI();
                }

                // Define the transaction object
                const txObject = {
                    from: account || '',
                    to: item.contractAddress,
                    data: encoded,
                    value: "0"
                };

                // If item costs BNB, adjust the value of the transaction based on quantity
                if (item.bnb) {
                    const totalCost = Number(item.bnb) * quantity;
                    txObject.value = web3.utils.toWei(totalCost.toString(), 'ether');
                }

                let tx = item.free ? {
                    from: account || '',
                    to: item.contractAddress,
                    data: encoded
                } : txObject

                library?.getSigner()
                    .sendTransaction(tx)
                    .then(result => {
                        // Handle purchase success or failure
                    })
                    .catch((err) => {
                        handleWeb3Error({err});
                        if (
                            err.data &&
                            err.data.message &&
                            _.isString(err.data.message) &&
                            err.data.message.includes("Address has already minted a token")
                        ) {
                            cogoToast.warn(
                                `You've already minted a token from this contract. You can only get one.`,
                                {hideAfter: 5}
                            );
                        }
                        if (
                            err.data &&
                            err.data.message &&
                            _.isString(err.data.message) &&
                            err.data.message.includes("insufficient funds")
                        ) {
                            cogoToast.warn(
                                `You do not have enough BNB to complete the purchase.`,
                                {hideAfter: 5}
                            );
                        }

                        if (
                            err.data &&
                            err.data.message &&
                            _.isString(err.data.message) &&
                            err.data.message.includes("Insufficient Balance")
                        ) {
                            cogoToast.warn(
                                `You do not have enough ECTO to complete the purchase.`,
                                {hideAfter: 5}
                            );
                        }
                    });
            } else {
                console.warn(`Method ${item.method} does not exist on the contract.`);
            }
        }
    }, [account, item, library]);



    return (
        <Modal className="item-modal" open={open} onClose={closeModal}>
            <CloseIcon onClick={closeModal} className="close-btn" />
            <div id="modal-header">{item?.name && item.name}</div>
            <div id="modal-body">
                {item && (
                    <>
                        {item?.image_source && (
                            <div className="img-container">
                                <img
                                    className="img"
                                    src={`${process.env.PUBLIC_URL}${item.image_source}`}
                                />
                            </div>
                        )}
                        {item[activeCurrency.toLowerCase()] !== undefined && (
                            <>
                                <div className="item-price" onClick={openMenu}>
                                    <CurrencyIcon currency={activeCurrency} />
                                    <div className="item-value">
                                        {item[activeCurrency.toLowerCase()].toLocaleString() || "-"}
                                    </div>
                                    <PlayArrowIcon
                                        className={"icon" + (optionsOpen ? " icon-rotate " : "")}
                                    />
                                </div>
                                <Menu
                                    anchorEl={anchor}
                                    open={optionsOpen}
                                    onClose={closeMenu}
                                    id="currency-menu"
                                >
                                    {SUPPORTED_CURRENCIES.filter(
                                        (c) => item[c.toLowerCase()] !== undefined
                                    ).map((currency) => (
                                        <MenuItem
                                            onClick={() => {
                                                setActiveCurrency(currency);
                                                closeMenu();
                                            }}
                                            className="currency-option"
                                        >
                                            <CurrencyIcon currency={currency} />
                                            {item[currency.toLowerCase()].toLocaleString()}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </>
                )}
            </div>
            <div id="modal-footer">
                {checkingApproval ? (
                    <div className="btn" style={{ backgroundColor: 'transparent', pointerEvents: 'none', opacity: '0.5' }}>Checking Approval...</div>
                ) : activeCurrency.toLowerCase() === 'ecto' && !approved ? (
                    <div className="btn" onClick={handleApprove}>Approve Currency</div>
                ) : (
                    <div className="btn" onClick={handlePurchase}>Purchase</div>
                )}
            </div>
            <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                >
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>


        </Modal>
    );
}

export default ItemModal;
