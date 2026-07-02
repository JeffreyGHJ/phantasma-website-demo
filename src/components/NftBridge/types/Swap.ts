type Swap = {
	sender: string;
	from_chain: number;
	from_chain_name: string;
	from_chain_token_name: string;
	from_chain_token_address: string;
	from_chain_block: number;
	from_chain_swap_tx: string;
	from_chain_backward_swap_tx: string;
	token_ids: Array<number>;
	recipient: string;
	to_chain: number;
	to_chain_name: string;
	to_chain_token_address: string;
	to_chain_fill_tx: string;
	to_chain_backward_fill_tx: string;
	to_chain_block: number;
	status: number;
	status_name: string;
	created_at: string;
};

export default Swap;
