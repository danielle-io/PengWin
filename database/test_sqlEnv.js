const ipAddress = 'IP ADDRESS GOES HERE';
const port = ':3000';

function getEnvironment(env) {
	console.log('getting env ');
    return ipAddress + port;
}
var Environment = getEnvironment();

export default Environment;
