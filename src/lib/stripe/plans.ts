export const PLANS = [
    {
      name: 'Free',
      slug: 'free',
      projects: 1,
      repliesPerMonth: 2,
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
      projects: 1,
      repliesPerMonth: 20,
      keywords: 5,
      price: {
        amount: 9,
        priceIds: {
          test: 'price_1P10MyAywmX0gCrJ1qZ0hZ26',
          production: '',
        },
      },
    },
    {
      name: 'Pro',
      slug: 'pro',
      projects: 2,
      repliesPerMonth: 100,
      keywords: 10,
      price: {
        amount: 49,
        priceIds: {
          test: 'price_1P10NuAywmX0gCrJns5Nj3eV',
          production: '',
        },
      },
    },
  ]