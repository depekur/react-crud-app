module.exports = {
	    entry: "./scripts/app.jsx",
	    output: {
	        path: "./scripts/build",
	        filename: "bundle.js"
	    },

	    module: {
		  loaders: [
		    {
		      test: /\.jsx?$/,
		      exclude: /(node_modules)/,
		      loader: 'babel',
		    }
		  ]
		}
};

