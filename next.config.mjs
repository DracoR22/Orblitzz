/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.externals = config.externals || {};
        config.externals.push(
          {
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil',
          }
        );
    
        return config;
      },
      images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pbs.twimg.com"
            },
            {
              protocol: "https",
              hostname: "images.unsplash.com"
            },
        ]
    }
};

export default nextConfig;
