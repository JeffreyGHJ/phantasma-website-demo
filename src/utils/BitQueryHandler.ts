import { isAddress } from ".";

export const timestampFormat = "%Y-%m-%dT%H:%M:%SZ";

type BitQueryHandlerOptions = {
	action: string;
	params: object;
	success: Function | undefined;
	error: Function | undefined;
};

export class BitQueryHandler {
	public static ACTIONS = {
		RUGPULL_INFO: "rugpullInfo",
		RUGPULL_TRANSFERS: "rugpullTransfers",
		RUGPULL_DEX: "rugpullDex",
		WHALE_RADAR: "whaleRadar",
	};
	private responseData: any;
	private error: any;
	private API = process.env.REACT_APP_API;
	private options: BitQueryHandlerOptions = {
		action: "",
		params: {},
		success: undefined,
		error: undefined,
	};

	constructor(options: BitQueryHandlerOptions) {
		this.options = { ...this.options, ...options };
	}

	public fetchData = () => {
		if (!this.API || !this.options.action || !this.validateParams()) {
			return;
		}
		const searchParams = new URLSearchParams();
		Object.keys(this.options.params).forEach((key) => {
			searchParams.append(key, this.options.params[key]);
		});
		return fetch(
			`${this.API}/${this.options.action}?${new URLSearchParams(
				searchParams
			).toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
				mode: "cors",
			}
		)
			.then((response) => response.json())
			.then((data) => {
				this.responseData = data;
				if (this.options.success) {
					this.options.success(data);
				}
			})
			.catch((err) => {
				if (this.options.error) {
					this.options.error(err);
				}
				this.handleErrorResponse(err);
			});
	};

	public validateParams = () => {
		const actionValidators = {
			[BitQueryHandler.ACTIONS.RUGPULL_INFO]: (params) => {
				if (!isAddress(params.symbol)) {
					return false;
				}
				return true;
			},
			[BitQueryHandler.ACTIONS.RUGPULL_TRANSFERS]: (params) => {
				if (!isAddress(params.sender)) {
					return false;
				}
				params.currencies = JSON.stringify(params.currencies);
				this.options.params = { ...this.options.params, ...params };
				return true;
			},
			[BitQueryHandler.ACTIONS.RUGPULL_DEX]: (params) => {
				if (!isAddress(params.sender) || !isAddress(params.currency)) {
					return false;
				}
				this.options.params = { ...this.options.params, ...params };
				return true;
			},
			[BitQueryHandler.ACTIONS.WHALE_RADAR]: (params) => {
				return true;
			},
		};
		return actionValidators[this.options.action](this.options.params);
	};

	public checkResponseErrors() {
		const res = this.responseData;
		let errorMsg = "";
		if (res.errors && res.errors.length > 0) {
			// This happens when arguments are in a wrong format ex. passing unstrigified array
			errorMsg = res.errors[0].message;
		} else if (res.data.errors && res.data.errors.length > 0) {
			// This happens when wallet address or the whole query is not formatted correctly and maybe more
			errorMsg = res.data.errors[0].message;
		}
		return errorMsg;
	}

	public handleErrorResponse(err) {
		console.error("Error:", err);
	}
}
