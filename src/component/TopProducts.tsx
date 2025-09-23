type Product = {
  name: string;
  price: string;
  code: string;
  image: string;
};

const topProducts: Product[] = [
  {
    name: 'Apple iPhone 13',
    price: '999.000',
    code: ' #FXZ-4567',
    image: 'https://i.pravatar.cc/40',
  },
  {
    name: 'Nike Air Jordan',
    price: '72.400',
    code: ' #FXZ-4567',
    image: 'https://i.pravatar.cc/40',
  },
  {
    name: 'T-shirt',
    price: '35.400',
    code: ' #FXZ-4567',
    image: 'https://i.pravatar.cc/40',
  },
  {
    name: 'Assorted Cross Bag',
    price: '80.000',
    code: ' #FXZ-4567',
    image: 'https://i.pravatar.cc/40',
  },
];

const TopProducts = () => {
  return (
    <div className="bg-white dark:bg-boxdark p-5 rounded-xl shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-semibold text-secondaryBrand dark:text-gray">
          Produk Terlaris
        </h2>
        <a href="#" className="text-[12px] text-presentase text-blue-500">
          Semua Produk
        </a>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-full border rounded px-3 py-1 mb-4 text-sm"
      />
      <ul className="space-y-3">
        {topProducts.map((product, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-2 bg-white dark:bg-boxdark  shadow-md"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded"
            />
            <div>
              <h4 className="font-medium text-sm">{product.name}</h4>
              <p className="text-gray-400 text-xs">Barang : {product.code}</p>
            </div>
            <span className="ml-auto text-sm font-semibold">
              Rp.  {product.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;
