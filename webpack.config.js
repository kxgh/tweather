var path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: "production",
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    devServer: {
        contentBase: './dist'
    },
    /*devtool: 'inline-source-map',*/
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'},
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }, {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
