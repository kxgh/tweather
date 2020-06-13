var path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: "development",
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'},
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
