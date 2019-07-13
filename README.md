# TPTBlockchain

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy

To build the project for production Run `ng build --prod --base-href /TPTBlockchain/`.
Then copy paste the .htaccess file into the dist/TPTBlockchain directory.
Finally copy paste the dist/TPTBlockchain directory (only the /TPTBlockchain part) on your Apache server root directory.
The project is then deployed on http://yourApacheServerRootURL/TPTBlockchain

# NodeServer

The NodeServer directory contains our REST API which is used by our angular project

## Development server

For the first time Run `npm install` in the NodeServer directory to install the required dependencies.
Then simply Run `node index.js` to launch the development server. This will launch the server on `https://localhost:8086/`.
We used a self-signed ssl certificat, don't forget to navigate to `https://localhost:8086/` and add the exception to your browser.

## Deploy

To Deploy NodeServer we used the npm forever package.
For the first time Run `npm install forever -g`.
Then Run `forever start /path/to/NodeServer/index.js`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
