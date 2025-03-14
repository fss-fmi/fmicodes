//@ts-check
const createNextIntlPlugin = require('next-intl/plugin');

const { composePlugins, withNx } = require('@nx/next');
const { withAxiom } = require('next-axiom');
const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(node)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    });
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
  withAxiom,
];

module.exports = composePlugins(...plugins)(nextConfig);
