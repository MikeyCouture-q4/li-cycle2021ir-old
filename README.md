# Q4 Blank Template

Project Blank

## Installing
Please don't edit files in the `dist` subdirectory as they are generated via Grunt. You'll find source code in the `src` subdirectory!

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that Grunt's CLI is installed by running `grunt --version`.  If the command isn't found, run `npm install -g grunt-cli`.  For more information about installing Grunt, see the [getting started guide](http://gruntjs.com/getting-started).

1. Fork and clone the repo.
2. Run `npm install` to install all dependencies (including Grunt).
3. Run `grunt` to grunt this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Documentation
SassDoc & JSDoc are located in the `docs` directory. Run `grunt` to update docs.

## Additional

If you want to setup your environment to work from blank, and already run apache follow the setups below to add a virtual host

For Window users using Apache 2.4+

	1. Stop Apache
	2. Open notepad.exe as admin
	3. Open C:\xampp\apache\conf\extra\httpd-vhost.conf
	4. Paste the below to the bottom of the file replacing `D:/q4-blank_template/` with the correct path to the repo

		NameVirtualHost *:80
		<VirtualHost *:80>
			DocumentRoot "D:"
			ServerName localhost
		</VirtualHost>

		<VirtualHost *:80>
			DocumentRoot "D:/q4-blank_template/dist"
			ServerName blank.dev
			ServerAlias www.blank.dev
			<Directory "D:/q4-blank_template/dist">
				AllowOverride All
				Require all Granted
			</Directory>
		</VirtualHost>

	5. Save
	6. Open C:/Windows/System32/drivers/etc/hosts
	7. Paste to the bottom of your host file

		127.0.0.1             localhost
		127.0.0.1             blank.dev
		127.0.0.1             www.blank.dev

	8. Save
	9. Restart Apache

For OSX users using Apache 2.4+

	1. Using finder, navigate to the apache configuration files (/etc/apache2/extra/httpd-vhost.conf)
	2. Replace or add the below to the bottom of the file replacing `/Volumes/Drive/q4-blank_template` with the correct path to the repo

		<VirtualHost *:80>
			DocumentRoot "/Volumes/VITALIZ Q4/Q4 FED"
			ServerName localhost
		</VirtualHost>
		<VirtualHost *:80>
			DocumentRoot "/Volumes/Drive/q4-blank_template/dist"
			ServerName blank.dev
			ServerAlias www.blank.dev
			<Directory "/Volumes/Drive/q4-blank_template"/dist>
				AllowOverride All
				Require all Granted
			</Directory>
		</VirtualHost>

	3. Save (you will be asked for your password for overwrite permissions)
	4. Using finder, navigate to your host file (/etc/hosts)
	5. Make sure the following lines are in your host file

		127.0.0.1             localhost
		127.0.0.1             blank.dev
		127.0.0.1             www.blank.dev

	6. Save
	7. Restart Apache