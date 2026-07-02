import {
	TransactionReceipt,
	TransactionResponse,
} from '@ethersproject/providers';

import cogoToast from 'cogo-toast';
import { isString } from 'lodash';
import { toastOptions } from '../configs/CogoToast';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

const EXCLUSION_LIST = ['Already processing eth_requestAccounts. Please wait.'];

///rebuild
/**
 * @deprecated see useHandleWeb3Response
 * A generic web3 transaction response handler
 * @param {Object} responseParam
 * @param {string} responseParam.waitingMessage - A message that displays to the user while the transaction is pending
 * @param {string} responseParam.successMessage - A message that displays to the user after the transaction has been confirmed
 * @param {TransactionResponse} responseParam.res - A response object returns from the transaction
 * @param {Function} responseParam.callback - A callback function after the transaction is confirmed
 *
 * @return {void}
 */
export const handleWeb3Reponse = ({
	waitingMessage,
	successMessage,
	 res,
	 callback,
	 }: {
	waitingMessage: string;
	successMessage: string;
	res: TransactionResponse;
	callback?: (receipt: TransactionReceipt) => void;
}) => {
	if (!EXCLUSION_LIST.some((word) => waitingMessage.includes(word))) {
		cogoToast.info(waitingMessage, toastOptions);
	}
	res.wait().then((receipt: TransactionReceipt) => {
		if (callback) {
			callback(receipt);
		}
		if (!EXCLUSION_LIST.some((word) => successMessage.includes(word))) {
			cogoToast.success(successMessage, toastOptions);
		}
	});
};

/**
 * A generic web3 transaction response handler
 * @param {Object} responseParam
 * @param {string} responseParam.waitingMessage - A message that displays to the user while the transaction is pending
 * @param {string} responseParam.successMessage - A message that displays to the user after the transaction has been confirmed
 * @param {TransactionResponse} responseParam.res - A response object returns from the transaction
 * @param {Function} responseParam.callback - A callback function after the transaction is confirmed
 *
 * @return {void}
 */
export const useHandleWeb3Response = () => {
	const { enqueueSnackbar } = useSnackbar();
	return useCallback(
		({
			 waitingMessage,
			 successMessage,
			 res,
			 callback,
		 }: {
			waitingMessage: string;
			successMessage: string;
			res: TransactionResponse;
			callback?: (receipt: TransactionReceipt) => void;
		}) => {
			if (!EXCLUSION_LIST.some((word) => waitingMessage.includes(word))) {
				enqueueSnackbar(waitingMessage, { variant: 'info' });
			}
			res.wait().then((receipt: TransactionReceipt) => {
				if (callback) {
					callback(receipt);
				}
				if (!EXCLUSION_LIST.some((word) => successMessage.includes(word))) {
					enqueueSnackbar(successMessage, { variant: 'success' });
				}
			});
		},
		[enqueueSnackbar]
	);
};

/**
 * A generic web3 transaction error handler
 * @param {Object} err - An error object returned from the transaction
 *
 * @return {void}
 */
export const handleWeb3Error = (err) => {
	if (
		err.message &&
		err.data &&
		err.data.message &&
		!EXCLUSION_LIST.some((word) => err.data.message.includes(word))
	) {
		cogoToast.error(err.data.message, { ...toastOptions });
	} else if (
		err.message &&
		!EXCLUSION_LIST.some((word) => err.message.includes(word))
	) {
		cogoToast.error(err.message, toastOptions);
	} else if (isString(err) && !EXCLUSION_LIST.some((word) => err.includes(word))) {
		cogoToast.error(err, toastOptions);
	} else {
		//cogoToast.error('Unknown error', toastOptions);
	}
	console.log(err);
};

/**

 A generic web3 transaction error handler
 @param {Object} err - An error object returned from the transaction
 @return {void}
 */
export const useHandleWeb3Error = () => {
	const { enqueueSnackbar } = useSnackbar();
	return useCallback(
		({ err, callback }: { err: any; callback?: () => void }) => {
			if (
				err.message &&
				err.data &&
				err.data.message &&
				!EXCLUSION_LIST.some((word) => err.data.message.includes(word))
			) {
				enqueueSnackbar(err.data.message, { variant: 'error' });
			} else if (err.message && !EXCLUSION_LIST.some((word) => err.message.includes(word))) {
				enqueueSnackbar(err.message, { variant: 'error' });
			} else if (isString(err) && !EXCLUSION_LIST.some((word) => err.includes(word))) {
				enqueueSnackbar(err, { variant: 'error' });
			} else {
				//enqueueSnackbar('Unknown error', { variant: 'error' });
			}
			if (callback) {
				callback();
			}
			console.log(err);
		},
		[enqueueSnackbar]
	);
};
