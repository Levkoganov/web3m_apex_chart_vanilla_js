// Fetch API
const fetchData = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Could not fetch api");

    const data = await response.json();
    return data.map(({ name, market_cap }) => ({ name, market_cap }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

export { fetchData };
