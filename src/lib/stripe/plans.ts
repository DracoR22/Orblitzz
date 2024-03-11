export const PLANS = [
    {
      name: 'Free',
      slug: 'free',
      quota: 10,
      projects: 1,
      repliesPerMonth: 3,
      keywords: 5,
      price: {
        amount: 0,
        priceIds: {
          test: '',
          production: '',
        },
      },
    },
    {
      name: 'Starter',
      slug: 'starter',
      quota: 9,
      projects: 1,
      repliesPerMonth: 20,
      keywords: 5,
      price: {
        amount: 9,
        priceIds: {
          test: 'price_1OTrz5BQbv1xJTDXMdPBZp8k',
          production: '',
        },
      },
    },
    {
      name: 'Pro',
      slug: 'pro',
      quota: 49,
      projects: 1,
      repliesPerMonth: 100,
      keywords: 10,
      price: {
        amount: 49,
        priceIds: {
          test: 'price_1OTrz5BQbv1xJTDXMdPBZp8k',
          production: '',
        },
      },
    },
  ]