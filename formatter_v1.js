function formatter(data) {
	let template = [];

	var tabs = 0;
	for (let cdot = 0; cdot < JSON.stringify(data).length; cdot++) {
		let plant = JSON.stringify(data)[cdot];
		switch (plant) {
			case '{':
			case '[':
				tabs++;
				template.push(plant);
				template.push('\n');
				for (let i = 0; i < tabs; i++) {
					template.push('\t');
				}
				break;
			case '}':
			case ']':
				tabs--;
				template.push('\n');
				for (let i = 0; i < tabs; i++) {
					template.push('\t');
				}
				template.push(plant);
				break;
			case ',':
				template.push(plant);
				template.push('\n');
				for (let i = 0; i < tabs; i++) {
					template.push('\t');
				}
				break;
			default:
				template.push(plant);
		}
	}

	return template.join('');
}

module.exports = {formatter}
