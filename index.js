const http = require("http");
const https = require('https');

const port = process.argv[2] || 8081;

http.createServer(function (request, response) {
	const getRequest = https.get('https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data', getResponse => {
		console.log(`statusCode: ${getResponse.statusCode}`);

		let data = '';
		getResponse.on('data', d => {
			data += d;
		});

		getResponse.on('end', d => {
			const json = JSON.parse(data);

			let html = '<!DOCTYPE html><html><body style="font-size: 30px; padding: 15px;"><style>.vpn-true{color: green;} .vpn-false{color: red;}</style>';
			html += '<div>IP: <strong>' + json.ip + '</strong></div>';
			html += '<div>ISP: <strong>' + json.isp + '</strong></div>';
			html += '<div>VPN enabled: <strong class="vpn-' + json.status + '">' + json.status + '</strong></div>';
			html += '</body></html>';

			response.setHeader('Content-type', 'text/html');
			response.end(html);
		});
	});

	getRequest.on('error', error => {
		console.error(error);
	});

	getRequest.end();

}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);