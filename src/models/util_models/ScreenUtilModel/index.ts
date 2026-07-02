class ScreenUtilModel {
	static getWindowSize() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}
}

export default ScreenUtilModel;
