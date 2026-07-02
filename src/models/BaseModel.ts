import ModelAttributeType from './types/ModelAttributeType';
import ModelValidation from './validations/ModelValidation';
import axios from 'axios';

class BaseModel {
	id?: number;

	/**
	 * Path to make backend request
	 */
	static url = '';

	/**
	 * Whether or not recaptcha is required to make requests
	 */
	static recaptcha = false;

	/**
	 * Attributes that will be used to save the model
	 */
	static attributes = {} as Record<string, any>;

	constructor(args) {}

	async get() {
		return axios
			.get(
				`${process.env.REACT_APP_API}/${
					(this.constructor as typeof BaseModel).url
				}/${this.id}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: any;
				};
				return response.data;
			});
	}

	async save({ ...params }) {
		const CallerModel = this.constructor as typeof BaseModel;
		const extraParams = {} as Record<string, string>;
		if (CallerModel.recaptcha) {
			extraParams.recaptcha = params.recaptcha;
			extraParams.recaptcha_type = params.recaptchaType;
		}

		const attributes = {} as Record<string, string>;
		const attributeKeys = Object.keys(CallerModel.attributes);
		attributeKeys.forEach((attr) => {
			attributes[attr] = this[attr];
		});

		this.validate();
		if (this.id) {
			// Update
			return axios
				.put(
					`${process.env.REACT_APP_API}/${CallerModel.url}/${this.id}`,
					{
						withCredentials: true,
						...extraParams,
						...attributes,
					}
				)
				.then((res) => {
					const response = res.data as {
						data: any;
					};
					if (response.data && response.data.id) {
						attributeKeys.forEach((attr) => {
							this[attr] = response.data[attr];
						});
						return this;
					}
					throw new Error('No data returned');
				});
		}

		// Insert
		return axios
			.post(
				`${process.env.REACT_APP_API}/${CallerModel.url}`,
				{
					...extraParams,
					...attributes,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: any;
				};
				if (response.data && response.data.id) {
					attributeKeys.forEach((attr) => {
						this[attr] = response.data[attr];
					});
					return this;
				}
				throw new Error('No data returned');
			});
	}

	async delete({ ...params }) {
		const extraParams = {} as Record<string, string>;
		if ((this.constructor as typeof BaseModel).recaptcha) {
			extraParams.recaptcha = params.recaptcha;
			extraParams.recaptcha_type = params.recaptchaType;
		}
		return axios
			.delete(
				`${process.env.REACT_APP_API}/${
					(this.constructor as typeof BaseModel).url
				}/${this.id}`,
				{
					withCredentials: true,
					data: {
						...extraParams,
					},
				}
			)
			.then((res) => {
				const response = res.data as {
					data: any;
				};
				return response;
			});
	}

	static async find({ ...args }) {
		return axios
			.get(`${process.env.REACT_APP_API}/${this.url}`, {
				params: args,
				withCredentials: true,
			})
			.then((res) => {
				const response = res.data as {
					data: any;
				};
				if (response.data && response.data.id) {
					return new this(response.data);
				}
				return null;
			});
	}

	validate() {
		const CallerModel = this.constructor as typeof BaseModel;
		const attributes = CallerModel.attributes;
		const attributeKeys = Object.keys(attributes);

		for (let i = 0; i < attributeKeys.length; i++) {
			const attr = attributeKeys[i];
			if (attr === 'id') {
				continue;
			}

			// Type validation
			const type = attributes[attr].type;
			if (type && this[attr]) {
				switch (type) {
					case ModelAttributeType.NUMBER: {
						if (typeof this[attr] !== 'number') {
							throw new Error(
								`${CallerModel.name}: ${attr} is not number`
							);
						}
						break;
					}
				}
			}

			// Validations
			const validations = attributes[attr].validations as Record<
				string,
				any
			>;
			if (!validations) {
				continue;
			}
			const validationKeys = Object.keys(validations);

			for (let k = 0; k < validationKeys.length; k++) {
				const validationKey = validationKeys[k];

				if (
					validationKey === 'required' &&
					!!validations[validationKey]
				) {
					ModelValidation.isRequired({
						attr,
						value: this[attr],
						item: this,
					});
					continue;
				}

				if (
					validationKey === 'between' &&
					!!validations[validationKey]
				) {
					ModelValidation.between({
						attr,
						value: this[attr],
						item: this,
						...validations[validationKey],
					});
					continue;
				}

				if (typeof validations[validationKey] === 'function') {
					validations[validationKey]({
						attr,
						value: this[attr],
						item: this,
					});
				}
			}
		}
	}
}

export default BaseModel;
