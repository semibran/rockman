module.exports = function Input(controls, update) {

	var result = {}

	return function input(keys, ...data) {
		if (update)
			update(parse(keys), ...data)
	}

	function parse(keys) {
		for (let name in controls) {
			let code = controls[name]
			result[name] = keys[code] || 0
		}
		return result
	}
}
